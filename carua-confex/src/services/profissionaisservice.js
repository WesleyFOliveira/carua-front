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