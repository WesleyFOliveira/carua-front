import api from "./api";

// GET /faccao/perfil — ajuste o caminho quando o backend definir a rota real.
// Retorna os dados do parceiro/facção autenticado (usados na sidebar, no menu do
// usuário e na tela "Meu perfil").
//
// Formato esperado:
// {
//   id: string,
//   nome: string,
//   cidade: string,
//   responsavel: string,
//   contato: string,
//   capacidadeMes: number,
//   bio?: string,
//   avaliacao: number,
//   desde: string,
//   lotesEmAndamento: number,
// }
export const getMeuPerfilFaccao = async () => {
  const response = await api.get("/faccao/perfil");

  return response.data;
};

// PUT /faccao/perfil — atualiza os dados editáveis da facção (nome, responsável,
// cidade, contato, capacidade mensal e apresentação).
export const updateMeuPerfilFaccao = async (payload) => {
  const response = await api.put("/faccao/perfil", payload);

  return response.data;
};