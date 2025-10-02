import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EterniaSidebar } from "@/components/EterniaSidebar";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-mystic">
        <EterniaSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-primary/20 bg-card/50 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <Menu className="h-5 w-5 text-foreground" />
              </SidebarTrigger>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-foreground hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}