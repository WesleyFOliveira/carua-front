import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Separator } from "../../components/ui/Separator";
import {
  Camera, Save, MapPin, Phone, Mail, Building2, Calendar, Award,
  Users, Package, TrendingUp, Star, ShieldCheck, Bell, Globe, Lock,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  getPerfil,
  updateDadosPessoais,
  updateDadosConfeccao,
  updatePreferencias,
  updateSenha,
} from "../../services/perfilservice";
import { getEquipe } from "../../services/equipeservice";
import { getPedidos } from "../../services/pedidosservice";

const dadosPadrao = {
  nome: "",
  confeccao: "",
  email: "",
  telefone: "",
  cidade: "",
  cnpj: "",
  fundacao: "",
  bio: "",
  site: "",
  instagram: "",
};

const prefsPadrao = {
  notifEmail: true,
  notifWhatsapp: true,
  alertasEstoque: true,
  perfilPublico: true,
  receberPropostas: true,
};

const conquistas = [
  "+ 100 lotes entregues",
  "Sem atrasos em 90 dias",
  "5 anos no mercado",
  "Equipe certificada SENAI",
];

const Perfil = () => {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const abaInicial = params.get("tab") ?? "geral";

  const [aba, setAba] = useState(abaInicial);
  const [dados, setDados] = useState(dadosPadrao);
  const [prefs, setPrefs] = useState(prefsPadrao);
  const [equipe, setEquipe] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [senhaForm, setSenhaForm] = useState({ atual: "", nova: "", confirmar: "" });

  const [savingPessoal, setSavingPessoal] = useState(false);
  const [savingConfeccao, setSavingConfeccao] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    Promise.all([getPerfil(), getEquipe(), getPedidos()])
      .then(([perfil, listaEquipe, listaPedidos]) => {
        if (!ativo) return;

        setDados({ ...dadosPadrao, ...perfil?.dados });
        setPrefs({ ...prefsPadrao, ...perfil?.preferencias });
        setEquipe(listaEquipe);
        setPedidos(listaPedidos);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar o perfil. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const totalPedidos = pedidos.length;
  const concluidos = pedidos.filter((p) => p.etapas?.entrega === "concluido").length;
  const equipeAtiva = equipe.filter((m) => m.ativo).length;

  const salvarDadosPessoais = async () => {
    setSavingPessoal(true);

    try {
      await updateDadosPessoais({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        cidade: dados.cidade,
      });
      toast({ title: "Dados atualizados", variant: "success" });
    } catch {
      toast({ title: "Não foi possível salvar os dados pessoais.", variant: "destructive" });
    } finally {
      setSavingPessoal(false);
    }
  };

  const salvarConfeccao = async () => {
    setSavingConfeccao(true);

    try {
      await updateDadosConfeccao({
        confeccao: dados.confeccao,
        cnpj: dados.cnpj,
        fundacao: dados.fundacao,
        instagram: dados.instagram,
        site: dados.site,
        bio: dados.bio,
      });
      toast({ title: "Confecção atualizada", variant: "success" });
    } catch {
      toast({ title: "Não foi possível salvar os dados da confecção.", variant: "destructive" });
    } finally {
      setSavingConfeccao(false);
    }
  };

  const alterarPreferencia = async (chave, valor) => {
    const anterior = prefs;
    setPrefs((p) => ({ ...p, [chave]: valor }));

    try {
      await updatePreferencias({ ...anterior, [chave]: valor });
    } catch {
      setPrefs(anterior);
      toast({ title: "Não foi possível atualizar a preferência.", variant: "destructive" });
    }
  };

  const salvarSenha = async () => {
    if (!senhaForm.atual || !senhaForm.nova) {
      toast({ title: "Informe a senha atual e a nova senha", variant: "destructive" });
      return;
    }

    if (senhaForm.nova !== senhaForm.confirmar) {
      toast({ title: "A confirmação não confere com a nova senha", variant: "destructive" });
      return;
    }

    setSavingSenha(true);

    try {
      await updateSenha({ senhaAtual: senhaForm.atual, novaSenha: senhaForm.nova });
      setSenhaForm({ atual: "", nova: "", confirmar: "" });
      toast({ title: "Senha atualizada com sucesso", variant: "success" });
    } catch {
      toast({ title: "Não foi possível atualizar a senha.", variant: "destructive" });
    } finally {
      setSavingSenha(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meu perfil"
          description="Gerencie seus dados pessoais, da confecção e preferências da conta."
        />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meu perfil"
          description="Gerencie seus dados pessoais, da confecção e preferências da conta."
        />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu perfil"
        description="Gerencie seus dados pessoais, da confecção e preferências da conta."
      />

      {/* Banner com avatar */}
      <Card className="overflow-hidden shadow-soft">
        <div className="relative h-32 bg-gradient-warm">
          <button className="absolute right-4 top-4 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-background">
            <Camera className="mr-1 inline h-3.5 w-3.5" /> Trocar capa
          </button>
        </div>
        <CardContent className="relative p-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-warm font-display text-3xl font-bold text-primary-foreground shadow-warm ring-4 ring-background">
              {dados.nome ? dados.nome[0] : "?"}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold">{dados.nome}</h2>
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verificada
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {dados.confeccao} · {dados.cidade}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Membro desde {dados.fundacao}
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Package, label: "Pedidos no total", value: totalPedidos },
              { icon: TrendingUp, label: "Entregues", value: concluidos },
              { icon: Users, label: "Equipe ativa", value: equipeAtiva },
              { icon: Star, label: "Avaliação", value: "4.8" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-surface/40 p-3">
                <k.icon className="h-4 w-4 text-primary" />
                <p className="mt-1.5 font-display text-xl font-bold">{k.value}</p>
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={aba} onValueChange={setAba}>
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="geral">Pessoal</TabsTrigger>
          <TabsTrigger value="confeccao">Confecção</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display text-lg font-bold">Dados pessoais</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nome completo"
                  value={dados.nome}
                  onChange={(v) => setDados({ ...dados, nome: v })}
                  icon={Building2}
                />
                <Field
                  label="E-mail"
                  type="email"
                  value={dados.email}
                  onChange={(v) => setDados({ ...dados, email: v })}
                  icon={Mail}
                />
                <Field
                  label="Telefone / WhatsApp"
                  value={dados.telefone}
                  onChange={(v) => setDados({ ...dados, telefone: v })}
                  icon={Phone}
                />
                <Field
                  label="Cidade"
                  value={dados.cidade}
                  onChange={(v) => setDados({ ...dados, cidade: v })}
                  icon={MapPin}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="hero" onClick={salvarDadosPessoais} disabled={savingPessoal}>
                  <Save /> {savingPessoal ? "Salvando..." : "Salvar dados pessoais"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confeccao" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display text-lg font-bold">Sobre a confecção</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nome da confecção"
                  value={dados.confeccao}
                  onChange={(v) => setDados({ ...dados, confeccao: v })}
                />
                <Field label="CNPJ" value={dados.cnpj} onChange={(v) => setDados({ ...dados, cnpj: v })} />
                <Field
                  label="Ano de fundação"
                  value={dados.fundacao}
                  onChange={(v) => setDados({ ...dados, fundacao: v })}
                />
                <Field
                  label="Instagram"
                  value={dados.instagram}
                  onChange={(v) => setDados({ ...dados, instagram: v })}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Site (opcional)"
                    value={dados.site}
                    onChange={(v) => setDados({ ...dados, site: v })}
                    icon={Globe}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Apresentação pública
                </Label>
                <Textarea
                  rows={4}
                  className="mt-2"
                  value={dados.bio}
                  onChange={(e) => setDados({ ...dados, bio: e.target.value })}
                  placeholder="Conte para clientes o que sua confecção faz de melhor."
                />
                <p className="mt-1 text-[11px] text-muted-foreground">{dados.bio.length}/300 caracteres</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 font-display text-sm font-semibold">Conquistas</h4>
                <div className="flex flex-wrap gap-2">
                  {conquistas.map((c) => (
                    <Badge key={c} variant="outline" className="border-primary/20 bg-surface gap-1">
                      <Award className="h-3 w-3 text-primary" /> {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="hero" onClick={salvarConfeccao} disabled={savingConfeccao}>
                  <Save /> {savingConfeccao ? "Salvando..." : "Salvar confecção"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferencias" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="space-y-1 p-6">
              <h3 className="font-display text-lg font-bold">Preferências da conta</h3>
              <p className="text-sm text-muted-foreground">
                Controle como você recebe avisos e como aparece no marketplace.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    key: "notifEmail",
                    icon: Mail,
                    label: "Notificações por e-mail",
                    desc: "Receber novidades e atualizações de pedidos.",
                  },
                  {
                    key: "notifWhatsapp",
                    icon: Phone,
                    label: "Avisos por WhatsApp",
                    desc: "Mensagens rápidas sobre prazos e entregas.",
                  },
                  {
                    key: "alertasEstoque",
                    icon: Bell,
                    label: "Alertas de estoque baixo",
                    desc: "Aviso automático quando um material acabar.",
                  },
                  {
                    key: "perfilPublico",
                    icon: Globe,
                    label: "Perfil público no marketplace",
                    desc: "Outras facções podem ver e contratar você.",
                  },
                  {
                    key: "receberPropostas",
                    icon: Users,
                    label: "Receber propostas de profissionais",
                    desc: "Autônomos podem entrar em contato.",
                  },
                ].map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <p.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                    <Switch checked={prefs[p.key]} onCheckedChange={(v) => alterarPreferencia(p.key, v)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display text-lg font-bold">Segurança e acesso</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Senha atual"
                  type="password"
                  value={senhaForm.atual}
                  onChange={(v) => setSenhaForm({ ...senhaForm, atual: v })}
                  icon={Lock}
                />
                <div />
                <Field
                  label="Nova senha"
                  type="password"
                  value={senhaForm.nova}
                  onChange={(v) => setSenhaForm({ ...senhaForm, nova: v })}
                />
                <Field
                  label="Confirmar nova senha"
                  type="password"
                  value={senhaForm.confirmar}
                  onChange={(v) => setSenhaForm({ ...senhaForm, confirmar: v })}
                />
              </div>
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                <p className="text-sm font-medium text-foreground">Verificação em duas etapas</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Adicione uma camada extra de segurança ao seu login.
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Ativar 2FA
                </Button>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Excluir conta
                </Button>
                <Button variant="hero" onClick={salvarSenha} disabled={savingSenha}>
                  <Save /> {savingSenha ? "Salvando..." : "Atualizar senha"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Field = ({ label, value, onChange, icon: Icon, type = "text", placeholder }) => (
  <div>
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
    <div className="relative mt-1.5">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={Icon ? "pl-9" : ""}
      />
    </div>
  </div>
);

export default Perfil;