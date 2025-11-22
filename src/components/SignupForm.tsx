"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import API_BASE_URL from "@/apiConfig";
import { usersApi } from '@/lib/api/users';
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from 'react-toastify';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const userPayload = {
      ...formData,
      country: "", 
      state: "",
      city: "",
      zip_code: "",
      address: "",
      address_2: "",
      birth_date: null,
      role: "user", 
      status: "active",
    };

    try {
      await usersApi.create(userPayload);
      toast.success('Conta criada com sucesso!');
      // Exibe modal de sucesso com timer e redireciona para a lista de lobbys
      setShowSuccess(true);
      setCountdown(3);
    } catch (error: any) {
      const msg = error?.message || 'Erro ao cadastrar.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showSuccess) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showSuccess, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg p-6 rounded-xl shadow-lg bg-gray-900/90 text-white border border-gray-700"
    >
      <h2 className="text-center text-3xl font-extrabold text-gray-100 mb-6">Cadastro</h2>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-200">Nome de Usuário</Label>
          <Input
            name="username"
            onChange={handleChange}
            value={formData.username}
            required
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-200">Email</Label>
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-200">Senha</Label>
          <Input
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            required
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-200">Nome Completo</Label>
          <Input
            required
            name="full_name"
            onChange={handleChange}
            value={formData.full_name}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-200">Telefone (Opcional)</Label>
          <Input
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4 bg-green-600 hover:bg-green-700 transition">
          {isSubmitting ? "Cadastrando..." : "Criar Conta"}
        </Button>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4">
        Você poderá completar seus dados depois nas configurações.
      </p>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mx-4 w-full max-w-sm rounded-xl border border-emerald-600/30 bg-gray-900 p-6 text-white shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={28} />
              <h3 className="text-lg font-semibold">Conta criada com sucesso!</h3>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Você será redirecionado para os lobbys em {countdown}s.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push("/")}
              >
                Ir agora
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-gray-800 hover:bg-gray-700"
                onClick={() => setShowSuccess(false)}
              >
                Fechar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
