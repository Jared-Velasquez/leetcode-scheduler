import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";

import { HomePage } from "@/pages/HomePage";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { ProblemPage } from "@/pages/ProblemPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PatternsPage } from "@/pages/PatternsPage";
import { Route, Routes } from "react-router-dom";

export function AppShell() {
    return (
        <div className="flex h-screen w-screen bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />

                <div className="flex flex-col flex-1 min-w-0">
                    <Separator />

                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <SidebarTrigger />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/problems" element={<ProblemsPage />} />
                                <Route path="/problems/:id" element={<ProblemPage />} />
                                <Route path="/patterns" element={<PatternsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                            </Routes>
                        </div>
                    </ScrollArea>
                </div>
            </SidebarProvider>
        </div>
    );
}