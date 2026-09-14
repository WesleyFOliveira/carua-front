import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Progress } from "../../components/ui/Progress";
import {
  Plus, ArrowDown, ArrowUp, History, Search, Package, AlertTriangle, Boxes,
  ClipboardList, Factory, UserRound, Bookmark, BookmarkX,
} from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getMateriais } from "../../services/materiaisservice";
import { getLotes } from "../../services/lotesservice";
import { getParceiros } from "../../services/parceirosservice";
import { useToast } from "../../hooks/use-toast";

const TIPO_PARCEIRO_LABEL = {
  faccao: "Facção",
  estamparia: "Estamparia",
  lavanderia: "Lavanderia",
  bordado: "Bordado",
  corte: "Corte",
};

const tipoLabel = {
  entrada: "Entrada",
  saida: "Consumo",
  reserva: "Reserva",
  liberar_reserva: "Liberar reserva",
};

const acoesTipos = [
  { tipo: "entrada", label: "Entrada", icon: ArrowDown, className: "text-success" },
  { tipo: "saida", label: "Consumo", icon: ArrowUp, className: "text-destructive" },
  { tipo: "reserva", label: "Reservar", icon: Bookmark, className: "text-accent" },
];

const Materiais = () => {
  const { toast } = useToast();

  const [lista, setLista] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Movimentações e profissionais autônomos ainda não têm um serviço próprio no backend.
  // Quando existirem (ex: getMovimentos/createMovimento em materiaisservice.js e um
  // marketplaceService com getProfissionais), é só trocar estes estados locais pela chamada real.
  const [movs, setMovs] = useState([]);
  const [profissionais] = useState([]);

  const [openNovo, setOpenNovo] = useState(false);
  const [openHist, setOpenHist] = useState(null);
  const [openMov, setOpenMov] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [form, setForm] = useState({ nome: "", unidade: "un", estoque: "", minimo: "" });
  const [movForm, setMovForm] = useState({
    quantidade: "",
    observacao: "",
    loteId: "",
    parceiroId: "",
    profissionalId: "",
    vinculo: "nenhum",
  });

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getMateriais(), getLotes(), getParceiros()])
      .then(([materiais, listaLotes, listaParceiros]) => {
        if (ativo) {
          setLista(materiais);
          setLotes(listaLotes);
          setParceiros(listaParceiros);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os materiais. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const disponivel = (m) => +(m.estoque - (m.reservado ?? 0)).toFixed(2);
  const movsDe = (id) =>
    movs.filter((m) => m.materialId === id).sort((a, b) => b.data.localeCompare(a.data));

  const stats = useMemo(() => {
    const baixo = lista.filter((m) => disponivel(m) < m.minimo).length;
    const total = lista.length;
    const movsHoje = movs.filter((m) => m.data === new Date().toISOString().slice(0, 10)).length;
    const reservadoTotal = lista.reduce((s, m) => s + (m.reservado ?? 0), 0);
    return { total, baixo, movsHoje, reservadoTotal };
  }, [lista, movs]);

  const filtrada = useMemo(() => {
    return lista.filter((m) => {
      const okBusca = !busca || m.nome.toLowerCase().includes(busca.toLowerCase());
      const okFiltro =
        filtro === "todos" ||
        (filtro === "baixo" && disponivel(m) < m.minimo) ||
        (filtro === "ok" && disponivel(m) >= m.minimo);
      return okBusca && okFiltro;
    });
  }, [lista, busca, filtro]);

  const aplicarMovimento = () => {
    if (!openMov) return;
    const qtd = Number(movForm.quantidade.replace(",", "."));
    if (!qtd || qtd <= 0) {
      toast({ title: "Informe uma quantidade válida", variant: "destructive" });
      return;
    }
    const { material, tipo } = openMov;

    const disp = disponivel(material);
    if (tipo === "saida" && disp < qtd) {
      toast({
        title: `Saldo disponível insuficiente (${disp} ${material.unidade})`,
        variant: "destructive",
      });
      return;
    }
    if (tipo === "reserva" && disp < qtd) {
      toast({ title: "Sem saldo disponível para reservar", variant: "destructive" });
      return;
    }
    if (tipo === "liberar_reserva" && (material.reservado ?? 0) < qtd) {
      toast({ title: "Reserva insuficiente", variant: "destructive" });
      return;
    }

    // TODO: enviar para o backend quando existir um POST /materiais/:id/movimentos.
    setLista((prev) =>
      prev.map((m) => {
        if (m.id !== material.id) return m;
        const reservadoAtual = m.reservado ?? 0;
        if (tipo === "entrada")
          return { ...m, estoque: +(m.estoque + qtd).toFixed(2), ultimaEntrada: new Date().toISOString().slice(0, 10) };
        if (tipo === "saida")
          return { ...m, estoque: +(m.estoque - qtd).toFixed(2) };
        if (tipo === "reserva")
          return { ...m, reservado: +(reservadoAtual + qtd).toFixed(2) };
        if (tipo === "liberar_reserva")
          return { ...m, reservado: +(reservadoAtual - qtd).toFixed(2) };
        return m;
      })
    );

    const loteId = movForm.vinculo === "lote" ? movForm.loteId || undefined : undefined;
    const parceiroId = movForm.vinculo === "parceiro" ? movForm.parceiroId || undefined : undefined;
    const profissionalId = movForm.vinculo === "profissional" ? movForm.profissionalId || undefined : undefined;
    const loteObj = loteId ? lotes.find((l) => l.id === loteId) : undefined;

    setMovs((prev) => [
      {
        id: `mv-${Date.now()}`,
        materialId: material.id,
        tipo,
        quantidade: qtd,
        observacao: movForm.observacao || undefined,
        loteId,
        parceiroId: parceiroId ?? loteObj?.parceiro?.id,
        profissionalId,
        pedidoId: loteObj?.ordemId,
        data: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

    toast({ title: `${tipoLabel[tipo]} de ${qtd} ${material.unidade} registrado`, variant: "success" });
    setMovForm({ quantidade: "", observacao: "", loteId: "", parceiroId: "", profissionalId: "", vinculo: "nenhum" });
    setOpenMov(null);
  };

  const criar = () => {
    if (!form.nome) {
      toast({ title: "Informe o nome do material", variant: "destructive" });
      return;
    }

    // TODO: enviar para o backend quando existir um POST /materiais (ex: createMaterial).
    const novo = {
      id: `M${lista.length + 1}`,
      nome: form.nome,
      unidade: form.unidade,
      estoque: Number(form.estoque) || 0,
      minimo: Number(form.minimo) || 0,
      reservado: 0,
      ultimaEntrada: new Date().toISOString().slice(0, 10),
    };
    setLista([novo, ...lista]);
    setForm({ nome: "", unidade: "un", estoque: "", minimo: "" });
    setOpenNovo(false);
    toast({ title: "Material cadastrado", variant: "success" });
  };

  const histMaterial = useMemo(() => (openHist ? lista.find((m) => m.id === openHist) : null), [openHist, lista]);
  const nomeLote = (id) => {
    const l = lotes.find((x) => x.id === id);
    return l ? `${l.id} · ${l.produto}` : undefined;
  };
  const nomeParceiro = (id) => parceiros.find((p) => p.id === id)?.nome;
  const nomeProfissional = (id) => profissionais.find((p) => p.id === id)?.nome;

  const lotesAtivos = lotes.filter((l) => l.status !== "entregue");
  const parceirosAtivos = parceiros.filter((p) => p.ativo);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Materiais"
          description="Entrada, consumo e reserva. Cada movimento pode ser vinculado a um lote, à facção ou ao profissional responsável."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando materiais...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Materiais"
          description="Entrada, consumo e reserva. Cada movimento pode ser vinculado a um lote, à facção ou ao profissional responsável."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Materiais"
        description="Entrada, consumo e reserva. Cada movimento pode ser vinculado a um lote, à facção ou ao profissional responsável."
        action={
          <Dialog open={openNovo} onOpenChange={setOpenNovo}>
            <DialogTrigger>
              <Button variant="hero" size="lg">
                <Plus /> Novo material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Cadastrar material</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div>
                  <Label>Nome</Label>
                  <Input
                    className="mt-1.5"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex: Tecido algodão"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Unidade</Label>
                    <Input
                      className="mt-1.5"
                      value={form.unidade}
                      onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                      placeholder="m / un / kg"
                    />
                  </div>
                  <div>
                    <Label>Estoque</Label>
                    <Input
                      className="mt-1.5"
                      type="number"
                      value={form.estoque}
                      onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Mínimo</Label>
                    <Input
                      className="mt-1.5"
                      type="number"
                      value={form.minimo}
                      onChange={(e) => setForm({ ...form, minimo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenNovo(false)}>
                  Cancelar
                </Button>
                <Button variant="hero" onClick={criar}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Resumo rápido */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Itens cadastrados</p>
              <p className="font-display text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`shadow-soft ${stats.baixo > 0 ? "border-destructive/40" : ""}`}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-destructive/10 p-2.5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disponível baixo</p>
              <p className="font-display text-2xl font-bold text-destructive">{stats.baixo}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-accent/10 p-2.5">
              <Bookmark className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reservado (lotes)</p>
              <p className="font-display text-2xl font-bold text-accent">{stats.reservadoTotal}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-surface p-2.5">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Movimentos hoje</p>
              <p className="font-display text-2xl font-bold">{stats.movsHoje}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca + filtro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar material..."
            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {[
            { v: "todos", l: "Todos" },
            { v: "baixo", l: "Disponível baixo" },
            { v: "ok", l: "Ok" },
          ].map((opt) => (
            <button
              key={opt.v}
              onClick={() => setFiltro(opt.v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtro === opt.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de materiais */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtrada.map((m) => {
          const reservado = m.reservado ?? 0;
          const disp = disponivel(m);
          const baixo = disp < m.minimo;
          const pctDisp = Math.min(100, (disp / Math.max(m.minimo * 2, 1)) * 100);
          const ultimosMovs = movsDe(m.id).slice(0, 2);
          return (
            <Card key={m.id} className={`shadow-soft transition hover:shadow-warm ${baixo ? "border-destructive/40" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ${baixo ? "bg-destructive/10" : "bg-surface"}`}>
                      <Package className={`h-5 w-5 ${baixo ? "text-destructive" : "text-primary"}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight">{m.nome}</h3>
                      <p className="text-xs text-muted-foreground">
                        Atualizado em {new Date(m.ultimaEntrada).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {baixo && (
                    <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                      Repor
                    </Badge>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-surface p-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estoque</p>
                    <p className="font-display text-lg font-bold text-foreground">
                      {m.estoque} <span className="text-xs font-normal text-muted-foreground">{m.unidade}</span>
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-accent">Reservado</p>
                    <p className="font-display text-lg font-bold text-accent">
                      {reservado} <span className="text-xs font-normal text-muted-foreground">{m.unidade}</span>
                    </p>
                  </div>
                  <div className={`rounded-lg p-2 ${baixo ? "bg-destructive/5" : "bg-primary/5"}`}>
                    <p className={`text-[10px] uppercase tracking-wider ${baixo ? "text-destructive" : "text-primary"}`}>
                      Disponível
                    </p>
                    <p className={`font-display text-lg font-bold ${baixo ? "text-destructive" : "text-primary"}`}>
                      {disp} <span className="text-xs font-normal text-muted-foreground">{m.unidade}</span>
                    </p>
                  </div>
                </div>
                <Progress value={pctDisp} className={`mt-2 h-1.5 ${baixo ? "[&>div]:bg-destructive" : ""}`} />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Mínimo: {m.minimo} {m.unidade}
                </p>

                {ultimosMovs.length > 0 && (
                  <div className="mt-4 space-y-1.5 rounded-lg bg-surface/60 p-2.5">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Últimos movimentos</p>
                    {ultimosMovs.map((mv) => (
                      <div key={mv.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        {mv.tipo === "entrada" && <ArrowDown className="h-3 w-3 text-success" />}
                        {mv.tipo === "saida" && <ArrowUp className="h-3 w-3 text-destructive" />}
                        {mv.tipo === "reserva" && <Bookmark className="h-3 w-3 text-accent" />}
                        {mv.tipo === "liberar_reserva" && <BookmarkX className="h-3 w-3 text-muted-foreground" />}
                        <span className="font-semibold">
                          {mv.tipo === "entrada" ? "+" : mv.tipo === "saida" ? "-" : ""}
                          {mv.quantidade} {m.unidade}
                        </span>
                        {mv.loteId && <span className="text-muted-foreground">· lote {mv.loteId}</span>}
                        {!mv.loteId && mv.parceiroId && (
                          <span className="text-muted-foreground">· {nomeParceiro(mv.parceiroId)}</span>
                        )}
                        {mv.profissionalId && (
                          <span className="text-muted-foreground">· {nomeProfissional(mv.profissionalId)}</span>
                        )}
                        <span className="ml-auto text-muted-foreground">
                          {new Date(mv.data).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {acoesTipos.map((a) => (
                    <Button key={a.tipo} size="sm" variant="soft" onClick={() => setOpenMov({ material: m, tipo: a.tipo })}>
                      <a.icon className={`h-4 w-4 ${a.className}`} /> {a.label}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" onClick={() => setOpenHist(m.id)}>
                    <History className="h-4 w-4" />
                  </Button>
                </div>
                {reservado > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 w-full text-xs"
                    onClick={() => setOpenMov({ material: m, tipo: "liberar_reserva" })}
                  >
                    <BookmarkX className="mr-1 h-3.5 w-3.5" /> Liberar reserva
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtrada.length === 0 && (
          <div className="md:col-span-2 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum material encontrado.
          </div>
        )}
      </div>

      {/* Diálogo de movimentação */}
      <Dialog open={!!openMov} onOpenChange={(v) => !v && setOpenMov(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              {openMov?.tipo === "entrada" && (
                <>
                  <ArrowDown className="h-4 w-4 text-success" /> Registrar entrada
                </>
              )}
              {openMov?.tipo === "saida" && (
                <>
                  <ArrowUp className="h-4 w-4 text-destructive" /> Registrar consumo
                </>
              )}
              {openMov?.tipo === "reserva" && (
                <>
                  <Bookmark className="h-4 w-4 text-accent" /> Reservar para lote
                </>
              )}
              {openMov?.tipo === "liberar_reserva" && (
                <>
                  <BookmarkX className="h-4 w-4" /> Liberar reserva
                </>
              )}
              <span className="truncate text-muted-foreground">— {openMov?.material.nome}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {openMov && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-surface p-2">
                  <p className="text-muted-foreground">Estoque</p>
                  <p className="font-semibold">
                    {openMov.material.estoque} {openMov.material.unidade}
                  </p>
                </div>
                <div className="rounded-lg bg-accent/5 p-2">
                  <p className="text-accent">Reservado</p>
                  <p className="font-semibold">
                    {openMov.material.reservado ?? 0} {openMov.material.unidade}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/5 p-2">
                  <p className="text-primary">Disponível</p>
                  <p className="font-semibold">
                    {disponivel(openMov.material)} {openMov.material.unidade}
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label>Quantidade ({openMov?.material.unidade})</Label>
              <Input
                className="mt-1.5"
                type="text"
                inputMode="decimal"
                autoFocus
                value={movForm.quantidade}
                onChange={(e) => setMovForm({ ...movForm, quantidade: e.target.value })}
                placeholder="Ex: 12,5"
              />
            </div>

            {openMov?.tipo !== "liberar_reserva" && (
              <div>
                <Label className="mb-2 block">Vincular a:</Label>
                <Tabs value={movForm.vinculo} onValueChange={(v) => setMovForm({ ...movForm, vinculo: v })}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="nenhum">—</TabsTrigger>
                    <TabsTrigger value="lote">
                      <ClipboardList className="mr-1 h-3.5 w-3.5" /> Lote
                    </TabsTrigger>
                    <TabsTrigger value="parceiro">
                      <Factory className="mr-1 h-3.5 w-3.5" /> Facção
                    </TabsTrigger>
                    <TabsTrigger value="profissional">
                      <UserRound className="mr-1 h-3.5 w-3.5" /> Prof.
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="lote" className="mt-3">
                    <select
                      value={movForm.loteId}
                      onChange={(e) => setMovForm({ ...movForm, loteId: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Selecione um lote em produção...</option>
                      {lotesAtivos.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.id} · {l.produto} — {l.quantidade} pç
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      A facção responsável pelo lote será registrada automaticamente.
                    </p>
                  </TabsContent>
                  <TabsContent value="parceiro" className="mt-3">
                    <select
                      value={movForm.parceiroId}
                      onChange={(e) => setMovForm({ ...movForm, parceiroId: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Selecione a facção / serviço...</option>
                      {parceirosAtivos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {TIPO_PARCEIRO_LABEL[p.tipo]}
                        </option>
                      ))}
                    </select>
                  </TabsContent>
                  <TabsContent value="profissional" className="mt-3">
                    <select
                      value={movForm.profissionalId}
                      onChange={(e) => setMovForm({ ...movForm, profissionalId: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Selecione um profissional autônomo...</option>
                      {profissionais.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {p.especialidade}
                        </option>
                      ))}
                    </select>
                    {profissionais.length === 0 && (
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        Nenhum profissional autônomo disponível ainda.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div>
              <Label>Observação (opcional)</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={movForm.observacao}
                onChange={(e) => setMovForm({ ...movForm, observacao: e.target.value })}
                placeholder={openMov?.tipo === "entrada" ? "Ex: compra fornecedor X" : "Ex: consumo do lote, amostra, retorno..."}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenMov(null)}>
              Cancelar
            </Button>
            <Button variant="hero" onClick={aplicarMovimento}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Histórico */}
      <Dialog open={!!openHist} onOpenChange={(v) => !v && setOpenHist(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Histórico — {histMaterial?.nome}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {histMaterial && movsDe(histMaterial.id).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Sem movimentações ainda.</p>
            )}
            {histMaterial &&
              movsDe(histMaterial.id).map((mv) => (
                <div key={mv.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    {mv.tipo === "entrada" && <ArrowDown className="mt-0.5 h-4 w-4 text-success" />}
                    {mv.tipo === "saida" && <ArrowUp className="mt-0.5 h-4 w-4 text-destructive" />}
                    {mv.tipo === "reserva" && <Bookmark className="mt-0.5 h-4 w-4 text-accent" />}
                    {mv.tipo === "liberar_reserva" && <BookmarkX className="mt-0.5 h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-semibold">
                        {tipoLabel[mv.tipo]} de {mv.quantidade} {histMaterial.unidade}
                      </p>
                      {mv.observacao && <p className="text-xs text-muted-foreground">{mv.observacao}</p>}
                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                        {mv.loteId && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                            <ClipboardList className="mr-1 inline h-3 w-3" />
                            {nomeLote(mv.loteId)}
                          </span>
                        )}
                        {mv.parceiroId && (
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-accent">
                            <Factory className="mr-1 inline h-3 w-3" />
                            {nomeParceiro(mv.parceiroId)}
                          </span>
                        )}
                        {mv.profissionalId && (
                          <span className="rounded bg-primary/5 px-2 py-0.5 text-primary">
                            <UserRound className="mr-1 inline h-3 w-3" />
                            {nomeProfissional(mv.profissionalId)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(mv.data).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Materiais;