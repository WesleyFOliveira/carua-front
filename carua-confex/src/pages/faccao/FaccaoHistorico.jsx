import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { Star, Package } from "lucide-react";
import { getMeusLotes } from "../../services/meuslotesservice";

const FaccaoHistorico = () => {
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
        if (ativo) setErro("Não foi possível carregar o histórico. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const meus = lotes.filter((l) => l.status === "entregue");
  const totalPecas = meus.reduce((s, l) => s + l.quantidade, 0);
  const totalRecebido = meus.reduce((s, l) => s + l.quantidade * l.valorPeca, 0);
  const media = meus.length > 0 ? meus.reduce((s, l) => s + (l.avaliacao ?? 5), 0) / meus.length : 0;

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Histórico produtivo" description="Lotes concluídos e avaliações recebidas." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando histórico...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-5">
        <PageHeader title="Histórico produtivo" description="Lotes concluídos e avaliações recebidas." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Histórico produtivo" description="Lotes concluídos e avaliações recebidas." />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Lotes concluídos</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{meus.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Peças produzidas</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{totalPecas}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Avaliação média</p>
          <p className="mt-2 flex items-center gap-2 font-display text-3xl font-extrabold">
            {media.toFixed(1)} <Star className="h-5 w-5 fill-accent text-accent" />
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border/50 p-4">
          <h3 className="font-display text-base font-bold">Lotes finalizados</h3>
          <p className="text-xs text-muted-foreground">Total faturado: R$ {totalRecebido.toFixed(2)}</p>
        </div>
        <div className="divide-y divide-border/50">
          {meus.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhum lote concluído ainda.</p>}
          {meus.map((l) => (
            <div key={l.id} className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{l.produto}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Lote {l.id} · {l.quantidade} peças · {l.etapa}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-bold">R$ {(l.valorPeca * l.quantidade).toFixed(2)}</p>
                {l.avaliacao && (
                  <div className="mt-0.5 flex items-center justify-end gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < (l.avaliacao ?? 0) ? "fill-accent text-accent" : "text-muted"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FaccaoHistorico;