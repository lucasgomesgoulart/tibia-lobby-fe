'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import LobbySidebar from "@/components/LobbySidebar";
import CharacterSidebar from "@/components/CharacterSidebar";
import API_BASE_URL from '@/apiConfig';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState('');

  useEffect(() => {
    async function getInfo() {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`);
        setLoading(true)
        if (!response.ok) throw new Error('Falha ao buscar os dados do usuário');
        const userData = await response.json();
        setUser(userData);
      } catch (err:any){
        console.error('Erro ao buscar os dados do usuário:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getInfo();
  }, []);

  return (


    <SidebarProvider>
      <Header/> {/* O Header fica fixo no topo da página */}
      <div
        className="relative flex flex-1 pt-20 h-screen"
        style={{ backgroundColor: "#4a6283" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/images/background-artwork.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100%",
          }}
        ></div>

        {/* Barra Lateral */}
        <div className="w-1/4 bg-opacity-50 backdrop-blur-md border-r border-gray-700 p-4 relative z-10 flex flex-col h-full">
          <div className="h-2/5 mt-2 border-b-2 border-t-2 border-gray-900">
            <LobbySidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <CharacterSidebar />
          </div>
        </div>

        {/* Área de Conteúdo Principal */}
        <div className="w-11/12 p-4 relative z-10 h-full overflow-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>

  );
}
