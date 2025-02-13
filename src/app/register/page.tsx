"use client";

import SignupForm from "@/components/SignupForm";



export default function RegisterPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-cover bg-center p-6 md:p-10"
      style={{ backgroundImage: "url('/images/Background_Artwork_12.80')" }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
