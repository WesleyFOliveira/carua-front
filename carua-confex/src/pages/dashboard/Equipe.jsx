import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Plus, Phone, Calendar, Scissors, Power, Store, ExternalLink, Star } from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { getEquipe } from "../../services/equipeservice";
import { getPedidos } from "../../services/pedidosservice";
import { useToast } from "../../hooks/use-toast";

const etapasDisponiveis = ["corte", "costura", "acabamento", "entrega"];
const etapaLabel = {
  corte: "Corte",
  costura: "Costura",
  acabamento: "Acabamento",
  entrega: "Entrega",
};

const statusContratoCfg = {
  negociando: { label: "Negociando", cls: "border-warning/30 bg-warning/10 text-warning" },
  em_andamento: { label: "Em andamento", cls: "border-primary/30 bg-primary/10 text-primary" },
  concluido: { label: "Concluído", cls: "border-success/30 bg-success/10 text-success" },
};

const Equipe = () => {
  const { toast } = useToast();

  const [lista, setLista] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Contratados via marketplace ainda não têm um serviço próprio no backend.
  // Assim que existir (ex: getContratadosMarketplace / getProfissionais),
  // é só substituir estes estados vazios pela chamada real.
  const [contratadosMarketplace] = useState([]);
  const [profissionais] = useState([]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    funcao: "",
    telefone: "",
    pagamentoPorPeca: "",
    etapas: [],
  });

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getEquipe(), getPedidos()])
      .then(([equipe, listaPedidos]) => {
        if (ativo) {
          setLista(equipe);
          setPedidos(listaPedidos);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar a equipe. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const tarefasDe = (nome) =>
    pedidos.filter((p) => p.responsavel === nome && p.etapas?.entrega !== "concluido").length;

  const toggleEtapa = (e) =>
    setForm((f) => ({
      ...f,
      etapas: f.etapas.includes(e) ? f.etapas.filter((x) => x !== e) : [...f.etapas, e],
    }));

  const criar = () => {
    if (!form.nome || !form.funcao) {
      toast({ title: "Informe nome e função", variant: "destructive" });
      return;
    }

    // TODO: enviar para o backend quando existir um POST /equipe (ex: createMembro).
    const novo = {
      id: `eq${lista.length + 1}`,
      nome: form.nome,
      funcao: form.funcao,
      telefone: form.telefone || undefined,
      pagamentoPorPeca: Number(form.pagamentoPorPeca) || 0,
      etapas: form.etapas.length ? form.etapas : ["costura"],
      ativo: true,
      desde: new Date().toISOString().slice(0, 10),
    };

    setLista([novo, ...lista]);
    setForm({ nome: "", funcao: "", telefone: "", pagamentoPorPeca: "", etapas: [] });
    setOpen(false);
    toast({ title: `${novo.nome} cadastrado(a) na equipe`, variant: "success" });
  };

  const toggleAtivo = (id) =>
    setLista((prev) => prev.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m)));

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Equipe da facção"
          description="Quem trabalha na sua produção interna. Não aparece no marketplace público."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando equipe...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Equipe da facção"
          description="Quem trabalha na sua produção interna. Não aparece no marketplace público."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Equipe da facção"
        description="Quem trabalha na sua produção interna. Não aparece no marketplace público."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant="hero" size="lg">
                <Plus /> Cadastrar membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Novo membro da equipe</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div>
                  <Label>Nome</Label>
                  <Input
                    className="mt-1.5"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Função</Label>
                  <Input
                    className="mt-1.5"
                    value={form.funcao}
                    onChange={(e) => setForm({ ...form, funcao: e.target.value })}
                    placeholder="Ex: Costureira"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Telefone</Label>
                    <Input
                      className="mt-1.5"
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      placeholder="(81) 99..."
                    />
                  </div>
                  <div>
                    <Label>R$ por peça</Label>
                    <Input
                      className="mt-1.5"
                      type="number"
                      step="0.5"
                      value={form.pagamentoPorPeca}
                      onChange={(e) => setForm({ ...form, pagamentoPorPeca: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Etapas em que atua</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {etapasDisponiveis.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => toggleEtapa(e)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          form.etapas.includes(e)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface text-foreground hover:border-primary/40"
                        }`}
                      >
                        {etapaLabel[e]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="hero" onClick={criar}>
                  Cadastrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-foreground">
        <strong className="font-display text-primary">Equipe fixa</strong> são as pessoas
        contratadas pela facção. Mais abaixo você vê os{" "}
        <strong>profissionais contratados pontualmente via marketplace</strong> — eles ajudam em
        pedidos específicos sem fazer parte do quadro fixo.
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-display text-xl">Equipe fixa da facção</h2>
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
            {lista.length} pessoas
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((m) => {
            const tarefas = tarefasDe(m.nome);
            return (
              <Card key={m.id} className={`shadow-soft ${!m.ativo ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-warm font-display text-lg font-bold text-primary-foreground">
                        {m.nome[0]}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold leading-tight">
                          {m.nome}
                        </h3>
                        <p className="text-sm text-primary">{m.funcao}</p>
                      </div>
                    </div>
                    {m.ativo ? (
                      <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted bg-muted text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.etapas.map((e) => (
                      <Badge key={e} variant="outline" className="border-accent/30 bg-accent/10 text-xs text-accent">
                        <Scissors className="mr-1 h-3 w-3" /> {etapaLabel[e]}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-surface p-2">
                      <p className="text-muted-foreground">Tarefas atuais</p>
                      <p className="font-display text-lg font-bold text-primary">{tarefas}</p>
                    </div>
                    <div className="rounded-lg bg-surface p-2">
                      <p className="text-muted-foreground">R$ por peça</p>
                      <p className="font-display text-lg font-bold text-foreground">
                        R$ {m.pagamentoPorPeca.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {m.telefone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {m.telefone}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Desde{" "}
                      {new Date(m.desde).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <Button size="sm" variant="soft" className="mt-4 w-full" onClick={() => toggleAtivo(m.id)}>
                    <Power className="h-3.5 w-3.5" /> {m.ativo ? "Desativar" : "Reativar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contratados via Marketplace — separado da equipe fixa */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="heading-display flex items-center gap-2 text-xl">
              <Store className="h-5 w-5 text-accent" /> Contratados via marketplace
            </h2>
            <p className="text-sm text-muted-foreground">
              Profissionais autônomos contratados para serviços pontuais. Não fazem parte da
              equipe fixa.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Link to="/marketplace" className="flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4" /> Buscar profissionais
            </Link>
          </Button>
        </div>

        {contratadosMarketplace.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nenhum profissional contratado no marketplace ainda.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contratadosMarketplace.map((c) => {
              const prof = profissionais.find((p) => p.id === c.profissionalId);
              if (!prof) return null;
              const statusCfg = statusContratoCfg[c.status];
              return (
                <Card key={c.id} className="border-accent/20 shadow-soft">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <img src={prof.foto} alt={prof.nome} className="h-12 w-12 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold leading-tight">
                          {prof.nome}
                        </h3>
                        <p className="text-xs text-primary">{prof.especialidade}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Star className="h-3 w-3 fill-warning text-warning" /> {prof.avaliacao} ·{" "}
                          {prof.cidade}
                        </p>
                      </div>
                      <Badge variant="outline" className={statusCfg.cls}>
                        {statusCfg.label}
                      </Badge>
                    </div>

                    <div className="mt-4 rounded-lg bg-surface p-3 text-xs">
                      <p className="font-semibold text-foreground">{c.servico}</p>
                      {c.pedidoId && (
                        <p className="mt-1 text-muted-foreground">
                          Pedido <span className="font-mono text-primary">{c.pedidoId}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-surface p-2">
                        <p className="text-muted-foreground">Valor</p>
                        <p className="font-display text-base font-bold text-primary">
                          R$ {c.valorAcordado.toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface p-2">
                        <p className="text-muted-foreground">Entrega</p>
                        <p className="font-display text-base font-bold">
                          {new Date(c.prazoEntrega).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <Button variant="soft" size="sm" className="mt-3 w-full">
                      <Link to={`/marketplace/${prof.id}`} className="flex w-full items-center justify-center gap-1.5">
                        Ver perfil <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipe;