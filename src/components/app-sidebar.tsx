"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Gamepad2,
  Sword,
  Server,
  Settings,
  LogOut,
  ChevronDown,
  
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  email: string;
  full_name?: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      title: "Lobbies",
      icon: Gamepad2,
      items: [
        { title: "Criar Lobby", url: "/lobbies/create" },
        { title: "Minhas Lobbies", url: "/lobbies/mine" },
      ],
    },
    {
      title: "Personagens",
      icon: Sword,
      items: [
        { title: "Cadastrar Personagem", url: "/characters/create" },
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
      items: [{ title: "Perfil", url: "/settings/profile" }],
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((menu) => (
            <SidebarMenuItem key={menu.title}>
              <button
                onClick={() => handleToggle(menu.title)}
                className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <menu.icon className="size-5" />
                  <span>{menu.title}</span>
                </div>
                {menu.items.length > 0 && (
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      expandedMenu === menu.title ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              <div
                className={`pl-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedMenu === menu.title ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {menu.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={subItem.url}
                        className="block py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
                      >
                        {subItem.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {userData && (
          <NavUser
            user={{
              name: userData.full_name || "Usuário",
              email: userData.email,
              avatar: "/avatars/default.",
            }}
          />
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
