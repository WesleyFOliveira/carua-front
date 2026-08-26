import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { Logo } from "../components/site/Logo";
import { HeroPanel } from "../components/login/HeroPanel";
import { LoginForm } from "../components/login/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSuccess = (perfil) => {
    toast({ title: "Bem-vindo(a) de volta!", description: "Login realizado com sucesso." });
    navigate(perfil === "confeccao" ? "/confeccao" : perfil === "faccao" ? "/faccao" : "/pro");
  };

  const handleLoginError = () => {
    toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Hero Panel */}
      <HeroPanel />

      {/* Right — Form */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Top bar mobile */}
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-bold text-foreground">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-primary hover:text-accent transition-colors">
              Criar conta
            </Link>
          </p>
        </div>

        {/* Form centered */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[380px] space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-[28px] font-bold tracking-tight text-foreground">Entrar</h2>
              <p className="text-[15px] text-muted-foreground">Escolha seu perfil e acesse.</p>
            </div>

            <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Caruá Confex · Do sertão para o mundo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;