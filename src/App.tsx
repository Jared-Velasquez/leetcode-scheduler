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

function SplashScreen() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Leetcode Scheduler
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Initializing workspace...
                    </h1>
                </div>

                {/* Spinner */}
                <div className="mt-2 h-8 w-8 animate-spin rounded-full border-2 border-muted-foregrouind border-t-primary" />
            </div>
        </div>
    );
}

const TRANSITION_DURATION_MS = 500;

function App() {
    const [dbReady, setDbReady] = useState(false);
    const [showSplashScreen, setShowSplashScreen] = useState(true);

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

    useEffect(() => {
        if (!dbReady) return;
        const timeout = setTimeout(() => setShowSplashScreen(false), TRANSITION_DURATION_MS);
        return () => clearTimeout(timeout);
    }, [dbReady]);

    const mainAppClasses = `flex min-h-svh w-screen bg-background text-foreground transition-opacity duration-${TRANSITION_DURATION_MS} ${dbReady ? "opacity-100" : "opacity-0"}`;
    const splashScreenClasses = `pointer-events-auto absolute inset-0 flex bg-background transition-opacity duration-${TRANSITION_DURATION_MS} ${dbReady ? "opacity-0 pointer-events-none" : "opacity-100"}`;

    return (
        <div className="flex min-h-svh w-screen bg-background text-foreground">
            <div className={mainAppClasses}>
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

            {/* Splash Screen */}
            {showSplashScreen && (
                <div className={splashScreenClasses} style={{ pointerEvents: dbReady ? "none" : "auto" }}>
                    <SplashScreen />
                </div>
            )}
        </div>
    );
}

export default App;
