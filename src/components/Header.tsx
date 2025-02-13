"use client";

import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Sword,
  Server,
  Settings,
  ChevronDown,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const menuItems = [
  {
    title: "Jogar Agora",
    icon: Gamepad2,
    items: [{ title: "Procurar Lobby", url: "/" }],
  },
  {
    title: "Personagens",
    icon: Sword,
    items: [
      { title: "Novo Personagem", url: "/characters/" },
      { title: "Meus Personagens", url: "/characters/mine" },
    ],
  },
  {
    title: "OTServers",
    icon: Server,
    items: [{ title: "Lista de OTServers", url: "/otservers" }],
  },
  {
    title: "Configurações",
    icon: Settings,
    items: [{ title: "Perfil", url: "/profile" }],
  },
];

export default function Header() {
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [parent] = useAutoAnimate();
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    // Simulando se o usuário está logado (troque por lógica real de autenticação)
    setUserLogged(!!localStorage.getItem("token"));
  }, []);

  const handleMouseEnter = (menuTitle: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    setOpenMenu(menuTitle);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setOpenMenu(null), 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-gray-900 text-white shadow-lg z-50">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        
        {/* Login ou Minha Conta */}
        <div>
          {userLogged ? (
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
              <img
                src="/avatars/default.png"
                alt="Avatar"
                className="w-9 h-9 rounded-full border border-gray-500"
              />
              <span className="font-medium">Minha Conta</span>
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </button>
            </Link>
          )}
        </div>

        {/* Menu */}
        <div className="flex gap-6" ref={parent}>
          {menuItems.map((menu) => (
            <div
              key={menu.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(menu.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                <menu.icon className="h-5 w-5" />
                {menu.title}
                {menu.items.length > 0 && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openMenu === menu.title ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Dropdown */}
              {menu.items.length > 0 && openMenu === menu.title && (
                <div
                  className="absolute left-0 mt-2 w-40 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700 opacity-100 transition duration-200"
                  onMouseEnter={() => handleMouseEnter(menu.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  {menu.items.map((subItem) => (
                    <Link key={subItem.title} href={subItem.url}>
                      <span className="block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer transition">
                        {subItem.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
