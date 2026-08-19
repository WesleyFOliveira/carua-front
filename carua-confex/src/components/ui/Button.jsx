import * as React from "react";
import { cn } from "../../lib/utils.jsx";

const VARIANTS = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",

  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",

  outline:
    "border-2 border-primary/20 bg-background text-foreground hover:bg-surface hover:border-primary/40",

  secondary:
    "bg-surface text-surface-foreground hover:bg-surface/70",

  ghost:
    "hover:bg-surface hover:text-foreground",

  link:
    "text-primary underline-offset-4 hover:underline",

  hero:
    "bg-gradient-warm text-primary-foreground shadow-warm hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 font-semibold",

  accent:
    "bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft",

  soft:
    "bg-surface text-primary hover:bg-surface/70 border border-primary/10",
};

const SIZES = {
  default: "h-10 px-5 py-2",
  sm: "h-9 px-3",
  lg: "h-12 px-7 text-base",
  xl: "h-14 px-9 text-base",
  icon: "h-10 w-10",
};

const BASE_STYLES = [
  "inline-flex items-center justify-center gap-2",
  "whitespace-nowrap rounded-md",
  "text-sm font-medium",
  "transition-colors",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "[&_svg]:pointer-events-none",
  "[&_svg]:size-4",
  "[&_svg]:shrink-0",
].join(" ");

const Button = React.forwardRef(function Button(
  {
    className,
    variant = "default",
    size = "default",
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        BASE_STYLES,
        VARIANTS[variant] || VARIANTS.default,
        SIZES[size] || SIZES.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export { Button };