import { useMemo, useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/Dialog";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import {
  Check,
  X,
  MessageSquare,
  MapPin,
  Calendar,
  Package,
  Building2,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  pedidosConexao as seedPedidos,
  PROFISSIONAL_LOGADO_ID,
} from "../../data/mock";

const statusLabel = {
  pendente: "Aguardando resposta",
  negociando: "Em negociação",
  aceito: "Aceito",
  recusado: "Recusado",
  concluido: "Concluído",
};

const statusCor = {
  pendente: "bg-accent/15 text-accent",
  negociando: "bg-warning/15 text-warning",
  aceito: "bg-success/15 text-success",
  recusado: "bg-destructive/10 text-destructive",
  concluido: "bg-muted text-muted-foreground",
};

const ProPedidos = () => {
  const { toast } = useToast();

  const [pedidos, setPedidos] = useState(
    seedPedidos.filter(
      (pedido) =>
        pedido.profissionalId === PROFISSIONAL_LOGADO_ID
    )
  );

  const [contraOpen, setContraOpen] = useState(null);
  const [contraValor, setContraValor] = useState("");
  const [contraPrazo, setContraPrazo] = useState("");
  const [contraObs, setContraObs] = useState("");

  const grupos = useMemo(
    () => ({
      novos: pedidos.filter(
        (pedido) =>
          pedido.status === "pendente" ||
          pedido.status === "negociando"
      ),
      andamento: pedidos.filter(
        (pedido) => pedido.status === "aceito"
      ),
      historico: pedidos.filter(
        (pedido) =>
          pedido.status === "concluido" ||
          pedido.status === "recusado"
      ),
    }),
    [pedidos]
  );

  const atualizar = (id, patch) => {
    setPedidos((atual) =>
      atual.map((pedido) =>
        pedido.id === id
          ? { ...pedido, ...patch }
          : pedido
      )
    );

    // Futuramente:
    // Integrar com o serviço de pedidos de conexão.
  };

  const aceitar = (pedido) => {
    atualizar(pedido.id, {
      status: "aceito",
    });

    toast({
      title: "Pedido aceito 🎉",
      description: `${pedido.faccaoNome} foi avisado.`,
    });
  };

  const recusar = (pedido) => {
    atualizar(pedido.id, {
      status: "recusado",
    });

    toast({
      title: "Pedido recusado",
      description: `${pedido.faccaoNome} foi avisado.`,
    });
  };

  const abrirContraproposta = (pedido) => {
    setContraOpen(pedido);
    setContraValor(String(pedido.valorProposto));
    setContraPrazo(pedido.prazo);
    setContraObs("");
  };

  const fecharContraproposta = () => {
    setContraOpen(null);
    setContraValor("");
    setContraPrazo("");
    setContraObs("");
  };

  const enviarContra = () => {
    if (!contraOpen) return;

    const valor = Number(contraValor);

    if (!valor || !contraPrazo) {
      toast({
        title: "Preencha os campos",
        variant: "destructive",
      });
      return;
    }

    atualizar(contraOpen.id, {
      status: "negociando",
      contraproposta: {
        valor,
        prazo: contraPrazo,
        ...(contraObs
          ? { observacao: contraObs }
          : {}),
      },
    });

    toast({
      title: "Contraproposta enviada",
      description: `${contraOpen.faccaoNome} vai receber sua resposta.`,
    });

    fecharContraproposta();
  };

  const renderCard = (pedido) => (
    <Card key={pedido.id} className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />

              <h3 className="font-display text-lg font-bold">
                {pedido.faccaoNome}
              </h3>
            </div>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {pedido.faccaoCidade} ·{" "}
              {pedido.faccaoResponsavel}
            </p>
          </div>

          <Badge
            className={`${statusCor[pedido.status]} hover:${statusCor[pedido.status]}`}
          >
            {statusLabel[pedido.status]}
          </Badge>
        </div>

        <p className="mt-3 text-sm font-medium">
          {pedido.servico}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-surface/60 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">
              Quantidade
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
              <Package className="h-3.5 w-3.5" />
              {pedido.quantidade}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Prazo
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
              <Calendar className="h-3.5 w-3.5" />
              {pedido.prazo}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Valor
            </p>

            <p className="mt-0.5 text-sm font-bold text-primary">
              R${" "}
              {pedido.valorProposto.toLocaleString(
                "pt-BR"
              )}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {pedido.mensagem}
          </p>
        </div>

        {pedido.contraproposta && (
          <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
            <p className="font-semibold text-warning">
              Sua contraproposta:
            </p>

            <p className="mt-1 text-foreground">
              R${" "}
              {pedido.contraproposta.valor.toLocaleString(
                "pt-BR"
              )}{" "}
              · até {pedido.contraproposta.prazo}
            </p>

            {pedido.contraproposta.observacao && (
              <p className="mt-1 italic text-muted-foreground">
                "{pedido.contraproposta.observacao}"
              </p>
            )}
          </div>
        )}

        {(pedido.status === "pendente" ||
          pedido.status === "negociando") && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="hero"
              onClick={() => aceitar(pedido)}
            >
              <Check />
              Aceitar
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                abrirContraproposta(pedido)
              }
            >
              <MessageSquare />
              Contraproposta
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => recusar(pedido)}
              className="text-destructive hover:text-destructive"
            >
              <X />
              Recusar
            </Button>
          </div>
        )}

        <p className="mt-3 text-[11px] text-muted-foreground/70">
          Recebido em {pedido.recebidoEm}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos de conexão"
        description="Facções que querem trabalhar com você. Aceite, recuse ou negocie diretamente."
      />

      <Tabs defaultValue="novos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="novos">
            Novos · {grupos.novos.length}
          </TabsTrigger>

          <TabsTrigger value="andamento">
            Em andamento · {grupos.andamento.length}
          </TabsTrigger>

          <TabsTrigger value="historico">
            Histórico · {grupos.historico.length}
          </TabsTrigger>
        </TabsList>

        {["novos", "andamento", "historico"].map(
          (chave) => (
            <TabsContent
              key={chave}
              value={chave}
              className="space-y-4"
            >
              {grupos[chave].length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-10 text-center text-sm text-muted-foreground">
                    Nada por aqui ainda.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {grupos[chave].map(renderCard)}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>

      <Dialog
        open={!!contraOpen}
        onOpenChange={(aberto) => {
          if (!aberto) {
            fecharContraproposta();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Enviar contraproposta
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Novo valor (R$)</Label>

              <Input
                type="number"
                value={contraValor}
                onChange={(e) =>
                  setContraValor(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Novo prazo</Label>

              <Input
                type="date"
                value={contraPrazo}
                onChange={(e) =>
                  setContraPrazo(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Observação (opcional)</Label>

              <Textarea
                value={contraObs}
                onChange={(e) =>
                  setContraObs(e.target.value)
                }
                placeholder="Explique sua proposta..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={fecharContraproposta}
            >
              Cancelar
            </Button>

            <Button
              variant="hero"
              onClick={enviarContra}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProPedidos;