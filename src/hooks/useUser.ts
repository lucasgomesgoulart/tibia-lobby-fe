import { useEffect, useState } from 'react';
import API_BASE_URL from '@/apiConfig';

export interface IUser {
  id: string;
  username: string;
  email: string;
  // Adicione outras propriedades necessárias
}

interface UseUserReturn {
  user: IUser | null;
  loading: boolean;
  error: string;
}

export default function useUser(): UseUserReturn {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function getUserInfo() {
      try {
        // Obtém o token do localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado. Faça login para acessar os dados do usuário.");
        }
        // Envia o token no header para autenticar a requisição
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados do usuário');
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error('Erro ao buscar os dados do usuário:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getUserInfo();
  }, []);

  return { user, loading, error };
}
