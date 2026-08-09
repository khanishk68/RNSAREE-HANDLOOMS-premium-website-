import { BRAND, type Product } from "@/lib/data";
import { formatINR } from "@/lib/utils";

/** Live catalogue — synced from admin via setLakshmiCatalog */
let catalog: Product[] = [];

export function setLakshmiCatalog(products: Product[]) {
  catalog = products;
}

function getCatalog() {
  return catalog;
}

export type LakshmiLang = "te" | "en";

export type ProductSuggestion = {
  name: string;
  slug: string;
  price: number;
  path: string;
  color: string;
  fabric: string;
};

export type LakshmiReply = {
  text: string;
  products?: ProductSuggestion[];
  quickReplies?: string[];
};

function toSuggestion(p: Product): ProductSuggestion {
  return {
    name: p.name,
    slug: p.slug,
    price: p.price,
    path: `/product/${p.slug}`,
    color: p.color,
    fabric: p.fabric,
  };
}

function formatProductLine(p: ProductSuggestion, lang: LakshmiLang): string {
  if (lang === "te") {
    return `• ${p.name} — ${formatINR(p.price)}\n  ${p.path}`;
  }
  return `• ${p.name} — ${formatINR(p.price)}\n  ${p.path}`;
}

function withProducts(
  intro: string,
  picks: Product[],
  outro: string,
  lang: LakshmiLang,
  quickReplies?: string[]
): LakshmiReply {
  if (!picks.length) {
    if (lang === "te") {
      return {
        text: `${intro}\n\nఇప్పుడు కలెక్షన్ అప్‌డేట్ అవుతోంది అక్కా. /contact ద్వారా ఎంక్వైరీ చేయండి — మీకు సరిపోయే చీరలు చూపిస్తాం.\n\n${outro}`,
        quickReplies: quickReplies || ["సంప్రదించండి", "హెరిటేజ్"],
      };
    }
    return {
      text: `${intro}\n\nOur collection is being curated right now. Please enquire via /contact — we’ll guide you personally.\n\n${outro}`,
      quickReplies: quickReplies || ["Contact", "Heritage"],
    };
  }
  const suggestions = picks.slice(0, 3).map(toSuggestion);
  const list = suggestions.map((p) => formatProductLine(p, lang)).join("\n");
  return {
    text: `${intro}\n\n${list}\n\n${outro}`,
    products: suggestions,
    quickReplies,
  };
}

function pickBy(
  predicate: (p: Product) => boolean,
  fallback: Product[] = getCatalog().filter((p) => p.featured).slice(0, 3)
): Product[] {
  const matched = getCatalog().filter(predicate);
  return matched.length ? matched.slice(0, 3) : fallback;
}

function normalize(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Detect intent from Telugu / English keywords */
function detectIntent(raw: string): string {
  const t = normalize(raw);

  if (
    /(wedding|bridal|bride|marriage|పెళ్లి|పెళ్ళి|వివాహ|బ్రైడల్|వధువు)/i.test(t)
  )
    return "wedding";
  if (/(budget|price|cost|under|below|బడ్జెట్|ధర|రూపాయ|afford|cheap|రేటు)/i.test(t))
    return "budget";
  if (/(kanjeevaram|kanchipuram|కాంచీ|కంచి|కంజీవరం)/i.test(t)) return "kanjeevaram";
  if (/(banarasi|వారణాసి|బనారసి|బనారసీ)/i.test(t)) return "banarasi";
  if (/(uppada|ఉప్పాడ|ఉప్పడ)/i.test(t)) return "uppada";
  if (/(pochampally|ikat|పోచంపల్లి|ఇకత్)/i.test(t)) return "ikat";
  if (/(soft\s*silk|సాఫ్ట్\s*సిల్క్)/i.test(t)) return "soft-silk";
  if (/(silk|పట్టు|పట్టుచీర|శాలు)/i.test(t)) return "silk";
  if (/(cotton|కాటన్|సన్నని|పత్తి)/i.test(t)) return "cotton";
  if (/(linen|లినెన్)/i.test(t)) return "linen";
  if (/(party|evening|cocktail|పార్టీ|ఈవెనింగ్)/i.test(t)) return "party";
  if (/(festival|festive|పండుగ|ఉత్సవ|దసరా|దీపావళి|సంక్రాంతి)/i.test(t))
    return "festival";
  if (/(color|colour|రంగు|maroon|gold|red|pink|blue|black|ivory|rose|indigo|మెరూన్|ఎరుపు|నలుపు|తెలుపు)/i.test(t))
    return "color";
  if (/(blouse|బ్లౌజ్|చొక్కా|blouse piece)/i.test(t)) return "blouse";
  if (/(track|order|shipping|delivery|ఆర్డర్|డెలివరీ|షిప్పింగ్|ట్రాక్)/i.test(t))
    return "track";
  if (/(contact|phone|whatsapp|address|store|location|సంప్రదించ|ఫోన్|చిరునామా|షోరూమ్)/i.test(t))
    return "contact";
  if (/(cod|cash on delivery|payment|pay|చెల్లింపు|క్యాష్)/i.test(t)) return "payment";
  if (/(care|wash|maintain|జాగ్రత్త|వాష్|శుభ్రం)/i.test(t)) return "care";
  if (/(quote|samskruthi|chenatha|సంస్కృతి|చేనేత|brand|about)/i.test(t))
    return "brand";
  if (/(hello|hi|namaste|namaskaram|hey|హలో|నమస్కార|నమస్తే)/i.test(t))
    return "greeting";
  if (/(help|suggest|recommend|choose|select|సూచన|సహాయం|ఏది|ఏ చీర)/i.test(t))
    return "suggest";
  if (/(shop|collection|catalog|కలెక్షన్|షాప్)/i.test(t)) return "shop";
  if (/(limited|rare|exclusive|లిమిటెడ్)/i.test(t)) return "limited";
  if (/(new|arrival|కొత్త)/i.test(t)) return "new";
  if (/(best|seller|popular|ప్రసిద్ధ)/i.test(t)) return "best";
  if (/(thank|thanks|ధన్యవాద|థాంక్స్)/i.test(t)) return "thanks";

  // Budget amount heuristics
  if (/\d{4,}/.test(t)) return "budget";

  return "fallback";
}

function parseBudget(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "");
  const lakh = cleaned.match(/(\d+(?:\.\d+)?)\s*(lakh|లక్ష)/i);
  if (lakh) return Math.round(parseFloat(lakh[1]) * 100000);
  const k = cleaned.match(/(\d+)\s*k\b/i);
  if (k) return parseInt(k[1], 10) * 1000;
  const num = cleaned.match(/(\d{4,7})/);
  if (num) return parseInt(num[1], 10);
  return null;
}

function colorFromQuery(raw: string): string | null {
  const t = normalize(raw);
  const map: [RegExp, string][] = [
    [/(maroon|మెరూన్|ఎరుపు.?గోల్డ్)/, "maroon"],
    [/(rose|pink|గులాబీ|పింక్)/, "rose"],
    [/(gold|బంగారు|గోల్డ్)/, "gold"],
    [/(ivory|cream|pearl|తెలుపు|ఐవరీ)/, "ivory"],
    [/(black|midnight|ebony|నలుపు)/, "black"],
    [/(indigo|blue|నీలం|ఇండిగో)/, "indigo"],
    [/(orange|sunrise|నారింజ)/, "orange"],
    [/(magenta|మజెంట)/, "magenta"],
    [/(champagne|షాంపేన్)/, "champagne"],
    [/(terracotta|టెర్రకోట)/, "terracotta"],
  ];
  for (const [re, key] of map) {
    if (re.test(t)) return key;
  }
  return null;
}

export function getGreeting(lang: LakshmiLang): LakshmiReply {
  if (lang === "te") {
    return {
      text: "నమస్కారం అక్కా... RN Saree Handlooms కి స్వాగతం. మీకు ఏ సందర్భానికి చీర కావాలి?",
      quickReplies: ["పెళ్లి చీర", "బడ్జెట్", "పట్టు", "పండుగ", "సంప్రదించండి"],
    };
  }
  return {
    text: "Namaskaram akka… Welcome to RN Saree Handlooms. For which occasion may I help you choose a saree?",
    quickReplies: ["Wedding", "Budget", "Silk", "Festival", "Contact"],
  };
}

export function getLakshmiResponse(
  message: string,
  lang: LakshmiLang
): LakshmiReply {
  const intent = detectIntent(message);
  const budget = parseBudget(message);

  switch (intent) {
    case "greeting":
      return getGreeting(lang);

    case "wedding": {
      const picks = pickBy(
        (p) =>
          p.occasion === "Wedding" ||
          p.category === "bridal" ||
          p.tags.includes("bridal")
      );
      if (lang === "te") {
        return withProducts(
          "పెళ్లి అంటే మన ఇంటి గర్వం, అక్కా. మీకు హీర్‌లూమ్ బ్రైడల్ సిల్క్స్ సిఫార్సు చేస్తాను — జరీ, కోర్వై, మీనాకారి… అన్నీ మా షోరూమ్ స్థాయి.",
          picks,
          "కావాలంటే మీ జ్యువెలరీ టోన్ చెప్పండి — మరిన్ని సరిపోయే చీరలు చూపిస్తాను.",
          lang,
          ["కంజీవరం", "బనారసి", "లిమిటెడ్", "బ్లౌజ్ ఐడియాస్"]
        );
      }
      return withProducts(
        "A wedding saree should feel inevitable — like destiny woven in silk. These bridal pieces are the pride of our showroom.",
        picks,
        "Tell me your jewellery tone or preferred colour, and I’ll refine the selection further.",
        lang,
        ["Kanjeevaram", "Banarasi", "Limited", "Blouse ideas"]
      );
    }

    case "budget": {
      const max = budget ?? 20000;
      const within = getCatalog()
        .filter((p) => p.price <= max)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
      const final = within.length
        ? within
        : [...getCatalog()].sort((a, b) => a.price - b.price).slice(0, 3);
      if (lang === "te") {
        return withProducts(
          `మీ బడ్జెట్ ${formatINR(max)} లోపు అయితే, ఇవి చాలా అందంగా సరిపోతాయి — నాణ్యత తగ్గకుండా.`,
          final,
          "కాస్త పైకి వెళ్తే బ్రైడల్ / కంజీవరం కూడా చూపించగలను. చెప్పండి అక్కా.",
          lang,
          ["పెళ్లి", "సాఫ్ట్ సిల్క్", "కాటన్"]
        );
      }
      return withProducts(
        `Within ${formatINR(max)}, these handloom pieces offer genuine craft without compromise.`,
        final,
        "If you’d like to stretch a little for bridal silk or Kanjeevaram, I’m happy to guide you.",
        lang,
        ["Wedding", "Soft silk", "Cotton"]
      );
    }

    case "kanjeevaram": {
      const picks = pickBy(
        (p) =>
          p.category === "kanjeevaram" ||
          /kanjeevaram/i.test(p.fabric) ||
          p.tags.includes("kanjeevaram")
      );
      if (lang === "te") {
        return withProducts(
          "కంజీవరం అంటే గోపురం సరిహద్దులు, నెమలి మోటిఫ్స్, నిజమైన జరీ — దక్షిణ భారత పవిత్ర పట్టు.",
          picks,
          "కాంట్రాస్ట్ బ్లౌజ్ పీస్ ఉన్నవి ప్రత్యేకం. మరిన్ని చూడాలా?",
          lang,
          ["పెళ్లి", "బ్లౌజ్", "బడ్జెట్"]
        );
      }
      return withProducts(
        "Kanjeevaram — temple borders, peacock motifs, and the weight of pure South Indian silk.",
        picks,
        "Many include a contrasting blouse piece. Shall I match one to your jewellery?",
        lang,
        ["Wedding", "Blouse", "Budget"]
      );
    }

    case "banarasi": {
      const picks = pickBy(
        (p) => p.category === "banarasi" || /banarasi/i.test(p.fabric)
      );
      if (lang === "te") {
        return withProducts(
          "బనారసి — వారణాసి లూమ్స్ నుంచి జాల్, బుట్టీలు, యాంటిక్ గోల్డ్ జరీ. మా హౌస్ సిగ్నేచర్ వీవ్స్.",
          picks,
          "హెవీ జరీ కావాలా లేక సాఫ్ట్ డ్రేప్ కావాలా?",
          lang,
          ["పెళ్లి", "సిల్క్", "రంగు"]
        );
      }
      return withProducts(
        "Banarasi — jaal, buttis, and antique gold zari from the looms of Varanasi. Perfect for weddings and heirlooms.",
        picks,
        "Prefer heavy zari drama, or a softer ceremonial drape?",
        lang,
        ["Wedding", "Silk", "Colour"]
      );
    }

    case "uppada": {
      const picks = pickBy(
        (p) => /uppada/i.test(p.fabric) || /uppada/i.test(p.name)
      );
      if (lang === "te") {
        return withProducts(
          "ఉప్పాడ పట్టు — తేలికైన జమ్దానీ, తీరాంధ్ర గర్వం. పండుగలకు అద్భుతం.",
          picks,
          "మరిన్ని ఆంధ్ర వీవ్స్ కావాలంటే చెప్పండి.",
          lang
        );
      }
      return withProducts(
        "Uppada silk — feather-light jamdani, the pride of coastal Andhra. Perfect for festivals.",
        picks,
        "I can also show you more Andhra weaves if you like.",
        lang
      );
    }

    case "ikat": {
      const picks = pickBy(
        (p) =>
          /ikat|pochampally/i.test(p.fabric) ||
          p.tags.includes("ikat") ||
          /ikat|pochampally/i.test(p.name)
      );
      if (lang === "te") {
        return withProducts(
          "పోచంపల్లి ఇకత్ — చేతితో టై-డై చేసి నేసిన జ్యామితీ కవిత్వం. రెండు చీరలు ఒకేలా ఉండవు.",
          picks,
          "హెరిటేజ్ ప్రేమికులకు ఇది నా మొదటి సూచన.",
          lang
        );
      }
      return withProducts(
        "Pochampally ikat — geometric poetry, hand tie-dyed before weaving. No two pieces are identical.",
        picks,
        "My first recommendation for lovers of living heritage.",
        lang
      );
    }

    case "soft-silk": {
      const picks = pickBy(
        (p) => p.category === "soft-silk" || /soft silk/i.test(p.fabric)
      );
      if (lang === "te") {
        return withProducts(
          "సాఫ్ట్ సిల్క్ — నీటిలా డ్రేప్, పండుగలకు, ఫంక్షన్లకు సౌకర్యం + గ్రేస్.",
          picks,
          "రోజువారీ లగ్జరీకి ఇవి పర్ఫెక్ట్.",
          lang,
          ["పండుగ", "బడ్జెట్", "రంగు"]
        );
      }
      return withProducts(
        "Soft silk — liquid drape, festive ease, everyday luxury without heaviness.",
        picks,
        "Ideal when you want grace and comfort in one piece.",
        lang,
        ["Festival", "Budget", "Colour"]
      );
    }

    case "silk": {
      const picks = pickBy(
        (p) =>
          /silk/i.test(p.fabric) ||
          ["silk", "soft-silk", "kanjeevaram", "banarasi", "bridal"].includes(
            p.category
          )
      );
      if (lang === "te") {
        return withProducts(
          "పట్టు చీరలు మా ఇంటి ప్రాణం. కంజీవరం నుంచి ఉప్పాడ వరకు — మీ సందర్భం చెప్పండి, సరిగ్గా సూచిస్తాను.",
          picks,
          "పెళ్లికా? పండుగకా? లేక పార్టీకా?",
          lang,
          ["పెళ్లి", "కంజీవరం", "సాఫ్ట్ సిల్క్"]
        );
      }
      return withProducts(
        "Silk is the soul of our house — from Kanjeevaram to Uppada. Tell me the occasion and I’ll curate precisely.",
        picks,
        "Wedding, festival, or an evening soiree?",
        lang,
        ["Wedding", "Kanjeevaram", "Soft silk"]
      );
    }

    case "cotton": {
      const picks = pickBy(
        (p) => p.category === "cotton" || /cotton/i.test(p.fabric)
      );
      if (lang === "te") {
        return withProducts(
          "హ్యాండ్‌లూమ్ కాటన్ — ఊపిరి తీసుకునే సౌకర్యం, సహజ రంగులు, రోజువారీ కవిత్వం.",
          picks,
          "వేసవికి, ప్రయాణానికి ఇవి అద్భుతం.",
          lang
        );
      }
      return withProducts(
        "Handloom cotton — breathable, naturally dyed, poetry for everyday mornings.",
        picks,
        "Beautiful for summer and travel.",
        lang
      );
    }

    case "linen": {
      const picks = pickBy(
        (p) => p.category === "linen" || /linen/i.test(p.fabric)
      );
      if (lang === "te") {
        return withProducts(
          "లినెన్ — క్రిస్ప్, రిఫైన్డ్, ఆధునిక సొగసు. వేసవి వేడికి చల్లని లగ్జరీ.",
          picks,
          "అండర్‌స్టేటెడ్ ఎలిగెన్స్ కోసం ఇవి.",
          lang
        );
      }
      return withProducts(
        "Linen — crisp, refined, modern grace. Cool luxury for warm days.",
        picks,
        "Perfect when you want understated elegance.",
        lang
      );
    }

    case "party": {
      const picks = pickBy(
        (p) =>
          p.occasion === "Party" ||
          p.category === "party-wear" ||
          p.category === "designer" ||
          p.tags.includes("party")
      );
      if (lang === "te") {
        return withProducts(
          "పార్టీ వేర్ — మెటాలిక్ వీవ్స్, టిష్యూ సిల్క్, కొటూర్ డ్రేప్. కాండిలైట్ సాయంత్రాలకు.",
          picks,
          "మీకు బ్లాక్ డ్రామా కావాలా లేక షాంపేన్ గ్లో కావాలా?",
          lang,
          ["నలుపు", "షాంపేన్", "డిజైనర్"]
        );
      }
      return withProducts(
        "Party wear — metallic weaves, tissue silk, couture drapes for candlelit evenings.",
        picks,
        "Midnight drama, or champagne glow?",
        lang,
        ["Black", "Champagne", "Designer"]
      );
    }

    case "festival": {
      const picks = pickBy(
        (p) =>
          p.occasion === "Festival" ||
          p.category === "festival" ||
          p.tags.includes("festival")
      );
      if (lang === "te") {
        return withProducts(
          "పండుగ చీర — రంగులు, నెమలి పల్లు, సాంప్రదాయ సరిహద్దులు. మన సంస్కృతి మన చేనేత.",
          picks,
          "ఏ పండుగకు సిద్ధమవుతున్నారు?",
          lang,
          ["సాఫ్ట్ సిల్క్", "ఉప్పాడ", "రంగు"]
        );
      }
      return withProducts(
        "Festival sarees — luminous colour, peacock pallus, traditional borders. Mana Samskruthi Mana Chenatha.",
        picks,
        "Which celebration are you dressing for?",
        lang,
        ["Soft silk", "Uppada", "Colour"]
      );
    }

    case "color": {
      const key = colorFromQuery(message);
      let picks = getCatalog().slice(0, 3);
      if (key) {
        const filtered = getCatalog().filter((p) =>
          normalize(p.color).includes(key === "black" ? "black" : key === "maroon" ? "maroon" : key)
        );
        // broader match
        const broader = getCatalog().filter((p) => {
          const c = normalize(p.color);
          if (key === "maroon") return /maroon|royal/.test(c);
          if (key === "rose") return /rose|pink/.test(c);
          if (key === "gold") return /gold|ivory gold|magenta gold/.test(c);
          if (key === "ivory") return /ivory|pearl|white|cream/.test(c);
          if (key === "black") return /black|midnight|ebony/.test(c);
          if (key === "indigo") return /indigo|blue/.test(c);
          if (key === "orange") return /orange|sunrise/.test(c);
          if (key === "magenta") return /magenta/.test(c);
          if (key === "champagne") return /champagne/.test(c);
          if (key === "terracotta") return /terracotta/.test(c);
          return false;
        });
        picks = (broader.length ? broader : filtered).slice(0, 3);
      }
      if (!picks.length) picks = getCatalog().filter((p) => p.featured).slice(0, 3);
      if (lang === "te") {
        return withProducts(
          key
            ? `ఆ రంగు మీపై అద్భుతంగా కనిపిస్తుంది అక్కా. ఈ చీరలు చూడండి.`
            : "రంగు ఎంపికలో మీ చర్మం టోన్, జ్యువెలరీ, సందర్భం ముఖ్యం. ఇవి మా ప్రియమైనవి.",
          picks,
          "మరో రంగు చెప్పండి — నలుపు, మెరూన్, ఐవరీ, గులాబీ…",
          lang,
          ["మెరూన్", "నలుపు", "ఐవరీ", "గులాబీ"]
        );
      }
      return withProducts(
        key
          ? `That colour will look exquisite on you. Here are pieces I’d present first in the showroom.`
          : "Colour is a conversation between your skin, jewellery, and the occasion. These are favourites from our floor.",
        picks,
        "Name another shade — maroon, black, ivory, rose — and I’ll curate again.",
        lang,
        ["Maroon", "Black", "Ivory", "Rose"]
      );
    }

    case "blouse": {
      if (lang === "te") {
        return {
          text: `బ్లౌజ్ ఐడియాస్ — షోరూమ్ సలహా:\n\n• కంజీవరం → కాంట్రాస్ట్ బోర్డర్ బ్లౌజ్, టెంపుల్ నెక్\n• బనారసి → సేమ్ జరీ టోన్, బ్యాక్ జాల్ వర్క్\n• సాఫ్ట్ సిల్క్ → సింపుల్ ఎల్బో స్లీవ్, డెలికేట్ బటన్స్\n• బ్రైడల్ → హెవీ జరీ యోక్ లేదా క్లాసిక్ రౌండ్ నెక్\n\nచాలా సిల్క్స్‌తో బ్లౌజ్ పీస్ వస్తుంది. ఏ చీరకు బ్లౌజ్ కావాలో చెప్పండి.`,
          quickReplies: ["కంజీవరం", "పెళ్లి", "పార్టీ"],
        };
      }
      return {
        text: `Blouse ideas from our atelier floor:\n\n• Kanjeevaram → contrast border blouse, temple neckline\n• Banarasi → matching zari tone, back jaal detail\n• Soft silk → clean elbow sleeve, delicate buttons\n• Bridal → heavy zari yoke or classic round neck\n\nMost of our silks include a blouse piece. Tell me which saree you’re considering.`,
        quickReplies: ["Kanjeevaram", "Wedding", "Party"],
      };
    }

    case "track": {
      if (lang === "te") {
        return {
          text: `ఆర్డర్ ట్రాక్ చేయడానికి మీ ఆర్డర్ నంబర్‌తో /account పేజీకి వెళ్లండి, లేదా మాకు వాట్సాప్ చేయండి: ${BRAND.phone}.\n\nషిప్పింగ్ సాధారణంగా 3–7 పని దినాలు. ప్రీమియం పీస్‌లకు ఇన్స్యూర్డ్ కొరియర్.`,
          quickReplies: ["సంప్రదించండి", "కాంటాక్ట్", "చెల్లింపు"],
        };
      }
      return {
        text: `To track an order, visit /account with your order number, or WhatsApp us at ${BRAND.phone}.\n\nShipping is typically 3–7 working days, with insured courier for premium pieces.`,
        quickReplies: ["Contact", "Payment", "Shop"],
      };
    }

    case "contact": {
      if (lang === "te") {
        return {
          text: `మమ్మల్ని సంప్రదించండి:\n\n📍 ${BRAND.address}\n📞 ${BRAND.phone}\n✉️ ${BRAND.email}\n🕐 ${BRAND.timings}\n\nవాట్సాప్ కోసం ఎడమ వైపు గ్రీన్ బటన్ నొక్కండి. షోరూమ్‌కు స్వాగతం అక్కా.`,
          quickReplies: ["పెళ్లి చీర", "షాప్", "బడ్జెట్"],
        };
      }
      return {
        text: `Reach us anytime:\n\n📍 ${BRAND.address}\n📞 ${BRAND.phone}\n✉️ ${BRAND.email}\n🕐 ${BRAND.timings}\n\nTap the green WhatsApp button on the left for instant help. Our showroom awaits you.`,
        quickReplies: ["Wedding", "Shop", "Budget"],
      };
    }

    case "payment": {
      if (lang === "te") {
        return {
          text: "చెల్లింపు సౌకర్యం — క్యాష్ ఆన్ డెలివరీ (COD) అందుబాటులో ఉంది. కార్డ్ / UPI కూడా సపోర్ట్. ప్రీమియం పీస్‌లకు అడ్వాన్స్ డిపాజిట్ అడగవచ్చు. వివరాలకు సంప్రదించండి.",
          quickReplies: ["సంప్రదించండి", "ట్రాక్ ఆర్డర్", "షాప్"],
        };
      }
      return {
        text: "We offer Cash on Delivery, plus card and UPI. For rare limited pieces, a small advance deposit may apply. Ask us anytime — we’ll make checkout graceful.",
        quickReplies: ["Contact", "Track order", "Shop"],
      };
    }

    case "care": {
      if (lang === "te") {
        return {
          text: "చీర జాగ్రత్తలు:\n\n• ప్యూర్ సిల్క్ / జరీ → డ్రై క్లీన్ మాత్రమే\n• మస్లిన్‌లో నిల్వ, సూర్యకాంతి దూరంగా\n• జరీపై పర్ఫ్యూమ్ వేయవద్దు\n• కాటన్ → చల్లని వాటర్‌తో హ్యాండ్ వాష్\n\nప్రతి ప్రొడక్ట్ పేజీలో కేర్ గైడ్ ఉంటుంది.",
          quickReplies: ["సిల్క్", "కాటన్", "పెళ్లి"],
        };
      }
      return {
        text: "Saree care, the showroom way:\n\n• Pure silk & zari → dry clean only\n• Store in muslin, away from sunlight\n• Keep perfume off the zari\n• Cotton → cold hand wash, shade dry\n\nEach product page includes a full care guide.",
        quickReplies: ["Silk", "Cotton", "Wedding"],
      };
    }

    case "brand": {
      if (lang === "te") {
        return {
          text: `${BRAND.quoteTelugu}\n“${BRAND.quote}”\n\nమేము ${BRAND.shortName} — నెల్లూరు నుంచి హ్యాండ్‌లూమ్ లగ్జరీ. ప్రతి చీర ఒక కథ, ప్రతి నేసేవాడు ఒక కళాకారుడు.`,
          quickReplies: ["కలెక్షన్", "పెళ్లి", "సంప్రదించండి"],
        };
      }
      return {
        text: `“${BRAND.quote}”\n${BRAND.quoteTelugu}\n\nWe are ${BRAND.shortName} — handloom luxury from Nellore. Every saree is a story; every weaver, an artist.`,
        quickReplies: ["Collections", "Wedding", "Contact"],
      };
    }

    case "shop": {
      const picks = getCatalog().filter((p) => p.featured).slice(0, 3);
      if (lang === "te") {
        return withProducts(
          "మా కలెక్షన్ చూడండి — /shop లో అన్ని కేటగిరీలు ఉన్నాయి. ఇవి ఈ వారం నా ఫేవరెట్స్:",
          picks,
          "సిల్క్, బనారసి, కంజీవరం, బ్రైడల్… ఏది ముందు?",
          lang,
          ["సిల్క్", "బ్రైడల్", "న్యూ అరైవల్స్"]
        );
      }
      return withProducts(
        "Browse the full house at /shop. These are my favourites on the floor this week:",
        picks,
        "Silk, Banarasi, Kanjeevaram, Bridal — where shall we begin?",
        lang,
        ["Silk", "Bridal", "New arrivals"]
      );
    }

    case "limited": {
      const picks = pickBy((p) => !!p.limited);
      if (lang === "te") {
        return withProducts(
          "లిమిటెడ్ ఎడిషన్ — అరుదైన వీవ్స్, నంబర్డ్ పీస్‌లు. ఒకసారి పోతే మళ్లీ రావు.",
          picks,
          "కలెక్టర్స్ కోసం ప్రత్యేకం. త్వరగా నిర్ణయం తీసుకోండి అక్కా.",
          lang
        );
      }
      return withProducts(
        "Limited edition — rare weaves, numbered pieces. Once gone, they do not return.",
        picks,
        "Reserved for collectors. I’d decide soon if one speaks to you.",
        lang
      );
    }

    case "new": {
      const picks = pickBy((p) => !!p.isNew);
      if (lang === "te") {
        return withProducts(
          "కొత్తగా లూమ్ నుంచి వచ్చినవి — న్యూ అరైవల్స్. ముందుగా చూసుకోండి.",
          picks,
          "/shop?category=new-arrivals లో మరిన్ని ఉన్నాయి.",
          lang
        );
      }
      return withProducts(
        "Fresh from the loom — our newest arrivals. See them before they leave the floor.",
        picks,
        "More await at /shop under New Arrivals.",
        lang
      );
    }

    case "best": {
      const picks = pickBy((p) => !!p.bestSeller);
      if (lang === "te") {
        return withProducts(
          "బెస్ట్ సెల్లర్స్ — మా పేట్రన్లు ప్రేమించిన క్లాసిక్స్. నమ్మకం ఉన్న ఎంపిక.",
          picks,
          "మొదటిసారి కొనుగోలు అయితే ఇవి సురక్షితమైన షురూ.",
          lang
        );
      }
      return withProducts(
        "Best sellers — classics our patrons return for. A trusted place to begin.",
        picks,
        "If this is your first visit, these are a graceful start.",
        lang
      );
    }

    case "suggest": {
      const picks = getCatalog().filter((p) => p.featured || p.bestSeller).slice(0, 3);
      if (lang === "te") {
        return withProducts(
          "నేను మీకు సూచిస్తాను అక్కా — ముందు సందర్భం చెప్పండి. ఇప్పటికి ఇవి నా టాప్ పిక్స్:",
          picks,
          "పెళ్లి / పండుగ / పార్టీ / బడ్జెట్ — ఏదైనా చెప్పండి.",
          lang,
          ["పెళ్లి", "పండుగ", "బడ్జెట్", "పార్టీ"]
        );
      }
      return withProducts(
        "I’d love to guide you. Here are pieces I’d place in your hands first:",
        picks,
        "Wedding, festival, party, or a budget — tell me, and I’ll refine.",
        lang,
        ["Wedding", "Festival", "Budget", "Party"]
      );
    }

    case "thanks": {
      if (lang === "te") {
        return {
          text: "అలాగే అక్కా… మళ్లీ అడగండి. మన సంస్కృతి మన చేనేత. మీకు శుభం!",
          quickReplies: ["మరిన్ని చీరలు", "సంప్రదించండి"],
        };
      }
      return {
        text: "You’re most welcome. Ask me anytime — Mana Samskruthi Mana Chenatha. Blessings for your choice.",
        quickReplies: ["More sarees", "Contact"],
      };
    }

    default: {
      // Try matching product name keywords
      const named = getCatalog().filter((p) =>
        normalize(message)
          .split(" ")
          .some(
            (w) =>
              w.length > 3 &&
              (normalize(p.name).includes(w) ||
                normalize(p.slug).includes(w) ||
                normalize(p.tags.join(" ")).includes(w))
          )
      );
      if (named.length) {
        if (lang === "te") {
          return withProducts(
            "ఈ చీర మీకు నచ్చవచ్చు అని అనుకుంటున్నాను:",
            named.slice(0, 3),
            "మరిన్ని వివరాలు కావాలంటే సందర్భం చెప్పండి.",
            lang
          );
        }
        return withProducts(
          "I believe these may speak to you:",
          named.slice(0, 3),
          "Share the occasion and I’ll refine further.",
          lang
        );
      }

      if (lang === "te") {
        return {
          text: "క్షమించండి అక్కా, కాస్త వివరంగా చెప్పండి — పెళ్లి, పండుగ, బడ్జెట్, రంగు, పట్టు రకం… నేను షోరూమ్‌లో మాదిరిగా సూచిస్తాను.\n\nమన సంస్కృతి మన చేనేత.",
          quickReplies: ["పెళ్లి", "బడ్జెట్", "పట్టు", "రంగు", "సంప్రదించండి"],
        };
      }
      return {
        text: "Forgive me — could you share a little more? Wedding, festival, budget, colour, or silk type… I’ll guide you as I would on our showroom floor.\n\nMana Samskruthi Mana Chenatha.",
        quickReplies: ["Wedding", "Budget", "Silk", "Colour", "Contact"],
      };
    }
  }
}

/** Strip product paths for cleaner speech output */
export function textForSpeech(text: string): string {
  return text
    .replace(/\/product\/[a-z0-9-]+/gi, "")
    .replace(/\/[a-z0-9/?=-]+/gi, (m) =>
      m.startsWith("/product") ? "" : m.includes("account") || m.includes("shop") ? m.replace("/", " ") : ""
    )
    .replace(/•/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
