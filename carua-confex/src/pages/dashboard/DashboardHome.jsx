import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Progress } from "../../components/ui/Progress";
import {
  ArrowRight, ClipboardList, Wallet, AlertTriangle, TrendingUp,
  Target, CheckCircle2, Bell, Calendar, Truck, Handshake,
} from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getPedidos } from "../../services/pedidosservice";
import { getMateriais } from "../../services/materiaisservice";
import { getParceiros } from "../../services/parceirosservice";
import { getLotes } from "../../services/lotesservice";

const TIPO_PARCEIRO_LABEL = {
  faccao: "Facção",
  estamparia: "Estamparia",
  lavanderia: "Lavanderia",
  bordado: "Bordado",
  corte: "Corte",
};

const DashboardHome = () => {
  const [pedidos, setPedidos] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPedidos(), getMateriais(), getParceiros(), getLotes()])
      .then(([p, m, pa, l]) => {
        if (ativo) {
          setPedidos(p);
          setMateriais(m);
          setParceiros(pa);
          setLotes(l);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar a visão geral. Tente novamente.");
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
        <PageHeader title="Visão geral" description="O essencial da sua confecção em um só lugar." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando visão geral...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader title="Visão geral" description="O essencial da sua confecção em um só lugar." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  const hoje = new Date();
  const ativos = pedidos.filter((p) => p.etapaAtual !== "entrega");
  const entregues = pedidos.filter((p) => p.etapaAtual === "entrega").length;
  const pecasMes = pedidos.reduce((s, p) => s + p.quantidade, 0);
  const receita = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const materiaisBaixos = materiais.filter((m) => m.estoque < m.minimo);
  const atrasados = ativos.filter((p) => new Date(p.prazo) < hoje);
  const urgentes = ativos.filter((p) => {
    const d = (new Date(p.prazo).getTime() - hoje.getTime()) / 86400000;
    return d >= 0 && d <= 3;
  });
  const totalAlertas = atrasados.length + urgentes.length + materiaisBaixos.length;

  const pecasEntregues = pedidos
    .filter((p) => p.etapaAtual === "entrega")
    .reduce((s, p) => s + p.quantidade, 0);
  const receitaRecebida = pedidos
    .filter((p) => p.etapaAtual === "entrega")
    .reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const taxaPrazo =
    entregues > 0
      ? Math.round(
          (pedidos.filter((p) => p.etapaAtual === "entrega" && new Date(p.prazo) >= new Date(p.criadoEm))
            .length /
            entregues) *
            100
        )
      : 0;

  const metas = [
    { label: "Peças produzidas", atual: pecasEntregues, meta: 400, sufixo: " peças" },
    { label: "Receita do mês", atual: receitaRecebida, meta: 6000, prefixo: "R$ " },
    { label: "Pedidos entregues", atual: entregues, meta: 8 },
    { label: "Entregas no prazo", atual: taxaPrazo, meta: 100, sufixo: "%" },
  ];

  const proximasEntregas = [...ativos]
    .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime())
    .slice(0, 5);

  const cargaParceiros = parceiros
    .filter((p) => p.ativo)
    .map((p) => {
      const lotesAtivos = lotes.filter((l) => l.parceiro?.id === p.id && l.status !== "entregue");
      const pecas = lotesAtivos.reduce((s, l) => s + l.quantidade, 0);
      return { ...p, lotesAtivos: lotesAtivos.length, pecas };
    })
    .sort((a, b) => b.lotesAtivos - a.lotesAtivos)
    .slice(0, 6);

  const stats = [
    { label: "Pedidos ativos", value: ativos.length, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
    { label: "Peças no mês", value: pecasMes, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Receita prevista", value: `R$ ${receita.toLocaleString("pt-BR")}`, icon: Wallet, color: "text-green-700", bg: "bg-green-100" },
    { label: "Parceiros ativos", value: parceiros.filter((p) => p.ativo).length, icon: Handshake, color: "text-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Visão geral" description="O essencial da sua confecção em um só lugar." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalAlertas > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-soft">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-destructive/10 p-2.5">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-display font-semibold text-destructive">
                  Você tem {totalAlertas} {totalAlertas === 1 ? "alerta" : "alertas"} pendentes
                </p>
                <p className="text-xs text-muted-foreground">
                  {atrasados.length} atrasado(s) · {urgentes.length} urgente(s) · {materiaisBaixos.length} material(is) em falta
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              <Link to="/confeccao/alertas" className="flex items-center gap-1.5">
                Ver alertas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" /> Metas do mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {metas.map((m) => {
              const pct = Math.min(100, Math.round((m.atual / m.meta) * 100));
              const ok = pct >= 100;
              const fmt = (n) => `${m.prefixo ?? ""}${n.toLocaleString("pt-BR")}${m.sufixo ?? ""}`;
              return (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{m.label}</span>
                    <span className={`font-semibold ${ok ? "text-green-700" : "text-muted-foreground"}`}>
                      {fmt(m.atual)} / {fmt(m.meta)}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2.5" />
                  <p className="text-xs text-muted-foreground">
                    {pct}% da meta {ok && <CheckCircle2 className="ml-1 inline h-3 w-3 text-green-600" />}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Truck className="h-5 w-5 text-accent" /> Próximas entregas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proximasEntregas.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Sem pedidos em aberto.</p>
            ) : (
              proximasEntregas.map((p) => {
                const dias = Math.ceil((new Date(p.prazo).getTime() - hoje.getTime()) / 86400000);
                const atrasado = dias < 0;
                const urgente = dias >= 0 && dias <= 3;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      atrasado
                        ? "border-destructive/30 bg-destructive/5"
                        : urgente
                        ? "border-warning/30 bg-warning/5"
                        : "border-border"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{p.id}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {p.etapaAtual}
                        </Badge>
                      </div>
                      <p className="truncate text-sm font-medium">{p.cliente}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {new Date(p.prazo).toLocaleDateString("pt-BR")}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          atrasado ? "text-destructive" : urgente ? "text-warning" : "text-muted-foreground"
                        }`}
                      >
                        {atrasado ? `${Math.abs(dias)}d atrasado` : `${dias}d`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Handshake className="h-5 w-5 text-primary" /> Carga dos parceiros produtivos
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Link to="/confeccao/parceiros" className="flex items-center gap-1.5">
                Gerenciar <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {cargaParceiros.length === 0 && <p className="text-sm text-muted-foreground">Nenhum parceiro ativo.</p>}
            {cargaParceiros.map((p) => {
              const ocup = Math.min(100, Math.round((p.pecas / Math.max(p.capacidadeMes, 1)) * 100));
              return (
                <div key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-bold text-primary-foreground">
                      {p.nome[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {TIPO_PARCEIRO_LABEL[p.tipo]} · {p.cidade}
                      </p>
                    </div>
                    <Badge
                      variant={p.lotesAtivos >= 2 ? "destructive" : p.lotesAtivos === 1 ? "secondary" : "outline"}
                      className="shrink-0"
                    >
                      {p.lotesAtivos} {p.lotesAtivos === 1 ? "lote" : "lotes"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={ocup} className="h-1.5 flex-1" />
                    <span className="w-14 text-right text-[11px] text-muted-foreground">
                      {p.pecas}/{p.capacidadeMes}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Estoque em alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materiaisBaixos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tudo em dia. ✨</p>
            ) : (
              <ul className="space-y-2">
                {materiaisBaixos.map((m) => (
                  <li key={m.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                    <p className="text-sm font-semibold">{m.nome}</p>
                    <p className="text-xs text-destructive">
                      {m.estoque} {m.unidade} (mín. {m.minimo})
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="soft" className="mt-4 w-full">
              <Link to="/confeccao/materiais">Gerenciar materiais</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction to="/confeccao/pedidos" icon={ClipboardList} label="Nova ordem de produção" />
        <QuickAction to="/confeccao/lotes" icon={Truck} label="Distribuir lotes" />
        <QuickAction to="/confeccao/parceiros" icon={Handshake} label="Cadastrar parceiro" />
      </div>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/20 bg-surface/40 p-5 transition-all hover:border-primary hover:bg-surface"
  >
    <div className="rounded-xl bg-gradient-warm p-3 text-primary-foreground shadow-soft transition-transform group-hover:scale-110">
      <Icon className="h-5 w-5" />
    </div>
    <span className="font-display font-semibold">{label}</span>
    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
  </Link>
);

export default DashboardHome;