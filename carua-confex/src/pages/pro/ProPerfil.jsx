import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { X, Plus, Save } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  profissionais,
  PROFISSIONAL_LOGADO_ID,
} from "../../data/mock";

const ProPerfil = () => {
  const { toast } = useToast();

  const me = profissionais.find(
    (profissional) => profissional.id === PROFISSIONAL_LOGADO_ID
  );

  const [perfil, setPerfil] = useState({
    nome: me?.nome || "",
    especialidade: me?.especialidade || "",
    cidade: me?.cidade || "",
    bio: me?.bio || "",
    servicos: [...(me?.servicos || [])],
    precoBase: me?.precoBase || 0,
    prazoMedioDias: me?.prazoMedioDias || 0,
    capacidadePecasMes: me?.capacidadePecasMes || 0,
    experienciaAnos: me?.experienciaAnos || 0,
    maquinario: [...(me?.maquinario || [])],
    certificacoes: [...(me?.certificacoes || [])],
    formaPagamento: [...(me?.formaPagamento || [])],
    atendeRemoto: me?.atendeRemoto || false,
    disponibilidade: me?.disponibilidade || "imediata",
    telefone: me?.contato?.telefone || "",
    email: me?.contato?.email || "",
  });

  const [novo, setNovo] = useState({
    servico: "",
    maquina: "",
    cert: "",
    pag: "",
  });

  const atualizarCampo = (campo, valor) => {
    setPerfil((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const addChip = (campo, valor) => {
    if (!valor.trim()) return;

    setPerfil((atual) => ({
      ...atual,
      [campo]: [...atual[campo], valor.trim()],
    }));
  };

  const rmChip = (campo, indice) => {
    setPerfil((atual) => ({
      ...atual,
      [campo]: atual[campo].filter((_, index) => index !== indice),
    }));
  };

  const atualizarNovo = (campo, valor) => {
    setNovo((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const adicionarItem = (campo, chave) => {
    addChip(campo, novo[chave]);
    atualizarNovo(chave, "");
  };

  const salvar = () => {
    // Futuramente: integrar com o serviço de perfil/backend.
    toast({
      title: "Perfil atualizado ✨",
      description: "Suas alterações foram salvas.",
    });
  };

  const blocos = [
    {
      key: "servicos",
      title: "Serviços oferecidos",
      input: "servico",
      placeholder: "Ex: Costura overlock",
    },
    {
      key: "maquinario",
      title: "Maquinário",
      input: "maquina",
      placeholder: "Ex: Reta industrial",
    },
    {
      key: "certificacoes",
      title: "Certificações",
      input: "cert",
      placeholder: "Ex: SENAI - Costura",
    },
    {
      key: "formaPagamento",
      title: "Formas de pagamento",
      input: "pag",
      placeholder: "Ex: PIX",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu perfil"
        description="Mantenha suas informações sempre atualizadas para fechar mais pedidos."
        action={
          <Button variant="hero" onClick={salvar}>
            <Save />
            Salvar alterações
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">
              Identificação
            </h2>

            <div>
              <Label>Nome</Label>
              <Input
                value={perfil.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
              />
            </div>

            <div>
              <Label>Especialidade</Label>
              <Input
                value={perfil.especialidade}
                onChange={(e) =>
                  atualizarCampo("especialidade", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Cidade</Label>
              <Input
                value={perfil.cidade}
                onChange={(e) => atualizarCampo("cidade", e.target.value)}
              />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                rows={4}
                value={perfil.bio}
                onChange={(e) => atualizarCampo("bio", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">
              Contato e disponibilidade
            </h2>

            <div>
              <Label>Telefone</Label>
              <Input
                value={perfil.telefone}
                onChange={(e) =>
                  atualizarCampo("telefone", e.target.value)
                }
              />
            </div>

            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={perfil.email}
                onChange={(e) => atualizarCampo("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Disponibilidade atual</Label>

              <Select
                value={perfil.disponibilidade}
                onValueChange={(valor) =>
                  atualizarCampo("disponibilidade", valor)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="imediata">
                    Disponível agora
                  </SelectItem>
                  <SelectItem value="1_semana">
                    Em até 1 semana
                  </SelectItem>
                  <SelectItem value="2_semanas">
                    Em até 2 semanas
                  </SelectItem>
                  <SelectItem value="agendar">
                    Apenas agendamento
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Atende remoto</p>
                <p className="text-xs text-muted-foreground">
                  Aceita envios para outras cidades
                </p>
              </div>

              <Switch
                checked={perfil.atendeRemoto}
                onCheckedChange={(valor) =>
                  atualizarCampo("atendeRemoto", valor)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">
              Capacidade e preços
            </h2>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label>Preço base (R$/peça)</Label>
                <Input
                  type="number"
                  value={perfil.precoBase}
                  onChange={(e) =>
                    atualizarCampo("precoBase", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Prazo médio (dias)</Label>
                <Input
                  type="number"
                  value={perfil.prazoMedioDias}
                  onChange={(e) =>
                    atualizarCampo(
                      "prazoMedioDias",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <Label>Capacidade (peças/mês)</Label>
                <Input
                  type="number"
                  value={perfil.capacidadePecasMes}
                  onChange={(e) =>
                    atualizarCampo(
                      "capacidadePecasMes",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <Label>Anos de experiência</Label>
                <Input
                  type="number"
                  value={perfil.experienciaAnos}
                  onChange={(e) =>
                    atualizarCampo(
                      "experienciaAnos",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {blocos.map((bloco) => (
          <Card key={bloco.key} className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-lg font-bold">
                {bloco.title}
              </h2>

              <div className="flex flex-wrap gap-2">
                {perfil[bloco.key].map((valor, indice) => (
                  <Badge
                    key={`${valor}-${indice}`}
                    variant="outline"
                    className="gap-1.5 border-primary/20 bg-surface"
                  >
                    {valor}

                    <button
                      type="button"
                      onClick={() => rmChip(bloco.key, indice)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={bloco.placeholder}
                  value={novo[bloco.input]}
                  onChange={(e) =>
                    atualizarNovo(bloco.input, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarItem(bloco.key, bloco.input);
                    }
                  }}
                />

                <Button
                  variant="outline"
                  onClick={() =>
                    adicionarItem(bloco.key, bloco.input)
                  }
                >
                  <Plus />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProPerfil;