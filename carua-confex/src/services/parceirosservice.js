import api from "./api";

// GET /parceiros — ajuste o caminho quando o backend definir a rota real.
//
// Formato esperado de cada item:
// {
//   id: string,
//   nome: string,
//   cidade: string,
//   responsavel: string,
//   contato: string,
//   tipo: "faccao" | "estamparia" | "lavanderia" | "bordado" | "corte",
//   avaliacao: number,
//   capacidadeMes: number,
//   lotesEmAndamento: number,
// }
export const getParceiros = async () => {
  const response = await api.get("/parceiros");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de parceiros.");
  }

  return response.data;
};