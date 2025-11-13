import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SidebarNav } from "@/components/docs/sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarInset, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea className="h-full py-6 px-6 lg:py-8">
              <SidebarNav />
            </ScrollArea>
          </aside>
          <main className="container relative py-6 lg:py-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
