import api from "./api";

// GET /equipe — ajuste quando o backend definir a rota real.
export const getEquipe = async () => {
  const response = await api.get("/equipe");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de equipe.");
  }

  return response.data;
};