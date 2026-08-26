import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { ProfileTabs } from "./ProfileTabs";
import { GoogleButton } from "./GoogleButton";

export function LoginForm({ onSuccess, onError }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("confeccao");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email && senha) {
        onSuccess && onSuccess(perfil);
      } else {
        onError && onError();
      }
    }, 800);
  };

  return (
    <div className="space-y-8">
      <ProfileTabs value={perfil} onChange={setPerfil} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              focused === "email" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className="h-12 rounded-xl border-border/80 bg-surface/30 px-4 text-[15px] shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/20"
          />
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="senha"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                focused === "senha" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Senha
            </Label>
            <button type="button" className="text-xs font-medium text-primary/80 transition-colors hover:text-primary">
              Esqueceu?
            </button>
          </div>
          <div className="relative">
            <Input
              id="senha"
              type={showSenha ? "text" : "password"}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setFocused("senha")}
              onBlur={() => setFocused(null)}
              className="h-12 rounded-xl border-border/80 bg-surface/30 px-4 pr-11 text-[15px] shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {showSenha ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="group h-12 w-full rounded-xl bg-foreground text-background text-[15px] font-semibold shadow-none transition-all hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2.5">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Entrando...
            </span>
          ) : (
            <span className="flex items-center gap-2.5">
              Entrar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground/60">ou</span>
        </div>
      </div>

      {/* Social (visual only) */}
      <GoogleButton />
    </div>
  );
}