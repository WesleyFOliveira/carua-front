import * as React from "react";
import { cn } from "../../lib/utils.jsx";

const Slider = React.forwardRef(function Slider(
  { className, value = [0], onValueChange, min = 0, max = 100, step = 1, disabled, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      disabled={disabled}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-surface accent-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Slider };