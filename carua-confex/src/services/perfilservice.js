import api from "./api";

// GET /perfil — ajuste quando o backend definir a rota real.
// Espera-se um retorno no formato { dados: {...}, preferencias: {...} }.
export const getPerfil = async () => {
  const response = await api.get("/perfil");

  return response.data;
};

// PUT /perfil/pessoal — atualiza nome, e-mail, telefone e cidade.
export const updateDadosPessoais = async (payload) => {
  const response = await api.put("/perfil/pessoal", payload);

  return response.data;
};

// PUT /perfil/confeccao — atualiza nome da confecção, CNPJ, fundação, bio, redes e site.
export const updateDadosConfeccao = async (payload) => {
  const response = await api.put("/perfil/confeccao", payload);

  return response.data;
};

// PUT /perfil/preferencias — atualiza notificações e visibilidade no marketplace.
export const updatePreferencias = async (payload) => {
  const response = await api.put("/perfil/preferencias", payload);

  return response.data;
};

// PUT /perfil/senha — troca de senha (requer senha atual + nova senha).
export const updateSenha = async (payload) => {
  const response = await api.put("/perfil/senha", payload);

  return response.data;
};