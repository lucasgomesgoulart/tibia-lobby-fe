'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";

export default function LayoutNoSidebar({ children }) {
  return (
    <SidebarProvider>
      <Header />
      <div
        className="relative flex flex-1 pt-20 min-h-screen"
        style={{ backgroundColor: "#4a6283" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/images/background-artwork.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100%",
          }}
        ></div>
        <div className="w-full p-4 relative z-10 flex items-center justify-center mb-20">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
} 
