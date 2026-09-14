import api from "./api";

// GET /pedidos — ajuste quando o backend definir a rota real.
export const getPedidos = async () => {
  const response = await api.get("/pedidos");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de pedidos.");
  }

  return response.data;
};