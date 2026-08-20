import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { useToast } from "../../hooks/use-toast.js";

const variantStyles = {
  default: {
    icon: Info,
    iconClass: "text-primary",
  },

  destructive: {
    icon: TriangleAlert,
    iconClass: "text-destructive",
  },

  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
  },
};

const Toaster = () => {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((item) => {
        const variant = variantStyles[item.variant] || variantStyles.default;

        const Icon = variant.icon;

        return (
          <div
            key={item.id}
            className={`
              relative
              flex
              items-start
              gap-3
              rounded-2xl
              border
              bg-background
              p-4
              pr-10
              shadow-lg
              animate-in
              fade-in
              slide-in-from-right-5
              duration-200
              ${
                item.variant === "destructive"
                  ? "border-destructive/20"
                  : "border-border"
              }
            `}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconClass}`} />

            <div className="min-w-0 flex-1">
              {item.title && (
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
              )}

              {item.description && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
