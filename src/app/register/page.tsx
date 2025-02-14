"use client";

import LayoutNoSidebar from "@/components/LayoutNoSidebar";
import SignupForm from "../../components/SignupForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-900">
      <LayoutNoSidebar>
        <SignupForm />
      </LayoutNoSidebar>
    </div>
  );
}
