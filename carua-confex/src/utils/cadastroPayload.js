export const buildCadastroPayload = (formData) => {
  const { tipo, usuario, perfil } = formData;

  const payload = {
    tipo,

    usuario: {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cidade: usuario.cidade,
      senha: usuario.senha,
    },

    perfil: {},
  };

  if (tipo === "confeccao") {
    payload.perfil = {
      nome: perfil.nome,
      cnpj: perfil.cnpj || null,
      tamanhoEquipe: perfil.tamanhoEquipe || null,
      bio: perfil.bio || null,
    };
  }

  if (tipo === "faccao") {
    payload.perfil = {
      nome: perfil.nome,
      cnpj: perfil.cnpj || null,
      capacidadeMensal: perfil.capacidadeMensal || null,
      bio: perfil.bio || null,
    };
  }

  if (tipo === "profissional") {
    payload.perfil = {
      especialidade: perfil.especialidade,
      experienciaAnos: perfil.experienciaAnos
        ? Number(perfil.experienciaAnos)
        : null,
      bio: perfil.bio || null,
    };
  }

  return payload;
};
