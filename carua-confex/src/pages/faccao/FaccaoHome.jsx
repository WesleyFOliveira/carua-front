import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { PackageCheck, Clock, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { getMeusLotes, statusLoteLabel } from "../../services/meuslotesservice";

const FaccaoHome = () => {
  const [meus, setMeus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    getMeusLotes()
      .then((data) => {
        if (ativo) setMeus(data);
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

  const ativos = meus.filter((l) => l.status === "em_producao" || l.status === "enviado");
  const prontos = meus.filter((l) => l.status === "pronto");
  const atrasados = meus.filter((l) => l.status === "atrasado");
  const concluidos = meus.filter((l) => l.status === "entregue");
  const totalPecas = ativos.reduce((s, l) => s + l.quantidade, 0);

  const kpis = [
    { label: "Lotes ativos", valor: ativos.length, icone: PackageCheck, cor: "text-primary" },
    { label: "Peças em produção", valor: totalPecas, icone: TrendingUp, cor: "text-foreground" },
    { label: "Prontos p/ envio", valor: prontos.length, icone: Clock, cor: "text-accent" },
    { label: "Atrasados", valor: atrasados.length, icone: AlertTriangle, cor: "text-destructive" },
  ];

  const proximos = [...ativos, ...prontos].sort((a, b) => a.prazo.localeCompare(b.prazo)).slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Visão geral" description="Seus lotes em produção, prazos e avisos." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando seus lotes...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-6">
        <PageHeader title="Visão geral" description="Seus lotes em produção, prazos e avisos." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Visão geral" description="Seus lotes em produção, prazos e avisos." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <k.icone className={`h-4 w-4 ${k.cor}`} />
            </div>
            <p className={`mt-2 font-display text-3xl font-extrabold ${k.cor}`}>{k.valor}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/50 p-4">
          <div>
            <h3 className="font-display text-base font-bold">Próximos prazos</h3>
            <p className="text-xs text-muted-foreground">Ordenados por data de entrega</p>
          </div>
          <Button variant="ghost" size="sm">
            <Link to="/faccao/lotes" className="flex items-center gap-1.5">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border/50">
          {proximos.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhum lote em andamento.</p>}
          {proximos.map((l) => {
            const atrasado = l.status === "atrasado";
            return (
              <Link
                to={`/faccao/lotes/${l.id}`}
                key={l.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-surface/40"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    atrasado ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}
                >
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.produto}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Lote {l.id} · {l.quantidade} peças · Etapa: {l.etapa}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={atrasado ? "destructive" : "secondary"} className="mb-1">
                    {statusLoteLabel[l.status]}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Prazo {new Date(l.prazo).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold">
              Você já concluiu {concluidos.length} lote(s) pela plataforma
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue mantendo prazos e qualidade — isso aumenta suas chances de receber novos lotes das confecções
              parceiras.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FaccaoHome;