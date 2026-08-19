import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, tipo }) => {
  const steps = [
    {
      number: 1,
      label: "Tipo de conta",
    },
    {
      number: 2,
      label: "Dados pessoais",
    },
    {
      number: 3,
      label:
        tipo === "profissional"
          ? "Sobre seu trabalho"
          : tipo === "confeccao"
            ? "Sobre a confecção"
            : "Sobre a facção",
    },
    {
      number: 4,
      label: "Segurança",
    },
  ];

  return (
    <div className="space-y-3 pt-4">

      {steps.map((step) => {
        const completed = currentStep > step.number;
        const active = currentStep === step.number;

        return (
          <div
            key={step.number}
            className="flex items-center gap-3"
          >

            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                completed
                  ? "bg-orange-300 text-[hsl(20,43%,8%)]"
                  : active
                    ? "bg-white text-[hsl(20,43%,8%)] ring-4 ring-white/30"
                    : "bg-white/10 text-white/50"
              }`}
            >
              {completed ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.number
              )}
            </div>

            <span
              className={`text-sm ${
                active
                  ? "font-semibold text-white"
                  : completed
                    ? "text-white/80"
                    : "text-white/40"
              }`}
            >
              {step.label}
            </span>

          </div>
        );
      })}

    </div>
  );
};

export default StepIndicator;