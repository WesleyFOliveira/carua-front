import api from "./api";

// GET /materiais — ajuste quando o backend definir a rota real.
export const getMateriais = async () => {
  const response = await api.get("/materiais");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de materiais.");
  }

  return response.data;
};