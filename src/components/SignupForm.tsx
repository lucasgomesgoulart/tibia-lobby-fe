"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    country: "",
    state: "",
    city: "",
    zip_code: "",
    address: "",
    address_2: "",
  });

  const [currentTab, setCurrentTab] = useState("personal");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      alert("Cadastro realizado com sucesso!");
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
      className="w-full max-w-2xl p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-center text-2xl font-bold mb-6">Cadastro</h2>

      <Tabs defaultValue="personal" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700 p-1 rounded-md">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmação</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="space-y-4">
              <Label>Nome de Usuário</Label>
              <Input name="username" onChange={handleChange} value={formData.username} required />
              <Label>Email</Label>
              <Input name="email" type="email" onChange={handleChange} value={formData.email} required />
              <Label>Senha</Label>
              <Input name="password" type="password" onChange={handleChange} value={formData.password} required />
              <Button onClick={() => setCurrentTab("address")} className="w-full mt-4">Próximo</Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="address">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="space-y-4">
              <Label>País</Label>
              <Input name="country" onChange={handleChange} value={formData.country} />
              <Label>Estado</Label>
              <Input name="state" onChange={handleChange} value={formData.state} />
              <Label>Cidade</Label>
              <Input name="city" onChange={handleChange} value={formData.city} />
              <Button onClick={() => setCurrentTab("confirmation")} className="w-full mt-4">Próximo</Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="confirmation">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h3 className="text-lg font-semibold mb-3">Revise seus dados</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li><strong>Usuário:</strong> {formData.username}</li>
              <li><strong>Email:</strong> {formData.email}</li>
              <li><strong>País:</strong> {formData.country || "Não informado"}</li>
              <li><strong>Estado:</strong> {formData.state || "Não informado"}</li>
              <li><strong>Cidade:</strong> {formData.city || "Não informado"}</li>
            </ul>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
