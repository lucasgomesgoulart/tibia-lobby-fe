"use client";

import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Sword,
  Server,
  Settings,
  ChevronDown,
  LogIn,
  User,
  LogOut,
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
    items: [
      { title: "Preferências", url: "/settings/preferences" },
      { title: "Notificações", url: "/settings/notifications" },
      { title: "Segurança", url: "/settings/security" },
    ],
  },
];

export default function Header() {
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openAccountMenu, setOpenAccountMenu] = useState<boolean>(false);
  const [parent] = useAutoAnimate();
  let accountTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    setUserLogged(!!localStorage.getItem("token"));
  }, []);

  const handleMouseEnterAccount = () => {
    if (accountTimeout) clearTimeout(accountTimeout);
    setOpenAccountMenu(true);
  };

  const handleMouseLeaveAccount = () => {
    accountTimeout = setTimeout(() => setOpenAccountMenu(false), 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-gray-900 text-white shadow-lg z-50">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

        {/* Login ou Minha Conta */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnterAccount}
          onMouseLeave={handleMouseLeaveAccount}
        >
          {userLogged ? (
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
              <img
                src="/avatars/default.png"
                alt="Avatar"
                className="w-9 h-9 rounded-full border border-gray-500"
              />
              <span className="font-medium">Minha Conta</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openAccountMenu ? "rotate-180" : ""}`} />
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </button>
            </Link>
          )}

          {/* Dropdown do menu de conta */}
          {openAccountMenu && userLogged && (
            <div
              className="absolute left-0 top-full mt-2 w-44 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700"
              onMouseEnter={handleMouseEnterAccount}
              onMouseLeave={handleMouseLeaveAccount}
            >
              <Link href="/profile">
                <span className="block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <User className="h-4 w-4" /> Ver Perfil
                </span>
              </Link>
              <Link href="/settings">
                <span className="block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Configurações
                </span>
              </Link>
              <span
                onClick={handleLogout}
                className="block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Sair
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex gap-6" ref={parent}>
          {menuItems.map((menu) => (
            <div
              key={menu.title}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu.title)}
              onMouseLeave={() => setOpenMenu(null)}
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
                  className="absolute left-0 mt-2 w-44 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700"
                  onMouseEnter={() => setOpenMenu(menu.title)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {menu.items.map((subItem) => (
                    <Link key={subItem.title} href={subItem.url}>
                      <span className="block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer">
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
