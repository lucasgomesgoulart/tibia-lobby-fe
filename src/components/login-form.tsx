"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input2";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import API_BASE_URL from "@/apiConfig";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  interface FormData {
    username: string;
    password: string;
  }

  const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Dados enviados:", formData);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Logged in successfully", data);
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (error) {
      setError("Usuário ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-1/2", className)} {...props}>
      <Card className="w-96 md:w-80 h-auto p-6 bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-xl rounded-lg">
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Bem-vindo de volta</h1>
            <p className="text-muted-foreground text-sm">
              Faça login para acessar sua conta no Tibia Lobby
            </p>
          </div>
          <form className="grid gap-4" onSubmit={login}>
            <div className="grid gap-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Insira seu usuário"
                required
                onChange={handleLogin}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Insira sua senha"
                required
                onChange={handleLogin}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Não possui conta?{" "}
              <a href={`/register`} className="underline underline-offset-4 hover:text-primary">
                Registre-se aqui
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
