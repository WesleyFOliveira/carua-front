import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import {
  Bell, Clock, XCircle, Flame, AlertCircle,
  ClipboardList, Users, UserX, Boxes,
} from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getPedidos } from "../../services/pedidosservice";
import { getMateriais } from "../../services/materiaisservice";
import { getEquipe } from "../../services/equipeservice";

const ETAPA_LABEL = {
  corte: "Corte",
  costura: "Costura",
  acabamento: "Acabamento",
  entrega: "Entrega",
};

const CORES = {
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
  warning: "border-warning/40 bg-warning/5 text-warning",
  info: "border-primary/30 bg-primary/5 text-primary",
};

const Alertas = () => {
  const [pedidos, setPedidos] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPedidos(), getMateriais(), getEquipe()])
      .then(([p, m, e]) => {
        if (ativo) {
          setPedidos(p);
          setMateriais(m);
          setEquipe(e);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os alertas. Tente novamente.");
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
          title="Alertas e gargalos"
          description="Tudo que precisa da sua atenção em um só lugar — antes que vire problema."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando alertas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Alertas e gargalos"
          description="Tudo que precisa da sua atenção em um só lugar — antes que vire problema."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  const hoje = new Date();
  const ativos = pedidos.filter((p) => p.etapaAtual !== "entrega");
  const atrasados = ativos.filter((p) => new Date(p.prazo) < hoje);
  const urgentes = ativos.filter((p) => {
    const d = (new Date(p.prazo).getTime() - hoje.getTime()) / 86400000;
    return d >= 0 && d <= 3;
  });
  const materiaisBaixos = materiais.filter((m) => m.estoque < m.minimo);
  const semResp = ativos.filter((p) => !p.responsaveisPorEtapa?.[p.etapaAtual]);

  const etapas = ["corte", "costura", "acabamento"];
  const equipePorEtapa = etapas.map((e) => ({
    etapa: e,
    membros: equipe.filter((m) => m.ativo && m.etapas.includes(e)).length,
    pedidos: ativos.filter((p) => p.etapaAtual === e).length,
  }));
  const gargalos = equipePorEtapa.filter(
    (e) => e.pedidos >= 2 && (e.membros === 0 || e.pedidos / e.membros >= 1.5)
  );

  const alertas = [];

  atrasados.forEach((p) =>
    alertas.push({
      tipo: "danger",
      icon: XCircle,
      titulo: `${p.id} ATRASADO`,
      msg: `${p.cliente} · ${p.produto} — prazo era ${new Date(p.prazo).toLocaleDateString("pt-BR")}`,
      link: "/confeccao/pedidos",
    })
  );
  urgentes.forEach((p) =>
    alertas.push({
      tipo: "warning",
      icon: Clock,
      titulo: `${p.id} vence em breve`,
      msg: `${p.cliente} · entrega em ${new Date(p.prazo).toLocaleDateString("pt-BR")}`,
      link: "/confeccao/pedidos",
    })
  );
  semResp.forEach((p) =>
    alertas.push({
      tipo: "warning",
      icon: UserX,
      titulo: `${p.id} sem responsável`,
      msg: `Etapa ${ETAPA_LABEL[p.etapaAtual]} ainda não foi atribuída a ninguém`,
      link: "/confeccao/pedidos",
    })
  );
  materiaisBaixos.forEach((m) =>
    alertas.push({
      tipo: "warning",
      icon: Boxes,
      titulo: `${m.nome} em falta`,
      msg: `Estoque ${m.estoque} ${m.unidade} (mínimo ${m.minimo})`,
      link: "/confeccao/materiais",
    })
  );
  gargalos.forEach((g) =>
    alertas.push({
      tipo: "info",
      icon: Flame,
      titulo: `Gargalo no ${ETAPA_LABEL[g.etapa]}`,
      msg: `${g.pedidos} pedidos para ${g.membros} membro(s) ativo(s)`,
      link: "/confeccao/parceiros",
    })
  );

  const resumo = [
    { label: "Atrasados", value: atrasados.length, color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
    { label: "Urgentes", value: urgentes.length, color: "text-warning", bg: "bg-warning/10", icon: Clock },
    { label: "Sem responsável", value: semResp.length, color: "text-warning", bg: "bg-warning/10", icon: UserX },
    { label: "Estoque baixo", value: materiaisBaixos.length, color: "text-destructive", bg: "bg-destructive/10", icon: Boxes },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Alertas e gargalos"
        description="Tudo que precisa da sua atenção em um só lugar — antes que vire problema."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resumo.map((r) => (
          <Card key={r.label} className="shadow-soft">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-xl p-2.5 ${r.bg}`}>
                <r.icon className={`h-5 w-5 ${r.color}`} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{r.label}</p>
                <p className="font-display text-2xl font-bold">{r.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Bell className="h-5 w-5 text-destructive" />
            Central de Alertas
            <Badge variant="destructive" className="ml-2">
              {alertas.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alertas.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              🎉 Nenhum alerta no momento. Produção tranquila!
            </p>
          ) : (
            alertas.map((a, i) => (
              <div
                key={i}
                className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${CORES[a.tipo]}`}
              >
                <div className="flex items-start gap-3">
                  <a.icon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{a.titulo}</p>
                    <p className="text-xs opacity-80">{a.msg}</p>
                  </div>
                </div>
                {a.link && (
                  <Button size="sm" variant="ghost" className="shrink-0">
                    <Link to={a.link}>Ver</Link>
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Gargalos */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Flame className="h-5 w-5 text-accent" /> Capacidade × Demanda por etapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Quantos pedidos estão em cada etapa vs. quantos membros podem executar essa etapa.
          </p>
          {equipePorEtapa.map((e) => {
            const isGargalo = e.pedidos >= 2 && (e.membros === 0 || e.pedidos / e.membros >= 1.5);
            const ratio = e.membros > 0 ? e.pedidos / e.membros : e.pedidos;
            return (
              <div
                key={e.etapa}
                className={`rounded-xl border p-4 ${
                  isGargalo ? "border-destructive/30 bg-destructive/5" : "border-border"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold uppercase">{ETAPA_LABEL[e.etapa]}</span>
                    {isGargalo && (
                      <Badge variant="destructive" className="text-[10px]">
                        GARGALO
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" /> {e.pedidos}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {e.membros}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                    <div
                      className={`h-full transition-all ${isGargalo ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, ratio * 50)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isGargalo ? "text-destructive" : "text-primary"}`}>
                    {ratio.toFixed(1)}x
                  </span>
                </div>
                {isGargalo && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-destructive/80">
                    <AlertCircle className="h-3 w-3" /> Considere realocar equipe ou redistribuir pedidos
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Alertas;