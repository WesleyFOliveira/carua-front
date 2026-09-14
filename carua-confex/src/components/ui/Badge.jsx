import * as React from "react";
import { cn } from "../../lib/utils.jsx";

const VARIANTS = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-surface text-surface-foreground",
  outline: "text-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
};

const Badge = React.forwardRef(function Badge({ className, variant = "default", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
      {...props}
    />
  );
});

export { Badge };