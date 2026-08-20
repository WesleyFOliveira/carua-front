import { Eye, EyeOff } from "lucide-react";

const PasswordStep = ({ data, onChange, showPassword, setShowPassword }) => {
  const passwordStrong = data.senha.length >= 6;
  const passwordsMatch = data.senha === data.confirmarSenha && passwordStrong;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-[26px] font-bold tracking-tight">
          Crie sua senha
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Escolha uma senha segura para proteger sua conta.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Senha
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={data.senha}
            onChange={(event) => onChange("senha", event.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {data.senha && (
          <div className="flex items-center gap-2 pt-1">
            <div
              className={`h-1 flex-1 rounded-full ${
                passwordStrong ? "bg-green-500" : "bg-destructive/40"
              }`}
            />

            <div
              className={`h-1 flex-1 rounded-full ${
                data.senha.length >= 8 ? "bg-green-500" : "bg-border"
              }`}
            />

            <div
              className={`h-1 flex-1 rounded-full ${
                data.senha.length >= 10 ? "bg-green-500" : "bg-border"
              }`}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Confirmar senha
        </label>

        <input
          type="password"
          value={data.confirmarSenha}
          onChange={(event) => onChange("confirmarSenha", event.target.value)}
          placeholder="Repita a senha"
          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        {data.confirmarSenha && (
          <p
            className={`text-[11px] ${
              passwordsMatch ? "text-green-600" : "text-destructive"
            }`}
          >
            {passwordsMatch ? "✓ Senhas coincidem" : "As senhas não coincidem"}
          </p>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground/70">
        Ao criar sua conta, você concorda com os{" "}
        <span className="cursor-pointer underline">Termos</span> e{" "}
        <span className="cursor-pointer underline">Privacidade</span>.
      </p>
    </div>
  );
};

export default PasswordStep;
