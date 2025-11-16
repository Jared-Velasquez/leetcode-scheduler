import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { NavLink } from "react-router-dom";

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="px-3 py-4">
                <div className="flex items-center gap-2 group-data-[state=collapsed]:justify-center">
                    <div
                        className="
                            flex h-8 w-8 shrink-0 items-center justify-left
                            rounded-lg text-primary
                        "
                    >
                        <CalendarMonthIcon />
                    </div>

                    <div className="flex flex-col leading-tight group-data-[state=collapsed]:hidden">
                        <span className="text-sm font-semibold">Leetcode</span>
                        <span className="text-sm font-semibold">Scheduler</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink
                                    to="/"
                                >
                                    <HomeIcon />
                                    <span>Dashboard</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink
                                    to="/patterns"
                                >
                                    <MenuBookIcon />
                                    <span>Patterns</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink
                                    to="/problems"
                                >
                                    <BorderColorIcon />
                                    <span>Problems</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <NavLink
                                to="/settings"
                            >
                                <SettingsIcon />
                                <span>Settings</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}