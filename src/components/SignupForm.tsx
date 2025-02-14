"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import API_BASE_URL from "@/apiConfig";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      alert("Cadastro realizado com sucesso! Complete seus dados nas configurações.");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    </motion.div>
  );
}
