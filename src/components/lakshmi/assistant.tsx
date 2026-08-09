"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import {
  getGreeting,
  getLakshmiResponse,
  setLakshmiCatalog,
  textForSpeech,
  type LakshmiLang,
  type LakshmiReply,
  type ProductSuggestion,
} from "./responses";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: ProductSuggestion[];
  quickReplies?: string[];
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickFemaleVoice(lang: LakshmiLang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferLang = lang === "te" ? ["te-IN", "te", "hi-IN", "en-IN"] : ["en-IN", "en-GB", "en-US", "en"];
  const femaleHints =
    /female|woman|zira|sara|samantha|veena|kalpana|neerja|raveena|priya|heera|google UK English Female|microsoft/i;

  for (const code of preferLang) {
    const matched = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(code.toLowerCase())
    );
    const female = matched.find((v) => femaleHints.test(v.name));
    if (female) return female;
    if (matched[0]) return matched[0];
  }

  const anyFemale = voices.find((v) => femaleHints.test(v.name));
  return anyFemale ?? voices[0] ?? null;
}

function speakText(text: string, lang: LakshmiLang, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis)
    return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(textForSpeech(text));
  utter.lang = lang === "te" ? "te-IN" : "en-IN";
  utter.rate = 0.92;
  utter.pitch = 1.05;
  const voice = pickFemaleVoice(lang);
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

export function LakshmiAssistant() {
  const { products } = useCatalog();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LakshmiLang>("te");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(true);
  const [voicesReady, setVoicesReady] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speakOnRef = useRef(speakOn);
  const langRef = useRef(lang);

  useEffect(() => {
    setLakshmiCatalog(products);
  }, [products]);

  useEffect(() => {
    speakOnRef.current = speakOn;
  }, [speakOn]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const ready = () => setVoicesReady(true);
    ready();
    window.speechSynthesis.addEventListener("voiceschanged", ready);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", ready);
  }, []);

  useEffect(() => {
    if (!open || messages.length) return;
    const greeting = getGreeting(lang);
    const msg: ChatMessage = {
      id: uid(),
      role: "assistant",
      text: greeting.text,
      quickReplies: greeting.quickReplies,
    };
    setMessages([msg]);
    if (speakOn) speakText(greeting.text, lang, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- greet once on first open
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const pushAssistant = useCallback(
    (reply: LakshmiReply) => {
      const msg: ChatMessage = {
        id: uid(),
        role: "assistant",
        text: reply.text,
        products: reply.products,
        quickReplies: reply.quickReplies,
      };
      setMessages((prev) => [...prev, msg]);
      speakText(reply.text, langRef.current, speakOnRef.current);
    },
    []
  );

  const handleUserMessage = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || typing) return;

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "user", text },
      ]);
      setInput("");
      setTyping(true);

      const delay = 600 + Math.min(900, text.length * 18);
      window.setTimeout(() => {
        const reply = getLakshmiResponse(text, langRef.current);
        setTyping(false);
        pushAssistant(reply);
      }, delay);
    },
    [typing, pushAssistant]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUserMessage(input);
  };

  const toggleSpeak = () => {
    setSpeakOn((prev) => {
      if (prev && typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
      const next = !prev;
      toast.message(next ? "Voice on" : "Voice off", {
        description: next
          ? "Lakshmi will speak her replies"
          : "Replies are silent",
      });
      return next;
    });
  };

  const toggleMic = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      toast.error(
        lang === "te"
          ? "మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్ సపోర్ట్ చేయదు"
          : "Voice input is not supported in this browser"
      );
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.lang = lang === "te" ? "te-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        if (transcript.trim()) handleUserMessage(transcript);
      };
      recognition.onerror = (event) => {
        setListening(false);
        if (event.error !== "aborted" && event.error !== "no-speech") {
          toast.error(
            lang === "te" ? "మైక్ లోపం" : `Mic error: ${event.error}`
          );
        }
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    } catch {
      setListening(false);
      toast.error(
        lang === "te"
          ? "మైక్ ప్రారంభించలేకపోయాం"
          : "Could not start the microphone"
      );
    }
  };

  const resetWithLang = (next: LakshmiLang) => {
    setLang(next);
    toast.message(next === "te" ? "లక్ష్మి · తెలుగు" : "Lakshmi · English", {
      description:
        next === "te"
          ? "సంభాషణ తెలుగులో కొనసాగుతుంది"
          : "Conversation continues in English",
    });
    const greeting = getGreeting(next);
    setMessages([
      {
        id: uid(),
        role: "assistant",
        text: greeting.text,
        quickReplies: greeting.quickReplies,
      },
    ]);
    speakText(greeting.text, next, speakOnRef.current);
  };

  return (
    <>
      {/* Floating FAB — bottom right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              key="lakshmi-panel"
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-[min(100vw-2rem,400px)] h-[min(72vh,560px)] flex flex-col overflow-hidden rounded-2xl border border-gold/40 shadow-[0_24px_80px_rgba(45,8,18,0.55)]"
              style={{
                background:
                  "linear-gradient(165deg, rgba(45,8,18,0.92) 0%, rgba(74,14,31,0.88) 45%, rgba(10,10,10,0.94) 100%)",
                backdropFilter: "blur(24px) saturate(140%)",
                WebkitBackdropFilter: "blur(24px) saturate(140%)",
              }}
              role="dialog"
              aria-label="Lakshmi AI shopping assistant"
            >
              {/* Header */}
              <header className="relative shrink-0 px-4 pt-4 pb-3 border-b border-gold/25">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold via-gold-soft to-bronze flex items-center justify-center shadow-[0_0_20px_rgba(201,169,98,0.35)]">
                      <span className="font-serif text-maroon-deep text-lg font-semibold">
                        ల
                      </span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-maroon-deep" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-pearl text-xl tracking-wide leading-tight">
                      Lakshmi
                    </h2>
                    <p className="font-telugu text-gold text-xs mt-0.5 truncate">
                      {BRAND.quoteTelugu}
                    </p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-pearl/45 mt-1">
                      RN Concierge · Showroom guide
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        resetWithLang(lang === "te" ? "en" : "te")
                      }
                      className="px-2 py-1 rounded-md text-[10px] tracking-widest uppercase border border-gold/35 text-gold hover:bg-gold/10 transition"
                      aria-label="Toggle language"
                      title="Language"
                    >
                      {lang === "te" ? "TE" : "EN"}
                    </button>
                    <button
                      type="button"
                      onClick={toggleSpeak}
                      className="p-1.5 rounded-md text-gold/80 hover:text-gold hover:bg-gold/10 transition"
                      aria-label={speakOn ? "Mute voice" : "Enable voice"}
                    >
                      {speakOn ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setListening(false);
                        recognitionRef.current?.abort();
                        window.speechSynthesis?.cancel();
                      }}
                      className="p-1.5 rounded-md text-pearl/70 hover:text-pearl hover:bg-pearl/10 transition"
                      aria-label="Close Lakshmi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </header>

              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col gap-2",
                      m.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "bg-gold/20 text-pearl border border-gold/30 rounded-br-md"
                          : cn(
                              "bg-matte/50 text-pearl/90 border border-gold/20 rounded-bl-md",
                              lang === "te" && m.role === "assistant"
                                ? "font-telugu"
                                : ""
                            )
                      )}
                    >
                      {m.text}
                    </div>

                    {m.products && m.products.length > 0 && (
                      <div className="w-full max-w-[92%] space-y-2">
                        {m.products.map((p) => (
                          <Link
                            key={p.slug}
                            href={p.path}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-gold/30 bg-gradient-to-r from-maroon/40 to-matte/60 px-3 py-2.5 hover:border-gold/60 hover:bg-gold/5 transition group"
                          >
                            <div className="flex justify-between gap-2 items-start">
                              <div>
                                <p className="font-serif text-pearl text-[15px] group-hover:text-gold transition-colors">
                                  {p.name}
                                </p>
                                <p className="text-[11px] text-pearl/50 mt-0.5">
                                  {p.fabric} · {p.color}
                                </p>
                              </div>
                              <span className="text-gold text-xs font-medium shrink-0">
                                {formatINR(p.price)}
                              </span>
                            </div>
                            <span className="inline-block mt-1.5 text-[10px] tracking-[0.18em] uppercase text-gold/70">
                              View saree →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {m.quickReplies && m.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 max-w-[92%]">
                        {m.quickReplies.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleUserMessage(q)}
                            className="px-2.5 py-1 rounded-full text-[11px] border border-gold/35 text-gold-soft hover:bg-gold/15 transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {typing && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-matte/40 border border-gold/15 w-fit">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={onSubmit}
                className="shrink-0 border-t border-gold/25 p-3 bg-maroon-deep/40"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={cn(
                      "shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition",
                      listening
                        ? "border-gold bg-gold text-maroon-deep animate-gold-pulse"
                        : "border-gold/40 text-gold hover:bg-gold/10"
                    )}
                    aria-label={listening ? "Stop listening" : "Voice input"}
                  >
                    {listening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      lang === "te"
                        ? "ఏ సందర్భానికి చీర కావాలి?"
                        : "Ask about sarees, silk, budget…"
                    }
                    className={cn(
                      "flex-1 min-w-0 bg-matte/50 border border-gold/25 rounded-full px-4 py-2.5 text-sm text-pearl placeholder:text-pearl/35 outline-none focus:border-gold/55 transition",
                      lang === "te" ? "font-telugu" : ""
                    )}
                    aria-label="Message Lakshmi"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold to-bronze text-maroon-deep flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-center text-[9px] tracking-[0.25em] uppercase text-pearl/30">
                  {voicesReady ? "Voice ready · " : ""}
                  No external AI · On-device concierge
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className={cn(
            "relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center",
            "border border-gold/50 shadow-[0_12px_40px_rgba(74,14,31,0.55)]",
            "bg-gradient-to-br from-maroon via-maroon-soft to-maroon-deep",
            "animate-gold-pulse"
          )}
          aria-label={open ? "Close Lakshmi assistant" : "Open Lakshmi assistant"}
          aria-expanded={open}
        >
          <span className="absolute inset-0 rounded-full bg-gold/10 blur-md" />
          {open ? (
            <X className="relative w-6 h-6 text-gold" />
          ) : (
            <span className="relative flex flex-col items-center">
              <Sparkles className="w-4 h-4 text-gold-soft mb-0.5" />
              <span className="font-serif text-gold text-sm leading-none tracking-wide">
                ల
              </span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
