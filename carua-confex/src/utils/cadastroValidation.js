export const validateCadastroStep = (step, data) => {
  if (step === 1) {
    if (!data.tipo) {
      return "Selecione o tipo de conta.";
    }
  }

  if (step === 2) {
    const { nome, email, telefone, cidade } =
      data.usuario;

    if (!nome.trim()) {
      return "Informe seu nome.";
    }

    if (!email.trim() || !email.includes("@")) {
      return "Informe um e-mail válido.";
    }

    if (!telefone.trim()) {
      return "Informe seu telefone.";
    }

    if (!cidade.trim()) {
      return "Informe sua cidade.";
    }
  }

  if (step === 3) {
    const { tipo, perfil } = data;

    if (
      (tipo === "confeccao" || tipo === "faccao") &&
      !perfil.nome.trim()
    ) {
      return `Informe o nome da ${
        tipo === "confeccao"
          ? "confecção"
          : "facção"
      }.`;
    }

    if (
      tipo === "profissional" &&
      !perfil.especialidade.trim()
    ) {
      return "Informe sua especialidade.";
    }
  }

  if (step === 4) {
    const { senha, confirmarSenha } =
      data.usuario;

    if (senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }

    if (senha !== confirmarSenha) {
      return "As senhas não coincidem.";
    }
  }

  return null;
};
