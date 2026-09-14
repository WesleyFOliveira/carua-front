import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { TrendingUp, Wallet, Receipt, Users, AlertCircle } from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getPedidos } from "../../services/pedidosservice";
import { getEquipe } from "../../services/equipeservice";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const brl = (v) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const brlShort = (v) => (v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v.toFixed(0)}`);

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
};

const Financeiro = () => {
  const [pedidos, setPedidos] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPedidos(), getEquipe()])
      .then(([listaPedidos, listaEquipe]) => {
        if (ativo) {
          setPedidos(listaPedidos);
          setEquipe(listaEquipe);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os dados financeiros. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const total = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const concluidos = pedidos.filter((p) => p.etapas?.entrega === "concluido");
  const recebido = concluidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const pendente = total - recebido;

  // Pagamentos por membro
  const porProfissional = useMemo(() => {
    const acc = {};
    pedidos.forEach((p) => {
      if (!p.responsavel) return;
      const m = equipe.find((e) => e.nome === p.responsavel);
      if (!m) return;
      acc[p.responsavel] = (acc[p.responsavel] ?? 0) + p.quantidade * m.pagamentoPorPeca;
    });
    return acc;
  }, [pedidos, equipe]);

  const totalMaoDeObra = Object.values(porProfissional).reduce((s, v) => s + v, 0);
  const margem = total - totalMaoDeObra;
  const margemPct = total > 0 ? (margem / total) * 100 : 0;

  // Gráfico: receita x mão de obra por pedido
  const dadosPedidos = pedidos.map((p) => {
    const membro = p.responsavel ? equipe.find((m) => m.nome === p.responsavel) : null;
    const mao = membro ? p.quantidade * membro.pagamentoPorPeca : 0;
    const receita = p.quantidade * p.valorPeca;
    return {
      id: p.id,
      Receita: receita,
      "Mão de obra": mao,
      Margem: receita - mao,
    };
  });

  // Pie: recebido x pendente
  const dadosStatus = [
    { name: "Recebido", value: recebido, color: "hsl(var(--success))" },
    { name: "A receber", value: pendente, color: "hsl(var(--accent))" },
  ];

  // Pagamentos por pessoa
  const dadosEquipe = Object.entries(porProfissional)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);

  // Linha: evolução acumulada por data de criação
  const dadosEvolucao = useMemo(() => {
    const ordenados = [...pedidos].sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
    let acumReceita = 0;
    let acumCusto = 0;
    return ordenados.map((p) => {
      const membro = p.responsavel ? equipe.find((m) => m.nome === p.responsavel) : null;
      acumReceita += p.quantidade * p.valorPeca;
      acumCusto += membro ? p.quantidade * membro.pagamentoPorPeca : 0;
      return {
        data: new Date(p.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        Receita: acumReceita,
        Custo: acumCusto,
      };
    });
  }, [pedidos, equipe]);

  const cards = [
    { label: "Receita prevista", value: total, icon: TrendingUp, color: "from-primary to-primary-glow", hint: `${pedidos.length} pedidos` },
    { label: "Já recebido", value: recebido, icon: Wallet, color: "from-success to-success", hint: `${concluidos.length} entregues` },
    { label: "A receber", value: pendente, icon: Receipt, color: "from-accent to-warning", hint: `${pedidos.length - concluidos.length} em produção` },
    { label: "Margem líquida", value: margem, icon: Users, color: "from-primary to-accent", hint: `${margemPct.toFixed(1)}% da receita` },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Financeiro" description="Receitas, custos de mão de obra e margem real por produção." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando dados financeiros...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader title="Financeiro" description="Receitas, custos de mão de obra e margem real por produção." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Financeiro" description="Receitas, custos de mão de obra e margem real por produção." />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="overflow-hidden shadow-soft">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${c.color} p-5 text-primary-foreground`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide opacity-90">{c.label}</p>
                  <c.icon className="h-5 w-5 opacity-90" />
                </div>
                <p className="mt-3 font-display text-2xl font-bold">{brl(c.value)}</p>
                <p className="mt-1 text-xs opacity-80">{c.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos topo */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Receita x Mão de obra por pedido</CardTitle>
            <p className="text-xs text-muted-foreground">Compare quanto cada lote gera e quanto custa em produção.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosPedidos} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="id" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tickFormatter={brlShort} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => brl(v)}
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Receita" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Mão de obra" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Margem" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">Status do caixa</CardTitle>
            <p className="text-xs text-muted-foreground">Quanto já entrou e quanto ainda está a receber.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dadosStatus} innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {dadosStatus.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => brl(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {dadosStatus.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-display font-bold">{brl(d.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos meio */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">Evolução acumulada</CardTitle>
            <p className="text-xs text-muted-foreground">Receita vs custo conforme novos pedidos entram.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dadosEvolucao} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="data" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tickFormatter={brlShort} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => brl(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Receita" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Custo" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">Pagamento por pessoa da equipe</CardTitle>
            <p className="text-xs text-muted-foreground">Total a pagar com base no valor por peça de cada membro.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dadosEquipe} layout="vertical" margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={brlShort} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis type="category" dataKey="nome" width={90} tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => brl(v)} />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">Detalhamento por pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pedidos.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">Nenhum pedido cadastrado ainda.</p>
            )}
            {pedidos.map((p) => {
              const m = p.responsavel ? equipe.find((e) => e.nome === p.responsavel) : null;
              const mao = m ? p.quantidade * m.pagamentoPorPeca : 0;
              const rec = p.quantidade * p.valorPeca;
              return (
                <div key={p.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-primary">{p.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.quantidade} × {brl(p.valorPeca)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold">{brl(rec)}</p>
                      {p.etapas?.entrega === "concluido" ? (
                        <Badge className="border-success/30 bg-success/15 text-success" variant="outline">
                          Pago
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
                          A receber
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                    <span className="text-muted-foreground">
                      Mão de obra: <span className="font-medium text-foreground">{brl(mao)}</span>
                    </span>
                    <span className={`font-display font-bold ${rec - mao >= 0 ? "text-success" : "text-destructive"}`}>
                      Margem {brl(rec - mao)}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">A pagar à equipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dadosEquipe.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" /> Nenhum pedido com responsável atribuído ainda.
              </div>
            )}
            {dadosEquipe.map(({ nome, valor }) => {
              const pct = totalMaoDeObra > 0 ? (valor / totalMaoDeObra) * 100 : 0;
              return (
                <div key={nome} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display font-bold text-primary-foreground">
                        {nome[0]}
                      </div>
                      <span className="font-medium">{nome}</span>
                    </div>
                    <span className="font-display text-lg font-bold text-primary">{brl(valor)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-warm" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{pct.toFixed(1)}% do total a pagar</p>
                </div>
              );
            })}
            <div className="mt-2 flex items-center justify-between rounded-lg bg-surface p-3">
              <span className="text-sm font-medium">Total a pagar</span>
              <span className="font-display text-lg font-bold text-primary">{brl(totalMaoDeObra)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;