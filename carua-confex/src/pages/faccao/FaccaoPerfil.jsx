import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { useToast } from "../../hooks/use-toast";
import { getMeuPerfilFaccao, updateMeuPerfilFaccao } from "../../services/faccaoperfilservice";

const BIO_PADRAO =
  "Facção de pequeno porte especializada em costura de malha e tecido plano. Prazo curto e capricho garantido.";

const FaccaoPerfil = () => {
  const { toast } = useToast();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [bio, setBio] = useState(BIO_PADRAO);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);

    getMeuPerfilFaccao()
      .then((data) => {
        if (!ativo) return;

        setPerfil(data);
        setNome(data?.nome ?? "");
        setResponsavel(data?.responsavel ?? "");
        setCidade(data?.cidade ?? "");
        setContato(data?.contato ?? "");
        setCapacidade(String(data?.capacidadeMes ?? ""));
        setBio(data?.bio ?? BIO_PADRAO);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar seu perfil. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const salvar = async () => {
    setSalvando(true);

    try {
      await updateMeuPerfilFaccao({
        nome,
        responsavel,
        cidade,
        contato,
        capacidadeMes: Number(capacidade) || 0,
        bio,
      });
      toast({ title: "Perfil atualizado", variant: "success" });
    } catch {
      toast({ title: "Não foi possível salvar o perfil.", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <PageHeader title="Meu perfil" description="Dados da facção que aparecem para as confecções parceiras." />
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <PageHeader title="Meu perfil" description="Dados da facção que aparecem para as confecções parceiras." />
        <p className="py-10 text-center text-sm text-destructive">{erro}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Meu perfil" description="Dados da facção que aparecem para as confecções parceiras." />

      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-bold">Dados da facção</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da facção" value={nome} onChange={setNome} />
          <Field label="Responsável" value={responsavel} onChange={setResponsavel} />
          <Field label="Cidade" value={cidade} onChange={setCidade} />
          <Field label="WhatsApp" value={contato} onChange={setContato} />
          <Field label="Capacidade (peças/mês)" value={capacidade} onChange={setCapacidade} />
        </div>
        <div className="mt-4 space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Apresentação</Label>
          <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 font-display text-base font-bold">Reputação</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Avaliação" value={perfil?.avaliacao != null ? perfil.avaliacao.toFixed(1) : "—"} />
          <Stat
            label="Parceira desde"
            value={perfil?.desde ? new Date(perfil.desde).toLocaleDateString("pt-BR") : "—"}
          />
          <Stat label="Lotes ativos" value={String(perfil?.lotesEmAndamento ?? 0)} />
        </div>
      </Card>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-11" />
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-surface/50 p-3">
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 font-display text-xl font-bold">{value}</p>
  </div>
);

export default FaccaoPerfil;