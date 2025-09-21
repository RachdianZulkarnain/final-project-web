import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/ste-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background text-foreground">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          className="bg-card/50 backdrop-blur-sm border-r border-border shadow-md"
        />

        <SidebarInset className="flex flex-col min-h-screen">
          <SiteHeader />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30">
            <div className="rounded-xl border border-border bg-card shadow-md p-4 sm:p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
