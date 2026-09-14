import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.jsx";

// Select simples, controlado por value/onValueChange, sem dependência de @radix-ui.

const SelectContext = React.createContext(null);

function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState({});
  const containerRef = React.useRef(null);

  const registerLabel = React.useCallback((itemValue, label) => {
    setLabels((prev) => (prev[itemValue] === label ? prev : { ...prev, [itemValue]: label }));
  }, []);

  React.useEffect(() => {
    function onClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

function SelectValue({ placeholder, className }) {
  const { value, labels } = React.useContext(SelectContext);
  const label = value != null ? labels[value] : undefined;

  return <span className={cn(!label && "text-muted-foreground", className)}>{label ?? placeholder ?? ""}</span>;
}

function SelectContent({ className, children }) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg",
        className
      )}
    >
      <div className="max-h-60 overflow-y-auto p-1">{children}</div>
    </div>
  );
}

function SelectItem({ value: itemValue, children, className }) {
  const { value, onValueChange, setOpen, registerLabel } = React.useContext(SelectContext);
  const isSelected = value === itemValue;

  React.useEffect(() => {
    registerLabel(itemValue, children);
  }, [itemValue, children, registerLabel]);

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(itemValue);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
        isSelected && "bg-muted font-medium",
        className
      )}
    >
      {children}
      {isSelected && <Check className="h-4 w-4 text-primary" />}
    </button>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };