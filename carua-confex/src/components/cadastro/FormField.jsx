const FormField = ({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  optional = false,
}) => {
  return (
    <div className="space-y-2">

      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}

        {optional && (
          <span className="ml-1 font-normal normal-case">
            (opcional)
          </span>
        )}
      </label>

      <div className="relative">

        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-12 w-full rounded-xl border border-border bg-background text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            Icon ? "pl-10" : "px-4"
          }`}
        />

      </div>

    </div>
  );
};

export default FormField;
