import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.jsx";

// Dialog simples, sem dependência de @radix-ui (não está nas dependências do projeto).
// API inspirada no shadcn/ui para manter o uso familiar nas páginas.

const DialogContext = React.createContext({ open: false, onOpenChange: () => {} });

function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
  );
}

function DialogTrigger({ children }) {
  const { onOpenChange } = React.useContext(DialogContext);

  return React.cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);
      onOpenChange(true);
    },
  });
}

function DialogContent({ className, children, ...props }) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-10 w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-2 space-y-1.5 pr-6", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return <h2 className={cn("font-display text-lg font-semibold", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter };