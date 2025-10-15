// no ficheiro: frontend/src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

// --- DEFINIÇÃO DE TIPOS ---
// (No futuro, se este ficheiro crescer, podemos mover todos os tipos para um ficheiro separado)

export type Partnership = {
  _id: string;
  marca: string;
  status: 'ativa' | 'planejada' | 'finalizada';
  tipo: 'monetaria' | 'permuta';
  periodo: string;
  influenciadores: {
    nome: string;
    foto?: string;
    redes: string[];
    responsavel: string;
  }[];
  responsavel: string;
  valorAgencia: number;
  iniciadaEm: string; // As datas vêm como string da API
  terminaEm: string;
  progresso: number;
};

// --- FUNÇÃO AUXILIAR ---
// (Esta função pode ser partilhada com outras chamadas de API que você já tenha)
const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// --- FUNÇÕES DA API DE PUBLICIDADE ---

export const getPartnerships = async (): Promise<Partnership[]> => {
  const response = await fetch(`${API_BASE_URL}/api/partnerships`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Falha ao buscar as parcerias do servidor.");
  return response.json();
};

// No futuro, as funções para criar, editar e apagar parcerias virão aqui.
// export const createPartnership = async (data) => { ... };