import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-cover bg-center p-6 md:p-10"
      style={{ backgroundImage: "url('/images/back-login.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
