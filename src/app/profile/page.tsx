'use client';

import API_BASE_URL from "@/apiConfig";
import LayoutNoSidebar from "@/components/LayoutNoSidebar";
import UserProfile from "@/components/UserProfile";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInfo() {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`);
        if (!response.ok) throw new Error('Falha ao buscar os dados do usuário');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Erro ao buscar os dados do usuário:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getInfo();
  }, []);

  return (
    <LayoutNoSidebar>
      <div className="relative">
        {error ? (
          <div>Erro: {error}</div>
        ) : (
          user ? <UserProfile user={user} /> : null
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <FaSpinner className="animate-spin text-4xl" />
          </div>
        )}
      </div>
    </LayoutNoSidebar>
  );
}
