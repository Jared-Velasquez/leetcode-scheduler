import "./App.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/navigation/AppSidebar";
import { Separator } from "./components/ui/separator";
import { ScrollArea } from "./components/ui/scroll-area";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemPage } from "./pages/ProblemPage";
import { PatternsPage } from "./pages/PatternsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useEffect, useState } from "react";
import { initDb } from "@/lib/db";

// Notable components from ShadCN:
// ResizablePanel, ResizableHandle
// ScrollArea
// Separator

// NavigationMenu
// Command

// Input
// DropdownMenu
// Popover
// Avatar
// Sheet

// Card
// Tabs
// Table
// Badge
// HoverCard
// ContextMenu

// Toolbar

function App() {
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await initDb();
                setDbReady(true);
            } catch (error) {
                console.error("Failed to initialize database:", error);
            }
        })();
    }, []);

    if (!dbReady) {
        return (
            <div>DB loading...</div>
        );
    }

    return (
        <div className="flex min-h-svh w-screen bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />

                <div className="flex flex-col flex-1 min-w-0">
                    <Separator />

                    <ScrollArea className="flex-1 min-h-0">
                        <div className="p-6">
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

export default App;
