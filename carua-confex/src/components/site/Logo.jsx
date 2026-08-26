export function Logo({ className = "h-8 w-8", inverted = false }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className={inverted ? "fill-white/15" : "fill-primary/10"}
      />
      <path
        d="M9 21c1.5-6 4-11 7-11s5.5 5 7 11"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={inverted ? "stroke-white" : "stroke-primary"}
      />
      <circle
        cx="16"
        cy="10"
        r="2"
        className={inverted ? "fill-orange-300" : "fill-accent"}
      />
    </svg>
  );
}