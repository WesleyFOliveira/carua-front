import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Progress } from "../../components/ui/Progress";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { PackageCheck, Search, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getMeusLotes, statusLoteLabel } from "../../services/meuslotesservice";

const abas = [
  { id: "todos", label: "Todos" },
  { id: "enviado", label: "A fazer" },
  { id: "em_producao", label: "Em produção" },
  { id: "pronto", label: "Prontos" },
  { id: "atrasado", label: "Atrasados" },
];

const FaccaoLotes = () => {
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState("todos");

  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    getMeusLotes()
      .then((data) => {
        if (ativo) setLotes(data);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar seus lotes. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const meus = lotes.filter((l) => l.status !== "entregue");
  const filtrados = meus
    .filter((l) => (aba === "todos" ? true : l.status === aba))
    .filter(
      (l) =>
        l.produto.toLowerCase().includes(busca.toLowerCase()) ||
        l.id.toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <div className="space-y-5">
      <PageHeader title="Lotes recebidos" description="Cada lote é uma etapa de produção enviada pela confecção." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por lote ou produto..."
            className="h-11 pl-9"
          />
        </div>
      </div>

      <Tabs value={aba} onValueChange={setAba}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {abas.map((a) => (
            <TabsTrigger key={a.id} value={a.id}>
              {a.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading && (
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando lotes...</p>
      )}

      {!loading && erro && (
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      )}

      {!loading && !erro && (
        <div className="grid gap-3">
          {filtrados.length === 0 && (
            <Card className="p-8 text-center">
              <PackageCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Nenhum lote nesta categoria.</p>
            </Card>
          )}
          {filtrados.map((l) => {
            const atrasado = l.status === "atrasado";
            const pronto = l.status === "pronto";
            return (
              <Link to={`/faccao/lotes/${l.id}`} key={l.id}>
                <Card
                  className={`p-4 transition-all hover:border-primary/40 hover:shadow-soft ${
                    atrasado ? "border-destructive/40" : ""
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        atrasado
                          ? "bg-destructive/10 text-destructive"
                          : pronto
                          ? "bg-accent/15 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {atrasado ? (
                        <AlertTriangle className="h-6 w-6" />
                      ) : pronto ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <PackageCheck className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-base font-bold">{l.produto}</p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {l.etapa}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Lote {l.id} · {l.quantidade} peças · R$ {l.valorPeca.toFixed(2)}/peça
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        De <span className="font-semibold text-primary">{l.confeccaoNome}</span> · Ordem {l.ordemId}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={l.avancoPct} className="h-1.5 flex-1" />
                        <span className="text-[11px] font-medium text-muted-foreground">{l.avancoPct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
                      <Badge variant={atrasado ? "destructive" : pronto ? "default" : "secondary"}>
                        {statusLoteLabel[l.status]}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Prazo {new Date(l.prazo).toLocaleDateString("pt-BR")}
                      </p>
                      <ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:inline" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FaccaoLotes;