"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Entrar</h2>
        
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="Digite seu e-mail" required />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Digite sua senha" required />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm">
          <span>Não tem uma conta? </span>
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
