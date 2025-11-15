import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-screen bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />

                <div className="flex flex-col flex-1 min-w-0">
                    <Separator />

                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <SidebarTrigger />
                            {children}
                        </div>
                    </ScrollArea>
                </div>
            </SidebarProvider>
        </div>
    );
}