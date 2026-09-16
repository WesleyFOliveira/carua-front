import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Progress } from "../../components/ui/Progress";
import { Inbox, Star, Briefcase, Eye, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { getMeuPerfil, getMinhasConexoes, getMeuPortfolio } from "../../services/profissionaisservice";

// TODO: ainda não existe um serviço de analytics/visitas de perfil no backend.
// Quando existir (ex: GET /profissionais/me/visualizacoes), troque este valor fixo.
const VISUALIZACOES_MOCK = 124;

const ProHome = () => {
  const [me, setMe] = useState(null);
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [meuPortfolio, setMeuPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getMeuPerfil(), getMinhasConexoes(), getMeuPortfolio()])
      .then(([perfil, conexoes, portfolio]) => {
        if (ativo) {
          setMe(perfil);
          setMeusPedidos(conexoes);
          setMeuPortfolio(portfolio);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar sua área. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Bem-vinda"
          description="Sua área pessoal no Caruá Confex. Aqui você acompanha pedidos, edita seu portfólio e gerencia sua agenda."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando sua área...</p>
      </div>
    );
  }

  if (erro || !me) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Bem-vinda"
          description="Sua área pessoal no Caruá Confex. Aqui você acompanha pedidos, edita seu portfólio e gerencia sua agenda."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro ?? "Perfil não encontrado."}</p>
      </div>
    );
  }

  const novos = meusPedidos.filter((p) => p.status === "pendente");
  const ativos = meusPedidos.filter((p) => p.status === "aceito" || p.status === "negociando");

  // Completude do perfil (heurística simples)
  const checks = [
    !!me.bio,
    !!me.foto,
    me.servicos?.length >= 2,
    !!me.maquinario && me.maquinario.length > 0,
    !!me.certificacoes && me.certificacoes.length > 0,
    !!me.contato?.email,
    meuPortfolio.length >= 3,
    me.formaPagamento?.length > 0,
  ];
  const completude = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const proximas = ativos.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Bem-vinda, ${me.nome.split(" ")[0]}`}
        description="Sua área pessoal no Caruá Confex. Aqui você acompanha pedidos, edita seu portfólio e gerencia sua agenda."
        action={
          <Button variant="hero">
            <Link to="/pro/pedidos" className="flex items-center gap-1.5">
              Ver pedidos novos <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Inbox, label: "Novos pedidos", value: novos.length, color: "text-accent", bg: "bg-accent/10" },
          { icon: Briefcase, label: "Em andamento", value: ativos.length, color: "text-primary", bg: "bg-primary/10" },
          { icon: Star, label: "Avaliação", value: me.avaliacao.toFixed(1), color: "text-warning", bg: "bg-warning/10" },
          { icon: Eye, label: "Visitas no perfil (30d)", value: VISUALIZACOES_MOCK, color: "text-success", bg: "bg-success/10" },
        ].map((k) => (
          <Card key={k.label} className="shadow-soft">
            <CardContent className="flex items-center gap-3 p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${k.bg}`}>
                <k.icon className={`h-5 w-5 ${k.color}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <p className="font-display text-2xl font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Próximas entregas */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Próximas entregas</h2>
              <Button variant="ghost" size="sm">
                <Link to="/pro/pedidos">Ver todos</Link>
              </Button>
            </div>
            {proximas.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">Sem trabalhos em andamento. Aceite um pedido para começar.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {proximas.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.faccaoNome}</p>
                      <p className="truncate text-sm text-muted-foreground">{p.servico}</p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center gap-1 text-sm font-medium">
                        <Clock className="h-3.5 w-3.5" /> {p.prazo}
                      </p>
                      <p className="text-xs text-primary">R$ {p.valorProposto.toLocaleString("pt-BR")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Completar perfil */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Complete seu perfil</h2>
            <p className="mt-1 text-sm text-muted-foreground">Perfis completos recebem 3x mais pedidos.</p>
            <div className="mt-4 flex items-center gap-3">
              <Progress value={completude} className="h-2" />
              <span className="text-sm font-bold text-primary">{completude}%</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { ok: !!me.bio, label: "Bio profissional" },
                { ok: meuPortfolio.length >= 3, label: "Pelo menos 3 trabalhos" },
                { ok: !!me.certificacoes && me.certificacoes.length > 0, label: "Certificações" },
                { ok: !!me.contato?.email, label: "E-mail de contato" },
                { ok: !!me.maquinario && me.maquinario.length > 0, label: "Maquinário" },
              ].map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${c.ok ? "text-success" : "text-muted-foreground/40"}`} />
                  <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-5 w-full">
              <Link to="/pro/perfil" className="flex w-full items-center justify-center">
                Editar perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos novos preview */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Pedidos aguardando você</h2>
              <p className="text-sm text-muted-foreground">Facções querem trabalhar com você. Responda rápido para fechar mais.</p>
            </div>
            <Badge className="bg-accent/15 text-accent hover:bg-accent/15">{novos.length} novos</Badge>
          </div>
          {novos.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">Nenhuma solicitação pendente no momento.</p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {novos.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to="/pro/pedidos"
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{p.faccaoNome}</p>
                    <span className="text-xs text-muted-foreground">{p.faccaoCidade}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.servico}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {p.quantidade} peças · até {p.prazo}
                    </span>
                    <span className="font-bold text-primary">R$ {p.valorProposto.toLocaleString("pt-BR")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProHome;