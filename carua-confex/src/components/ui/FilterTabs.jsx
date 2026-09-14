export function FilterTabs({ options, value, onChange, className = "" }) {
  return (
    <div className={`flex w-full items-center gap-2 overflow-x-auto ${className}`}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}