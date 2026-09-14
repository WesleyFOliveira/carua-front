import * as React from "react";
import { cn } from "../../lib/utils.jsx";

const Separator = React.forwardRef(function Separator(
  { className, orientation = "horizontal", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
});

export { Separator };