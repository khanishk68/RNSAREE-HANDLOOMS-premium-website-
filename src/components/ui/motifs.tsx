export function PaisleyMotif({
  className = "",
  opacity = 0.12,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      style={{ opacity }}
    >
      <path
        d="M60 8C60 8 18 48 18 96c0 32 18 56 42 56s42-24 42-56C102 48 60 8 60 8z"
        stroke="#c9a962"
        strokeWidth="1.2"
      />
      <path
        d="M60 28c0 0-22 28-22 58 0 22 10 38 22 38s22-16 22-38c0-30-22-58-22-58z"
        stroke="#c9a962"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <circle cx="60" cy="96" r="8" stroke="#c9a962" strokeWidth="0.8" />
      <path
        d="M60 88c-4 6-4 12 0 18M52 96h16"
        stroke="#c9a962"
        strokeWidth="0.6"
        opacity="0.6"
      />
    </svg>
  );
}

export function LotusMotif({
  className = "",
  opacity = 0.15,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      style={{ opacity }}
    >
      <path
        d="M100 110C100 110 40 70 30 40c20 8 50 30 70 70z"
        stroke="#c9a962"
        strokeWidth="1"
      />
      <path
        d="M100 110C100 110 160 70 170 40c-20 8-50 30-70 70z"
        stroke="#c9a962"
        strokeWidth="1"
      />
      <path
        d="M100 110C100 110 70 50 100 20c30 30 0 90 0 90z"
        stroke="#c9a962"
        strokeWidth="1.2"
      />
      <path
        d="M100 110C100 110 50 55 20 55c25 5 55 25 80 55z"
        stroke="#c9a962"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <path
        d="M100 110C100 110 150 55 180 55c-25 5-55 25-80 55z"
        stroke="#c9a962"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <circle cx="100" cy="72" r="4" fill="#c9a962" opacity="0.4" />
    </svg>
  );
}

export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent ${className}`}
    />
  );
}
