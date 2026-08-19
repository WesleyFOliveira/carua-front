import {
  UserCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import FormField from "./FormField";

const PersonalDataStep = ({ data, onChange }) => {
  return (
    <div className="space-y-5">

      <div>
        <h2 className="font-display text-[26px] font-bold tracking-tight">
          Dados pessoais
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Como podemos encontrar você?
        </p>
      </div>

      <FormField
        label="Nome completo"
        icon={UserCircle2}
        value={data.nome}
        onChange={(value) => onChange("nome", value)}
        placeholder="Maria das Graças"
      />

      <FormField
        label="E-mail"
        icon={Mail}
        type="email"
        value={data.email}
        onChange={(value) => onChange("email", value)}
        placeholder="seu@email.com"
      />

      <div className="grid grid-cols-2 gap-3">

        <FormField
          label="WhatsApp"
          icon={Phone}
          value={data.telefone}
          onChange={(value) => onChange("telefone", value)}
          placeholder="(81) 99999-0000"
        />

        <FormField
          label="Cidade"
          icon={MapPin}
          value={data.cidade}
          onChange={(value) => onChange("cidade", value)}
          placeholder="Caruaru, PE"
        />

      </div>

    </div>
  );
};

export default PersonalDataStep;
