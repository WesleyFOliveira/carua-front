import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

import { useToast } from "../hooks/use-toast";

import AccountTypeStep from "../components/cadastro/AccontTypeStep";
import PersonalDataStep from "../components/cadastro/PersonalDataStep";
import ProfileStep from "../components/cadastro/ProfileStep";
import PasswordStep from "../components/cadastro/PasswordStep";
import StepIndicator from "../components/cadastro/StepIndicator";

import { validateCadastroStep } from "../utils/cadastroValidation";
import { buildCadastroPayload } from "../utils/cadastroPayload";
import { registerUser } from "../services/authService";

const TOTAL_STEPS = 4;

const initialFormData = {
  tipo: "confeccao",

  usuario: {
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    senha: "",
    confirmarSenha: "",
  },

  perfil: {
    nome: "",
    cnpj: "",
    tamanhoEquipe: "",
    capacidadeMensal: "",
    especialidade: "",
    experienciaAnos: "",
    bio: "",
  },
};

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateUsuario = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      usuario: {
        ...prev.usuario,
        [field]: value,
      },
    }));
  };

  const updatePerfil = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      perfil: {
        ...prev.perfil,
        [field]: value,
      },
    }));
  };

  const updateTipo = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      tipo,
      perfil: {
        nome: "",
        cnpj: "",
        tamanhoEquipe: "",
        capacidadeMensal: "",
        especialidade: "",
        experienciaAnos: "",
        bio: "",
      },
    }));
  };

  const showError = (message) => {
    toast({
      title: "Atenção",
      description: message,
      variant: "destructive",
    });
  };

  const validateCurrentStep = () => {
    const error = validateCadastroStep(step, formData);

    if (error) {
      showError(error);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) return;

    try {
      setLoading(true);

      const payload = buildCadastroPayload(formData);

      await registerUser(payload);

      toast({
        title: "Conta criada!",
        description: "Seu cadastro foi realizado com sucesso.",
        variant: "success",
      });

      if (formData.tipo === "confeccao") {
        navigate("/confeccao");
      } else if (formData.tipo === "faccao") {
        navigate("/faccao");
      } else {
        navigate("/pro");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Não foi possível criar sua conta. Tente novamente.";

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return <AccountTypeStep tipo={formData.tipo} onChange={updateTipo} />;
    }

    if (step === 2) {
      return (
        <PersonalDataStep data={formData.usuario} onChange={updateUsuario} />
      );
    }

    if (step === 3) {
      return (
        <ProfileStep
          tipo={formData.tipo}
          data={formData.perfil}
          onChange={updatePerfil}
        />
      );
    }

    return (
      <PasswordStep
        data={formData.usuario}
        onChange={updateUsuario}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* HERO */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        <img
          src="/assets/img-hero.webp"
          alt="Produção têxtil"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[hsl(20,43%,8%)]/85" />

        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,43%,6%)] via-transparent to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="font-display text-xl font-bold text-white">
              Caruá Confex
            </span>
          </Link>

          <div className="max-w-md space-y-6">
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white">
              {step === 1 && (
                <>
                  Comece sua jornada
                  <br />
                  <span className="text-orange-300">em poucos passos.</span>
                </>
              )}

              {step === 2 && (
                <>
                  Quem é você?
                  <br />
                  <span className="text-orange-300">Conte-nos.</span>
                </>
              )}

              {step === 3 && (
                <>
                  {formData.tipo === "profissional" ? (
                    <>
                      Seu trabalho,
                      <br />
                      <span className="text-orange-300">seu portfólio.</span>
                    </>
                  ) : (
                    <>
                      Sobre sua
                      <br />
                      <span className="text-orange-300">
                        {formData.tipo === "confeccao"
                          ? "confecção."
                          : "facção."}
                      </span>
                    </>
                  )}
                </>
              )}

              {step === 4 && (
                <>
                  Quase lá!
                  <br />
                  <span className="text-orange-300">Proteja sua conta.</span>
                </>
              )}
            </h1>

            <p className="text-base leading-relaxed text-white/85">
              {step === 1 &&
                "Configure seu acesso de acordo com a forma como você trabalha."}

              {step === 2 &&
                "Essas informações serão utilizadas para identificar sua conta."}

              {step === 3 &&
                "Esses dados ajudam a organizar sua operação e apresentar seu perfil."}

              {step === 4 &&
                "Crie uma senha segura para proteger seu acesso à plataforma."}
            </p>

            <StepIndicator currentStep={step} tipo={formData.tipo} />
          </div>

          <p className="text-xs text-white/60">
            Feito para o polo têxtil do Agreste
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="font-display text-base font-bold">
              Caruá Tecido
            </span>
          </Link>

          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-accent"
            >
              Entrar
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-start justify-center px-6 pb-12 sm:items-center">
          <div className="w-full max-w-[440px] space-y-6">
            {/* PROGRESSO MOBILE */}
            <div className="lg:hidden">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>
                  Passo {step} de {TOTAL_STEPS}
                </span>

                <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-gradient-warm transition-all duration-500"
                  style={{
                    width: `${(step / TOTAL_STEPS) * 100}%`,
                  }}
                />
              </div>
            </div>

            {renderStep()}

            {/* NAVEGAÇÃO */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-medium transition hover:bg-muted"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-foreground text-background transition hover:bg-foreground/90"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl bg-foreground text-background transition hover:bg-foreground/90 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        Criando...
                      </>
                    ) : (
                      <>
                        Criar minha conta
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Caruá Confex · Do Agreste para o mundo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
