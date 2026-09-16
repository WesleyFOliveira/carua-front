import api from "./api";

// GET /marketplace/profissionais — ajuste o caminho quando o backend definir a rota real.
//
// Formato esperado de cada item:
// {
//   id: string,
//   nome: string,
//   especialidade: string,
//   cidade: string,
//   avaliacao: number,
//   foto: string,
// }
export const getProfissionais = async () => {
  const response = await api.get("/marketplace/profissionais");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de profissionais.");
  }

  return response.data;
};

// GET /profissionais/me — ajuste o caminho quando o backend definir a rota real.
//
// Perfil do profissional autônomo logado (marketplace). Formato esperado:
// {
//   id: string,
//   nome: string,
//   especialidade: string,
//   cidade: string,
//   avaliacao: number,
//   foto: string,
//   disponibilidade: "imediata" | "1_semana" | "2_semanas" | "agendar",
//   capacidadePecasMes: number,
// }
export const getMeuPerfil = async () => {
  const response = await api.get("/profissionais/me");

  if (!response.data || typeof response.data !== "object") {
    throw new Error("Resposta inesperada da API de perfil do profissional.");
  }

  return response.data;
};

// GET /profissionais/me/conexoes — ajuste o caminho quando o backend definir a rota real.
//
// Pedidos de conexão (negociações/contratos) vinculados ao profissional logado.
// Formato esperado de cada item:
// {
//   id: string,
//   profissionalId: string,
//   faccaoNome: string,
//   servico: string,
//   quantidade: number,
//   prazo: string,
//   status: "negociando" | "aceito" | "concluido" | "recusado",
// }
export const getMinhasConexoes = async () => {
  const response = await api.get("/profissionais/me/conexoes");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de conexões do profissional.");
  }

  return response.data;
};

// PATCH /profissionais/me — ajuste o caminho quando o backend definir a rota real.
//
// Atualiza a disponibilidade exibida no perfil público do profissional.
export const atualizarDisponibilidade = async (disponibilidade) => {
  const response = await api.patch("/profissionais/me", { disponibilidade });

  return response.data;
};

// GET /profissionais/me/portfolio — ajuste o caminho quando o backend definir a rota real.
//
// Itens de portfólio (trabalhos exibidos no perfil público) do profissional logado.
// Formato esperado de cada item:
// {
//   id: string,
//   profissionalId: string,
//   titulo: string,
//   imagem: string,
// }
export const getMeuPortfolio = async () => {
  const response = await api.get("/profissionais/me/portfolio");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de portfólio do profissional.");
  }

  return response.data;
};