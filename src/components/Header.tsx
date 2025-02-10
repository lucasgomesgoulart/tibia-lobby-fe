"use client";

import React from "react";
import {
  Gamepad2,
  Sword,
  Server,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";

const menuItems = [
  {
    title: "Jogar Agora",
    icon: Gamepad2,
    items: [
      { title: "Criar Lobby", url: "/lobbies/create" },
      { title: "Procurar Lobby", url: "/" },
    ],
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
  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white shadow-md z-50">
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
          <img
            src="/avatars/default.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-gray-400"
          />
          <span className="font-semibold">Minha Conta</span>
        </div>

        <div className="flex gap-4">
          {menuItems.map((menu) => (
            <div key={menu.title} className="relative group">
              <button className="flex items-center gap-2 hover:text-blue-400">
                <menu.icon className="h-5 w-5" />
                {menu.title}
                {menu.items.length > 0 && (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                )}
              </button>
              {menu.items.length > 0 && (
                <div className="absolute left-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition duration-300">
                  {menu.items.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.url}
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      {subItem.title}
                    </a>
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
