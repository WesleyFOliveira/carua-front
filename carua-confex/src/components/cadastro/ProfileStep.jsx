import {
  Briefcase,
  Building2,
  Sparkles,
  Users,
} from "lucide-react";

import FormField from "./FormField";

const ProfileStep = ({ tipo, data, onChange }) => {
  if (tipo === "profissional") {
    return (
      <div className="space-y-5">

        <div>
          <h2 className="font-display text-[26px] font-bold tracking-tight">
            Sobre seu trabalho
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Vamos montar sua vitrine profissional.
          </p>
        </div>

        <FormField
          label="Especialidade"
          icon={Sparkles}
          value={data.especialidade}
          onChange={(value) =>
            onChange("especialidade", value)
          }
          placeholder="Costureira, cortador, bordadeira..."
        />

        <FormField
          label="Anos de experiência"
          icon={Briefcase}
          type="number"
          value={data.experienciaAnos}
          onChange={(value) =>
            onChange("experienciaAnos", value)
          }
          placeholder="10"
        />

        <BioField
          value={data.bio}
          onChange={(value) => onChange("bio", value)}
          placeholder="Conte um pouco sobre você e seu trabalho."
        />

      </div>
    );
  }

  const isConfeccao = tipo === "confeccao";

  return (
    <div className="space-y-5">

      <div>
        <h2 className="font-display text-[26px] font-bold tracking-tight">
          Sobre sua {isConfeccao ? "confecção" : "facção"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Essas informações ajudam a organizar seu perfil.
        </p>
      </div>

      <FormField
        label={isConfeccao ? "Nome da confecção" : "Nome da facção"}
        icon={Building2}
        value={data.nome}
        onChange={(value) => onChange("nome", value)}
        placeholder={
          isConfeccao
            ? "Confecção Sertão"
            : "Facção Dona Maria"
        }
      />

      <FormField
        label="CNPJ"
        icon={Briefcase}
        value={data.cnpj}
        onChange={(value) => onChange("cnpj", value)}
        placeholder="00.000.000/0001-00"
        optional
      />

      <FormField
        label={
          isConfeccao
            ? "Tamanho da equipe"
            : "Capacidade mensal"
        }
        icon={Users}
        value={
          isConfeccao
            ? data.tamanhoEquipe
            : data.capacidadeMensal
        }
        onChange={(value) =>
          onChange(
            isConfeccao
              ? "tamanhoEquipe"
              : "capacidadeMensal",
            value
          )
        }
        placeholder={
          isConfeccao
            ? "5 a 10 pessoas"
            : "800 peças"
        }
      />

      <BioField
        value={data.bio}
        onChange={(value) => onChange("bio", value)}
        placeholder={
          isConfeccao
            ? "O que sua confecção faz de melhor?"
            : "Que serviços sua facção executa?"
        }
      />

    </div>
  );
};

const BioField = ({ value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">

      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Apresentação{" "}
        <span className="font-normal normal-case">
          (opcional)
        </span>
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

    </div>
  );
};

export default ProfileStep;
