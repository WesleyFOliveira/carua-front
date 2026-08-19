import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";

import chitaImg from "../assets/textura-chita.jpg";
import heroImg from "../assets/img-hero.webp"
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Layers, Scissors, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const Index = () => {
  const infos = [
    { 
      icone: AlertTriangle, 
      titulo: "Desorganização", 
      descricao: "Pedidos esquecidos, prazos perdidos e tarefas duplicadas viram rotina." 
    },
    { 
      icone: Layers, 
      titulo: "Perda de materiais", 
      descricao: "Sobrou tecido? Faltou linha? Sem controle, o desperdício come o lucro." 
    },
    { 
      icone: Wallet, 
      titulo: "Pagamento confuso", 
      descricao : "Calcular peça por peça no fim do mês gera dor de cabeça e desconfiança." 
    },
  ]

  const textos = [
    "Pedidos com etapas claras: corte, costura, acabamento e entrega",
    "Atribua tarefas a profissionais com um clique",
    "Materiais conectados ao pedido - saiba exatamente o que entrou e saiu",
    "Pagamento por peça calculado automaticamente",
  ]

  const infosLotes = [
    { 
      id: "LT-2401", 
      porcent: 60, 
      label: "Costura"
     },
    { 
      id: "LT-2402", 
      porcent: 80, 
      label: "Acabamento" 
    },
    { 
      id: "LT-2403", 
      porcent: 25, 
      label: "Corte" 
    },
  ]

  const infosBeneficios = [
    { 
      icon: TrendingUp, 
      titulo: "Menos perdas", 
      descricao: "Rastreie cada metro de tecido e cada linha." 
    },
    { 
      icon: ClipboardList, 
      titulo: "Mais controle", 
      descricao: "Cada lote, cada etapa, cada profissional sob seu olhar." 
    },
    { 
      icon: Users, 
      titulo: "Equipe alinhada", 
      descricao: "Todo mundo sabe o que fazer e até quando." 
    },
    { 
      icon: Wallet, 
      titulo: "Pagamento justo", 
      descricao: "Cálculo por peça automático, sem erro." 
    },
  ]

  const infosComoFunciona = [
    { 
      id: "01", 
      titulo: "Cadastre o pedido", 
      descricao: "Cliente, peça, quantidade e prazo." 
    },
    { 
      id: "02", 
      titulo: "Distribua as tarefas", 
      descricao: "Atribua a profissionais por etapa." 
    },
    { 
      id: "03", 
      titulo: "Acompanhe a produção", 
      descricao: "Veja o status em tempo real." 
    },
    { 
      id: "04", 
      titulo: "Calcule e pague", 
      descricao: "Pagamentos por peça, sem planilha." 
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader/>

      <section className="relative overflow-hidden bg-gradient-sunset">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url(${chitaImg})`, backgroundSize: "320px" }}
          aria-hidden
        />

        <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="space-y-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Para confecções, facções e profissionais autônomos
            </span>
            <h1 className="heading-display text-balance text-4xl text-foreground md:text-6xl">
              Sua produção têxtil <span className="text-primary">organizada</span>,
              do corte à entrega.
            </h1>
            <p className="max-w-xl text-balance text-lg text-muted-foreground">
              Saia do caderno e do improviso. Acompanhe pedidos, distribua tarefas, controle materiais
              e pagamentos - tudo num lugar simples, feito para o chão da fábrica.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="xl">
                <Link to="/cadastro" className="flex">Criar conta</Link>
              </Button>
              <Button variant="outline" size="xl">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Funciona no celular</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Feito no agreste</div>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-warm opacity-20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border-2 border-primary/10 bg-card shadow-warm">
              <img
                src={heroImg}
                alt="Confecção têxtil nordestina com costureiras e tecidos da cultura local"
                width={1536}
                height={1024}
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-warm md:flex md:items-center md:gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><Scissors className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Lote LT-2401</p>
                <p className="text-sm font-semibold">Costura · 60% concluído</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="textile-divider" aria-hidden />

      {/* PROBLEMA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">O problema</span>
            <h2 className="mt-3 heading-display text-3xl md:text-5xl">Cadernos rabiscados não dão conta da produção.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {infos.map((info) => (
              <div key={info.titulo} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 inline-flex rounded-xl bg-destructive/10 p-3 text-destructive">
                  <info.icone className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{info.titulo}</h3>
                <p className="text-sm text-muted-foreground">{info.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section id="solucao" className="bg-surface py-20 md:py-28">
        <div className="container grid items-center gap-14 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">A solução</span>
            <h2 className="mt-3 heading-display text-3xl md:text-5xl">Um sistema simples para quem não tem tempo a perder.</h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Caruá Confex digitaliza o que você já faz - só que sem perder nada no caminho.
              Pensado para usuários que nunca usaram software de gestão.
            </p>
            <ul className="mt-6 space-y-3">
              {textos.map((texto) => (
                <li key={texto} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{texto}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="lg" className="mt-8">
              <Link to="/cadastro">Conhecer o sistema</Link>
            </Button>
          </div>

          {/* Mockup do dashboard */}
          <div className="relative">
            <div className="rounded-2xl border-2 border-primary/10 bg-card p-4 shadow-warm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground">caruaconfex.com.br/app</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-warm p-4 text-primary-foreground">
                  <p className="text-xs opacity-80">Produção do mês</p>
                  <p className="font-display text-2xl font-bold">330 peças · R$ 4.890</p>
                </div>
                {infosLotes.map((lote) => (
                  <div key={lote.id} className="rounded-lg border border-border bg-background p-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-primary">{lote.id}</span>
                      <span className="text-muted-foreground">{lote.label}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${lote.porcent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-3 -top-3 hidden rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-glow md:block">
              Tempo real
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="py-20 md:py-28">
        <div className="container">
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Benefícios</span>
            <h2 className="mt-3 heading-display text-3xl md:text-5xl">O que muda na sua confecção.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {infosBeneficios.map((beneficio) => (
              <div key={beneficio.titulo} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-warm">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-warm p-3 text-primary-foreground shadow-soft">
                  <beneficio.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{beneficio.titulo}</h3>
                <p className="text-sm text-muted-foreground">{beneficio.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="relative overflow-hidden bg-foreground py-20 text-background md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `url(${chitaImg})`, backgroundSize: "260px" }}
          aria-hidden
        />
        <div className="container relative">
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Como funciona</span>
            <h2 className="mt-3 heading-display text-3xl md:text-5xl">Em 4 passos você está produzindo.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {infosComoFunciona.map((infos) => (
              <div key={infos.id} className="relative rounded-2xl border border-background/10 bg-background/5 p-6 backdrop-blur">
                <div className="font-display text-5xl font-extrabold text-accent">{infos.id}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{infos.titulo}</h3>
                <p className="mt-2 text-sm text-background/70">{infos.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE TEASER */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container max-w-4xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Marketplace</span>
          <h2 className="mt-3 heading-display text-3xl md:text-5xl">
            Profissionais do agreste, com portfólio digital.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Costureiras, cortadores, bordadeiras. Conheça quem faz a moda do nordeste acontecer e
            amplie sua operação com gente de confiança.
          </p>
          <Button variant="hero" size="xl" className="mt-8">
            <Link to="/marketplace">Encontrar profissionais</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-10 text-center shadow-warm md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{ backgroundImage: `url(${chitaImg})`, backgroundSize: "200px" }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="heading-display text-3xl text-primary-foreground md:text-5xl">
                Comece a organizar sua produção hoje.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
                Grátis para começar. Sem complicação. Pronto pro chão da fábrica.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button size="xl" variant="secondary" className="bg-background text-primary hover:bg-background/90">
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
                <Button size="xl" variant="outline" className="border-background/40 bg-transparent text-primary-foreground hover:bg-background/10">
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter/>
    </div>
  );
};

export default Index;
