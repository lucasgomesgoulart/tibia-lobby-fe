"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { Advantages } from "@/components/Advantages";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-cover bg-center p-6 md:p-10"
      style={{ backgroundImage: "url('/images/Background_Artwork_12.80.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 w-full max-w-sm md:max-w-3xl flex flex-items">
        <LoginForm />
        <Advantages/>
      </div>
    </div>
  );
}