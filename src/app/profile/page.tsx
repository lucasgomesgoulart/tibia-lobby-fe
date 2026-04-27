'use client';

import LayoutNoSidebar from "@/components/LayoutNoSidebar";
import UserProfile from "@/components/UserProfile";
import { usersApi } from "@/lib/api/users";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInfo() {
      try {
        const userData = await usersApi.me();
        setUser(userData as any);
      } catch (err: any) {
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
