
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, Bell, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Sistema de Comprovantes</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
