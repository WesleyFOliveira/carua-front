import api from "./api";

export const statusLoteLabel = {
  enviado: "Enviado",
  em_producao: "Em produção",
  pronto: "Pronto",
  atrasado: "Atrasado",
  entregue: "Entregue",
};

// GET /faccao/lotes — ajuste o caminho quando o backend definir a rota real.
// Espera-se que o backend já retorne apenas os lotes do parceiro/facção autenticado
// (via token), com todos os status — o front filtra por status conforme a tela.
//
// Formato esperado de cada item:
// {
//   id: string,
//   produto: string,
//   quantidade: number,
//   valorPeca: number,
//   etapa: string,
//   prazo: string,
//   status: "enviado" | "em_producao" | "pronto" | "atrasado" | "entregue",
//   avancoPct: number,
//   ordemId: string,
//   confeccaoNome: string,
//   avaliacao?: number,
// }
export const getMeusLotes = async () => {
  const response = await api.get("/faccao/lotes");

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta inesperada da API de lotes do parceiro.");
  }

  return response.data;
};

// GET /faccao/lotes/:id — detalhe completo de um lote do parceiro logado.
//
// Formato esperado, além dos campos da listagem acima:
// {
//   ordemId: string,
//   confeccaoNome: string,
//   observacoes?: string,
//   enviadoEm: string,
//   avancoPct: number,
//   historico: { data: string, texto: string, autor?: string }[],
//   subcontratados: { profissionalId: string, papel: string, pecas: number, status: "convidado" | "confirmado" | "concluido" }[],
// }
export const getMeuLote = async (id) => {
  const response = await api.get(`/faccao/lotes/${id}`);

  return response.data;
};

// PUT /faccao/lotes/:id/avanco — registra o novo percentual de avanço e uma nota opcional.
export const atualizarAvancoLote = async (id, payload) => {
  const response = await api.put(`/faccao/lotes/${id}/avanco`, payload);

  return response.data;
};

// PUT /faccao/lotes/:id/pronto — marca o lote como pronto para envio.
export const marcarLoteComoPronto = async (id) => {
  const response = await api.put(`/faccao/lotes/${id}/pronto`);

  return response.data;
};

// PUT /faccao/lotes/:id/entrega — confirma a entrega do lote à confecção coordenadora.
export const confirmarEntregaLote = async (id) => {
  const response = await api.put(`/faccao/lotes/${id}/entrega`);

  return response.data;
};

// POST /faccao/lotes/:id/convites — convida um profissional do marketplace para ajudar no lote.
export const convidarProfissionalParaLote = async (id, payload) => {
  const response = await api.post(`/faccao/lotes/${id}/convites`, payload);

  return response.data;
};