import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { FileText, Printer, TrendingUp, Package, Users, Calendar, ArrowRight } from "lucide-react";
import { getPedidos } from "../../services/pedidosservice";
import { getEquipe } from "../../services/equipeservice";
import { getMateriais } from "../../services/materiaisservice";

const etapaLabel = {
  corte: "Corte",
  costura: "Costura",
  acabamento: "Acabamento",
  entrega: "Entrega",
};

const Relatorios = () => {
  const [pedidoId, setPedidoId] = useState("geral");

  const [pedidos, setPedidos] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Movimentações de estoque ainda não têm um serviço próprio no backend.
  // Quando existir (ex: getMovimentos em materiaisservice.js), é só trocar
  // este estado local pela chamada real, seguindo o mesmo padrão de Materiais.jsx.
  const [movimentos] = useState([]);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPedidos(), getEquipe(), getMateriais()])
      .then(([listaPedidos, listaEquipe, listaMateriais]) => {
        if (!ativo) return;

        setPedidos(listaPedidos);
        setEquipe(listaEquipe);
        setMateriais(listaMateriais);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os relatórios. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const totalGeral = useMemo(() => {
    const totalPecas = pedidos.reduce((s, p) => s + p.quantidade, 0);
    const receita = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
    const concluidos = pedidos.filter((p) => p.etapas?.entrega === "concluido");
    const ativos = pedidos.length - concluidos.length;
    const ticketMedio = pedidos.length ? receita / pedidos.length : 0;

    const porEtapa = { corte: 0, costura: 0, acabamento: 0, entrega: 0 };
    pedidos.forEach((p) => {
      if (p.etapaAtual in porEtapa) porEtapa[p.etapaAtual]++;
    });

    const porMembro = {};
    pedidos.forEach((p) => {
      if (!p.responsavel) return;
      const membro = equipe.find((m) => m.nome === p.responsavel);
      const valor = membro ? membro.pagamentoPorPeca * p.quantidade : 0;
      if (!porMembro[p.responsavel]) porMembro[p.responsavel] = { pedidos: 0, pecas: 0, valor: 0 };
      porMembro[p.responsavel].pedidos++;
      porMembro[p.responsavel].pecas += p.quantidade;
      porMembro[p.responsavel].valor += valor;
    });

    return { totalPecas, receita, concluidos: concluidos.length, ativos, ticketMedio, porEtapa, porMembro };
  }, [pedidos, equipe]);

  const detalhePedido = useMemo(() => {
    if (pedidoId === "geral") return null;
    const p = pedidos.find((x) => x.id === pedidoId);
    if (!p) return null;
    const membro = equipe.find((m) => m.nome === p.responsavel);
    const receita = p.quantidade * p.valorPeca;
    const custoMaoObra = membro ? membro.pagamentoPorPeca * p.quantidade : 0;
    const margem = receita - custoMaoObra;
    const movs = movimentos.filter((m) => m.pedidoId === p.id);
    const matsVinc = materiais.filter((m) => m.vinculadoA === p.id);
    const concluidas = Object.values(p.etapas ?? {}).filter((s) => s === "concluido").length;
    const progresso = Math.round((concluidas / 4) * 100);
    return { p, membro, receita, custoMaoObra, margem, movs, matsVinc, progresso };
  }, [pedidoId, pedidos, equipe, materiais, movimentos]);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Relatórios" description="Visão geral da produção ou aprofundamento por pedido." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader title="Relatórios" description="Visão geral da produção ou aprofundamento por pedido." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 print:space-y-4">
      <PageHeader
        title="Relatórios"
        description="Visão geral da produção ou aprofundamento por pedido."
        action={
          <Button variant="soft" onClick={() => window.print()} className="print:hidden">
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button
          size="sm"
          variant={pedidoId === "geral" ? "default" : "soft"}
          onClick={() => setPedidoId("geral")}
        >
          <FileText className="h-4 w-4" /> Geral
        </Button>
        {pedidos.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={pedidoId === p.id ? "default" : "soft"}
            onClick={() => setPedidoId(p.id)}
            className="font-mono"
          >
            {p.id}
          </Button>
        ))}
      </div>

      {pedidoId === "geral" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Pedidos ativos" value={totalGeral.ativos} icon={FileText} />
            <KPI label="Pedidos concluídos" value={totalGeral.concluidos} icon={TrendingUp} />
            <KPI label="Total de peças" value={totalGeral.totalPecas} icon={Package} />
            <KPI
              label="Receita prevista"
              value={`R$ ${totalGeral.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Pedidos por etapa atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(totalGeral.porEtapa).map((e) => {
                  const v = totalGeral.porEtapa[e];
                  const pct = pedidos.length ? (v / pedidos.length) * 100 : 0;
                  return (
                    <div key={e}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium">{etapaLabel[e]}</span>
                        <span className="text-muted-foreground">{v} pedido(s)</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface">
                        <div className="h-full rounded-full bg-gradient-warm" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Produção por membro da equipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(totalGeral.porMembro).map(([nome, v]) => (
                  <div key={nome} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display font-bold text-primary-foreground">
                        {nome[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {v.pedidos} pedido(s) · {v.pecas} peças
                        </p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-primary">
                      R$ {v.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                {Object.keys(totalGeral.porMembro).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum responsável atribuído.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Lista de pedidos</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2">Lote</th>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th className="text-right">Peças</th>
                    <th>Etapa</th>
                    <th className="text-right">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id} className="border-b border-border/60">
                      <td className="py-2 font-mono font-semibold text-primary">{p.id}</td>
                      <td>{p.cliente}</td>
                      <td className="text-muted-foreground">{p.produto}</td>
                      <td className="text-right">{p.quantidade}</td>
                      <td>
                        <Badge variant="outline" className="capitalize">
                          {etapaLabel[p.etapaAtual]}
                        </Badge>
                      </td>
                      <td className="text-right font-display font-semibold">
                        R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {detalhePedido && (
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{detalhePedido.p.id}</p>
                  <h2 className="heading-display text-2xl">{detalhePedido.p.produto}</h2>
                  <p className="text-sm text-muted-foreground">Cliente: {detalhePedido.p.cliente}</p>
                </div>
                <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent capitalize">
                  Etapa: {etapaLabel[detalhePedido.p.etapaAtual]}
                </Badge>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Mini label="Quantidade" value={`${detalhePedido.p.quantidade} peças`} icon={Package} />
                <Mini
                  label="Prazo"
                  value={new Date(detalhePedido.p.prazo).toLocaleDateString("pt-BR")}
                  icon={Calendar}
                />
                <Mini label="Responsável" value={detalhePedido.p.responsavel ?? "—"} icon={Users} />
                <Mini label="Progresso" value={`${detalhePedido.progresso}%`} icon={TrendingUp} />
              </div>

              <div className="mt-5 h-2 rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gradient-warm transition-all"
                  style={{ width: `${detalhePedido.progresso}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-lg">Resumo financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row
                  label="Receita"
                  value={`R$ ${detalhePedido.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                />
                <Row
                  label={`Mão de obra${detalhePedido.membro ? ` (${detalhePedido.membro.nome})` : ""}`}
                  value={`- R$ ${detalhePedido.custoMaoObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                />
                <div className="border-t border-border pt-2">
                  <Row
                    label="Margem estimada"
                    value={`R$ ${detalhePedido.margem.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    bold
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-lg">Etapas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(detalhePedido.p.etapas ?? {}).map((e) => {
                  const s = detalhePedido.p.etapas[e];
                  const cor =
                    s === "concluido"
                      ? "bg-success/15 text-success border-success/30"
                      : s === "em_andamento"
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "bg-muted text-muted-foreground border-border";
                  return (
                    <div key={e} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                      <span>{etapaLabel[e]}</span>
                      <Badge variant="outline" className={cor}>
                        {s.replace("_", " ")}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-lg">Materiais usados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {detalhePedido.matsVinc.length === 0 && detalhePedido.movs.length === 0 && (
                  <p className="text-muted-foreground">Nenhum material vinculado.</p>
                )}
                {detalhePedido.matsVinc.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg bg-surface p-2">
                    <span>{m.nome}</span>
                    <span className="text-xs text-muted-foreground">vinculado</span>
                  </div>
                ))}
                {detalhePedido.movs.map((mv) => {
                  const mat = materiais.find((m) => m.id === mv.materialId);
                  return (
                    <div key={mv.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-xs">
                      <span className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-destructive" /> {mat?.nome}
                      </span>
                      <span>
                        {mv.quantidade} {mat?.unidade}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const KPI = ({ label, value, icon: Icon }) => (
  <Card className="shadow-soft">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Mini = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg bg-surface p-3">
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </p>
    <p className="mt-1 font-display font-semibold">{value}</p>
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={bold ? "font-display text-lg font-bold text-primary" : "font-medium"}>{value}</span>
  </div>
);

export default Relatorios;