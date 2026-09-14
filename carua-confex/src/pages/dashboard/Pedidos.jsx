import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/Dialog";
import {
  Plus, Calendar, User, Package, ArrowRight, Undo2, CheckCircle2, Scissors, Sparkles,
  Truck, Circle, AlertTriangle, Clock, UserCheck, UserX, Wand2, X,
  Palette, Droplet, ShieldCheck, PenTool, Box,
} from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getPedidos } from "../../services/pedidosservice";
import { getEquipe } from "../../services/equipeservice";
import { useToast } from "../../hooks/use-toast";

const iconeMap = {
  corte: Scissors, costura: Circle, acabamento: Sparkles, entrega: Truck,
  bordado: PenTool, estampa: Palette, lavagem: Droplet,
  embalagem: Box, qualidade: ShieldCheck, modelagem: PenTool, custom: Circle,
};

// TODO: modelos de fluxo ainda não vêm do backend. Se fizer sentido a equipe
// gerenciar isso pelo painel, criar um endpoint (ex: GET /fluxo-templates) e
// trocar esta constante por um fetch, seguindo o mesmo padrão dos outros services.
// Ajuste os templates abaixo para os que fazem sentido no negócio.
const fluxoTemplates = [
  {
    id: "padrao",
    nome: "Padrão",
    descricao: "Corte, costura, acabamento e entrega.",
    etapas: [
      { nome: "Corte", icone: "corte" },
      { nome: "Costura", icone: "costura" },
      { nome: "Acabamento", icone: "acabamento" },
      { nome: "Entrega", icone: "entrega" },
    ],
  },
  {
    id: "estampado",
    nome: "Com estampa",
    descricao: "Inclui etapa de estamparia antes da costura.",
    etapas: [
      { nome: "Corte", icone: "corte" },
      { nome: "Estampa", icone: "estampa" },
      { nome: "Costura", icone: "costura" },
      { nome: "Acabamento", icone: "acabamento" },
      { nome: "Entrega", icone: "entrega" },
    ],
  },
  {
    id: "bordado_qualidade",
    nome: "Bordado + qualidade",
    descricao: "Fluxo com bordado e checagem final de qualidade.",
    etapas: [
      { nome: "Corte", icone: "corte" },
      { nome: "Costura", icone: "costura" },
      { nome: "Bordado", icone: "bordado" },
      { nome: "Acabamento", icone: "acabamento" },
      { nome: "Qualidade", icone: "qualidade" },
      { nome: "Entrega", icone: "entrega" },
    ],
  },
];

const diasRestantes = (prazo) => Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);
const uid = () => Math.random().toString(36).slice(2, 9);

const prazoBadge = (prazo, finalizado) => {
  if (finalizado) {
    return (
      <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
        <CheckCircle2 className="h-3 w-3" /> Entregue
      </Badge>
    );
  }
  const d = diasRestantes(prazo);
  if (d < 0) {
    return (
      <Badge variant="outline" className="gap-1 border-destructive/30 bg-destructive/10 text-destructive">
        <AlertTriangle className="h-3 w-3" /> Atrasado {Math.abs(d)}d
      </Badge>
    );
  }
  if (d <= 3) {
    return (
      <Badge variant="outline" className="gap-1 border-warning/40 bg-warning/10 text-warning">
        <Clock className="h-3 w-3" /> Urgente · {d}d
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-border bg-muted text-muted-foreground">
      <Calendar className="h-3 w-3" /> {d} dias
    </Badge>
  );
};

// Cria fluxo a partir do legado (etapas fixas) se o pedido não tiver fluxo customizado.
// Mantém compatibilidade com o formato { etapaAtual, etapas } já usado em
// DashboardHome.jsx e Financeiro.jsx, caso o backend ainda não retorne "fluxo".
const fluxoDefault = (p) => {
  if (p.fluxo && p.fluxo.length) return p.fluxo;
  const ordem = ["corte", "costura", "acabamento", "entrega"];
  return ordem.map((e) => ({
    id: `${p.id}-${e}`,
    nome: e[0].toUpperCase() + e.slice(1),
    status: p.etapas?.[e] ?? "pendente",
    responsavel: p.responsaveisPorEtapa?.[e],
    icone: e,
  }));
};

const Pedidos = () => {
  const { toast } = useToast();

  const [lista, setLista] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const [form, setForm] = useState({
    cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "",
    fluxo: [],
  });
  const [novaEtapa, setNovaEtapa] = useState("");

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPedidos(), getEquipe()])
      .then(([listaPedidos, listaEquipe]) => {
        if (ativo) {
          setLista(listaPedidos.map((p) => ({ ...p, fluxo: fluxoDefault(p) })));
          setEquipe(listaEquipe);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os pedidos. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const aplicarTemplate = (id) => {
    const t = fluxoTemplates.find((x) => x.id === id);
    if (!t) return;
    setForm((f) => ({
      ...f,
      fluxo: t.etapas.map((e) => ({ nome: e.nome, icone: e.icone, responsavel: undefined })),
    }));
    toast({ title: `Template "${t.nome}" aplicado`, variant: "success" });
  };

  const addEtapa = () => {
    if (!novaEtapa.trim()) return;
    setForm((f) => ({ ...f, fluxo: [...f.fluxo, { nome: novaEtapa.trim(), icone: "custom" }] }));
    setNovaEtapa("");
  };
  const rmEtapa = (i) => setForm((f) => ({ ...f, fluxo: f.fluxo.filter((_, idx) => idx !== i) }));
  const moverEtapa = (i, dir) => {
    const novo = [...form.fluxo];
    const j = i + dir;
    if (j < 0 || j >= novo.length) return;
    [novo[i], novo[j]] = [novo[j], novo[i]];
    setForm({ ...form, fluxo: novo });
  };
  const setRespForm = (i, nome) => {
    const novo = [...form.fluxo];
    novo[i] = { ...novo[i], responsavel: nome || undefined };
    setForm({ ...form, fluxo: novo });
  };

  // Etapas únicas para filtros
  const etapasGlobais = useMemo(() => {
    const set = new Set();
    lista.forEach((p) => fluxoDefault(p).forEach((e) => set.add(e.nome)));
    return Array.from(set);
  }, [lista]);

  const etapaAtualNome = (p) => {
    const f = fluxoDefault(p);
    const ativa = f.find((e) => e.status === "em_andamento") ?? f.find((e) => e.status === "pendente");
    return ativa?.nome ?? f[f.length - 1].nome;
  };

  const filtrados = filtro === "todos" ? lista : lista.filter((p) => etapaAtualNome(p) === filtro);

  const avancarEtapa = (id) => {
    // TODO: enviar para o backend quando existir um PATCH /pedidos/:id/avancar.
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const f = fluxoDefault(p);
        const idx = f.findIndex((e) => e.status === "em_andamento");
        const novo = [...f];
        if (idx === -1) return p;
        novo[idx] = { ...novo[idx], status: "concluido" };
        if (idx + 1 < novo.length) {
          novo[idx + 1] = { ...novo[idx + 1], status: "em_andamento" };
          toast({
            title: `Lote ${id} → ${novo[idx + 1].nome}${novo[idx + 1].responsavel ? ` (com ${novo[idx + 1].responsavel})` : ""}`,
            variant: "success",
          });
        } else {
          toast({ title: `Lote ${id} finalizado!`, variant: "success" });
        }
        return { ...p, fluxo: novo };
      })
    );
  };

  const voltarEtapa = (id) => {
    // TODO: enviar para o backend quando existir um PATCH /pedidos/:id/voltar.
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const f = fluxoDefault(p);
        const idx = f.findIndex((e) => e.status === "em_andamento");
        if (idx <= 0) return p;
        const novo = [...f];
        novo[idx] = { ...novo[idx], status: "pendente" };
        novo[idx - 1] = { ...novo[idx - 1], status: "em_andamento" };
        toast({ title: `Lote ${id} voltou para ${novo[idx - 1].nome}`, variant: "default" });
        return { ...p, fluxo: novo };
      })
    );
  };

  const atribuir = (pedidoId, etapaId, nome) => {
    // TODO: enviar para o backend quando existir um PATCH /pedidos/:id/etapas/:etapaId.
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== pedidoId) return p;
        const f = fluxoDefault(p);
        const novo = f.map((e) => (e.id === etapaId ? { ...e, responsavel: nome || undefined } : e));
        return { ...p, fluxo: novo };
      })
    );
    if (nome) toast({ title: `${nome} atribuído(a) à etapa`, variant: "success" });
  };

  const criarPedido = () => {
    if (!form.cliente || !form.produto || !form.quantidade) {
      toast({ title: "Preencha cliente, produto e quantidade", variant: "destructive" });
      return;
    }
    if (form.fluxo.length === 0) {
      toast({ title: "Defina ao menos uma etapa do fluxo", variant: "destructive" });
      return;
    }

    const fluxo = form.fluxo.map((e, i) => ({
      id: uid(),
      nome: e.nome,
      icone: e.icone,
      status: i === 0 ? "em_andamento" : "pendente",
      responsavel: e.responsavel,
    }));

    // TODO: enviar para o backend quando existir um POST /pedidos (createPedido em
    // pedidosservice.js). O ID abaixo é só um placeholder local até a API devolver o real.
    const novo = {
      id: `LT-${Date.now().toString().slice(-6)}`,
      cliente: form.cliente,
      produto: form.produto,
      quantidade: Number(form.quantidade),
      prazo: form.prazo || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      valorPeca: Number(form.valorPeca) || 10,
      responsaveisPorEtapa: {},
      etapaAtual: "corte",
      etapas: { corte: "em_andamento", costura: "pendente", acabamento: "pendente", entrega: "pendente" },
      criadoEm: new Date().toISOString().slice(0, 10),
      fluxo,
    };
    setLista([novo, ...lista]);
    setForm({ cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "", fluxo: [] });
    setOpen(false);
    toast({ title: `Pedido ${novo.id} criado com fluxo customizado`, variant: "success" });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Pedidos"
          description="Cada lote pode ter seu próprio fluxo de produção. Use templates ou crie etapas sob medida."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Pedidos"
          description="Cada lote pode ter seu próprio fluxo de produção. Use templates ou crie etapas sob medida."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pedidos"
        description="Cada lote pode ter seu próprio fluxo de produção. Use templates ou crie etapas sob medida."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant="hero" size="lg">
                <Plus /> Novo pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">Novo pedido (lote)</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Cliente" value={form.cliente} onChange={(v) => setForm({ ...form, cliente: v })} placeholder="Loja Mariposa" />
                  <Field label="Produto" value={form.produto} onChange={(v) => setForm({ ...form, produto: v })} placeholder="Camiseta básica" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Quantidade" type="number" value={form.quantidade} onChange={(v) => setForm({ ...form, quantidade: v })} placeholder="100" />
                  <Field label="Valor/peça (R$)" type="number" value={form.valorPeca} onChange={(v) => setForm({ ...form, valorPeca: v })} placeholder="10" />
                  <Field label="Prazo" type="date" value={form.prazo} onChange={(v) => setForm({ ...form, prazo: v })} />
                </div>

                {/* FLUXO FLEXÍVEL */}
                <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-display text-sm">Fluxo de produção</Label>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Cada produção é única — defina as etapas que fazem sentido para este pedido.
                      </p>
                    </div>
                    <Wand2 className="h-4 w-4 text-primary" />
                  </div>

                  {/* Templates */}
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Começar com um template
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {fluxoTemplates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => aplicarTemplate(t.id)}
                          className="rounded-lg border border-border bg-background p-2 text-left transition-all hover:border-primary/50 hover:shadow-soft"
                        >
                          <p className="text-xs font-semibold">{t.nome}</p>
                          <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">{t.descricao}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de etapas editável */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Etapas ({form.fluxo.length})
                    </p>
                    {form.fluxo.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border bg-background/50 p-4 text-center">
                        <p className="text-xs text-muted-foreground">Escolha um template acima ou adicione etapas abaixo</p>
                      </div>
                    )}
                    {form.fluxo.map((e, i) => {
                      const Icon = iconeMap[e.icone ?? "custom"] ?? Circle;
                      const aptos = equipe.filter((m) => m.ativo);
                      return (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => moverEtapa(i, -1)}
                              disabled={i === 0}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => moverEtapa(i, 1)}
                              disabled={i === form.fluxo.length - 1}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {i + 1}. {e.nome}
                            </p>
                          </div>
                          <select
                            value={e.responsavel || ""}
                            onChange={(ev) => setRespForm(i, ev.target.value)}
                            className="h-8 max-w-[140px] rounded-md border border-input bg-background px-2 text-xs"
                          >
                            <option value="">— Responsável —</option>
                            {aptos.map((m) => (
                              <option key={m.id} value={m.nome}>
                                {m.nome}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => rmEtapa(i)}
                            className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Adicionar etapa custom */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da nova etapa (ex: Tingimento, Pré-lavagem)"
                      value={novaEtapa}
                      onChange={(e) => setNovaEtapa(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEtapa();
                        }
                      }}
                      className="h-9 text-sm"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={addEtapa}>
                      <Plus className="h-4 w-4" /> Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="hero" onClick={criarPedido}>
                  Criar pedido
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Resumo / filtros por etapa */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro("todos")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            filtro === "todos" ? "border-primary bg-gradient-warm text-primary-foreground" : "border-border bg-card hover:border-primary/40"
          }`}
        >
          Todos · {lista.length}
        </button>
        {etapasGlobais.map((nome) => {
          const count = lista.filter((p) => etapaAtualNome(p) === nome).length;
          if (count === 0) return null;
          const ativa = filtro === nome;
          return (
            <button
              key={nome}
              onClick={() => setFiltro(ativa ? "todos" : nome)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                ativa ? "border-primary bg-gradient-warm text-primary-foreground" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {nome} · {count}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filtrados.map((p) => {
          const f = fluxoDefault(p);
          const finalizado = f.every((e) => e.status === "concluido");
          const ativaIdx = f.findIndex((e) => e.status === "em_andamento");
          const ativa = ativaIdx >= 0 ? f[ativaIdx] : null;
          const proxima = ativaIdx >= 0 && ativaIdx < f.length - 1 ? f[ativaIdx + 1] : null;
          const podeFinalizarUltima = ativa && ativaIdx === f.length - 1;
          const concluidas = f.filter((e) => e.status === "concluido").length;
          const progresso = (concluidas / f.length) * 100;
          const semRespCount = f.filter((e) => !e.responsavel && e.status !== "concluido").length;

          return (
            <Card key={p.id} className="overflow-hidden shadow-soft transition-all hover:shadow-warm">
              <CardContent className="p-0">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">{p.id}</span>
                      {prazoBadge(p.prazo, finalizado)}
                      <Badge variant="outline" className="gap-1 border-border bg-surface text-muted-foreground">
                        <Wand2 className="h-3 w-3" /> {f.length} etapas
                      </Badge>
                      {semRespCount > 0 && !finalizado && (
                        <Badge variant="outline" className="gap-1 border-warning/40 bg-warning/10 text-warning">
                          <UserX className="h-3 w-3" /> {semRespCount} sem responsável
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight">{p.produto}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {p.cliente}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" /> {p.quantidade} peças
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {new Date(p.prazo).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total previsto</p>
                    <p className="font-display text-2xl font-bold text-primary">
                      R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="bg-surface/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fluxo personalizado</p>
                    <p className="text-xs font-medium text-muted-foreground">{Math.round(progresso)}% concluído</p>
                  </div>

                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(f.length, 4)}, minmax(0, 1fr))` }}>
                    {f.map((e, i) => {
                      const Icon = iconeMap[e.icone ?? "custom"] ?? Circle;
                      const concluida = e.status === "concluido";
                      const emAnd = e.status === "em_andamento";
                      const aptos = equipe.filter((m) => m.ativo);
                      return (
                        <div
                          key={e.id}
                          className={`rounded-lg border p-3 transition-all ${
                            concluida
                              ? "border-success/30 bg-success/5"
                              : emAnd
                              ? "border-accent bg-accent/5 shadow-glow"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                concluida ? "bg-success text-background" : emAnd ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {concluida ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-xs font-semibold ${concluida ? "text-success" : emAnd ? "text-accent" : "text-foreground"}`}>
                                {e.nome}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {concluida ? "Concluído" : emAnd ? "Em andamento" : "Aguardando"}
                              </p>
                            </div>
                            <Icon className="h-4 w-4 text-muted-foreground/60" />
                          </div>
                          <div className="mt-2">
                            {concluida && e.responsavel ? (
                              <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[11px] text-success">
                                <UserCheck className="h-3 w-3" /> {e.responsavel}
                              </div>
                            ) : (
                              <select
                                value={e.responsavel || ""}
                                disabled={finalizado}
                                onChange={(ev) => atribuir(p.id, e.id, ev.target.value)}
                                className={`h-7 w-full rounded-md border px-1.5 text-[11px] ${
                                  e.responsavel ? "border-primary/30 bg-primary/5 font-medium text-primary" : "border-warning/40 bg-warning/5 text-warning"
                                }`}
                              >
                                <option value="">— Definir —</option>
                                {aptos.map((m) => (
                                  <option key={m.id} value={m.nome}>
                                    {m.nome}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-warm transition-all duration-500" style={{ width: `${progresso}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card p-4">
                  <div className="text-sm">
                    {finalizado ? (
                      <span className="flex items-center gap-2 font-medium text-success">
                        <CheckCircle2 className="h-4 w-4" /> Pedido finalizado
                      </span>
                    ) : ativa ? (
                      <span className="text-muted-foreground">
                        Agora: <span className="font-semibold text-foreground">{ativa.nome}</span>
                        {ativa.responsavel ? (
                          <>
                            {" "}
                            com <span className="font-semibold text-primary">{ativa.responsavel}</span>
                          </>
                        ) : (
                          <span className="text-warning"> · sem responsável</span>
                        )}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {!finalizado && ativaIdx > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => voltarEtapa(p.id)}>
                        <Undo2 className="h-4 w-4" /> Voltar
                      </Button>
                    )}
                    {!finalizado && proxima && ativa && (
                      <Button size="sm" variant="accent" onClick={() => avancarEtapa(p.id)}>
                        Concluir {ativa.nome} <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                    {podeFinalizarUltima && (
                      <Button size="sm" variant="hero" onClick={() => avancarEtapa(p.id)}>
                        <CheckCircle2 className="h-4 w-4" /> Finalizar pedido
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtrados.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <p className="font-display font-semibold">Nenhum pedido nesta etapa</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, ...rest }) => (
  <div>
    <Label>{label}</Label>
    <Input className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
  </div>
);

export default Pedidos;