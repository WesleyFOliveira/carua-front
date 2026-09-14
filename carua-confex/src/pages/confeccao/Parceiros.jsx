import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FilterTabs } from "../../components/ui/FilterTabs";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { Building2, Search, Star, Phone, Plus } from "lucide-react";
import { getParceiros } from "../../services/parceirosservice";
import { useToast } from "../../hooks/use-toast";

const TIPO_PARCEIRO_LABEL = {
  faccao: "Facção",
  estamparia: "Estamparia",
  lavanderia: "Lavanderia",
  bordado: "Bordado",
  corte: "Corte",
};

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "faccao", label: "Facções" },
  { id: "estamparia", label: "Estamparias" },
  { id: "lavanderia", label: "Lavanderias" },
  { id: "bordado", label: "Bordados" },
  { id: "corte", label: "Corte" },
];

const Parceiros = () => {
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState("todos");
  const [parceiros, setParceiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    getParceiros()
      .then((data) => {
        if (ativo) setParceiros(data);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os parceiros. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const filtrados = parceiros
    .filter((p) => (aba === "todos" ? true : p.tipo === aba))
    .filter(
      (p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cidade.toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Parceiros produtivos"
        description="Facções, estamparias, lavanderias e serviços que executam etapas da sua produção."
        action={
          <Button onClick={() => toast({ title: "Em breve", description: "Convite de parceiro em breve." })}>
            <Plus className="mr-1 h-4 w-4" /> Convidar parceiro
          </Button>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou cidade..."
          className="h-11 pl-9"
        />
      </div>

      <FilterTabs options={FILTROS} value={aba} onChange={setAba} />

      {loading && (
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando parceiros...</p>
      )}

      {!loading && erro && (
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      )}

      {!loading && !erro && (
        <div className="grid gap-3 md:grid-cols-2">
          {filtrados.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Nenhum parceiro encontrado.
            </p>
          )}
          {filtrados.map((p) => (
            <Card key={p.id} className="p-4 transition-all hover:border-primary/40 hover:shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-bold">{p.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.cidade} · {p.responsavel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {p.avaliacao.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline">{TIPO_PARCEIRO_LABEL[p.tipo]}</Badge>
                    <Badge variant="secondary">{p.capacidadeMes} peças/mês</Badge>
                    {p.lotesEmAndamento > 0 && <Badge>{p.lotesEmAndamento} ativos</Badge>}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {p.contato}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Parceiros;