const OPTIONS = [
  { v: "confeccao", label: "Confecção" },
  { v: "faccao", label: "Facção" },
  { v: "pro", label: "Profissional" },
];

export function ProfileTabs({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all ${
              active
                ? "border-primary bg-primary/5 text-primary"
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