import api from "./api";

// GET /lotes — ajuste o caminho quando o backend definir a rota real.
//
// Formato esperado de cada item:
// {
//   id: string,
//   produto: string,
//   quantidade: number,
//   status: "enviado" | "em_producao" | "pronto" | "atrasado" | "entregue",
//   etapa: string,
//   avancoPct: number,
//   prazo: string,
//   parceiro: { id: string, nome: string, cidade: string }
// }
export const getLotes = async () => {
  const response = await api.get("/lotes");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de lotes.");
  }

  return response.data;
};