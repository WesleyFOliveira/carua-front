import {
  Building2,
  Check,
  UserCircle2,
} from "lucide-react";

const accountTypes = [
  {
    value: "confeccao",
    icon: Building2,
    label: "Sou uma confecção",
    description:
      "Coordeno a produção e distribuo lotes para facções e serviços.",
    tags: ["Pedidos", "Lotes", "Parceiros"],
  },
  {
    value: "faccao",
    icon: Building2,
    label: "Sou uma facção / serviço",
    description:
      "Executo etapas como costura, corte, bordado, lavagem ou estampa.",
    tags: ["Lotes", "Produção", "Histórico"],
  },
  {
    value: "profissional",
    icon: UserCircle2,
    label: "Sou profissional autônomo",
    description:
      "Quero divulgar meu trabalho e receber oportunidades.",
    tags: ["Portfólio", "Serviços", "Pedidos"],
  },
];

const AccountTypeStep = ({ tipo, onChange }) => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="font-display text-[26px] font-bold tracking-tight">
          Como você vai usar?
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Escolha o perfil que melhor descreve sua atividade.
        </p>
      </div>

      <div className="grid gap-3">

        {accountTypes.map((option) => {
          const Icon = option.icon;
          const active = tipo === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border bg-surface/30 hover:border-primary/40"
              }`}
            >

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-gradient-warm text-primary-foreground"
                    : "bg-background text-muted-foreground group-hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 space-y-1">

                <p className="font-display text-[15px] font-bold">
                  {option.label}
                </p>

                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {option.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

              <div
                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  active
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              >
                {active && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
};

export default AccountTypeStep;