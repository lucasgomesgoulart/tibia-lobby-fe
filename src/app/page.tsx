import { AppSidebar } from "@/components/app-sidebar";
import LobbyList from "@/components/LobbyList";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0 min-h-screen" style={{ backgroundColor: "#051122" }}>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('/images/background-artwork.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%"
            }}
          ></div>
          <div className="relative z-10">
            <LobbyList />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
