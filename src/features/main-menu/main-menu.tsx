"use client";

import { MenuTrayToggle } from "@/features/main-menu/menu-tray-toggle";
import { Avatar, AvatarFallback } from "@/features/ui/avatar";
import { Button } from "@/features/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu";
import {
  MenuItem
} from "@/ui/menu";
import {
  Book,
  Home,
  LogOut,
  Monitor,
  Moon,
  PocketKnife,
  Sheet,
  Sun,
  VenetianMask,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  { href: "/chat", icon: Home, label: "Home" },
  { href: "/persona", icon: VenetianMask, label: "Personas" },
  { href: "/extensions", icon: PocketKnife, label: "Extensions" },
  { href: "/prompt", icon: Book, label: "Prompts" },
  { href: "/reporting", icon: Sheet, label: "Reporting" },
];

export const MainMenu = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex border-r border-border bg-background dark:bg-aithoria-dark">
        {/* Left Icon Navigation */}
        <div className="w-12 flex flex-col items-center py-4 space-y-2 border-r border-border">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <MenuItem tooltip={item.label} asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-0 rounded-xl transition-all duration-200 hover-lift group relative ${
                      isActive
                        ? "text-primary bg-secondary shadow-lg"
                        : "hover:bg-muted text-foreground hover:text-primary"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    {isActive && (
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                    )}
                  </Button>
                </MenuItem>
              </Link>
            );
          })}
        </div>

        {/* Main Sidebar Content */}
        <div className="w-72 flex flex-col">
          {/* Top Navigation */}
          <div className="p-4 border-b border-border">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-primary text-primary hover:bg-primary/10 dark:border-sidebar-primary dark:text-sidebar-primary dark:hover:bg-sidebar-primary/10"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-primary dark:text-sidebar-primary mb-2">Bookmarked</h3>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground dark:text-muted-foreground mb-2">Past 7 days</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <span className="text-sm font-medium text-aithoria-orange">New chat</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <span className="text-sm text-primary dark:text-sidebar-primary">hi, who are you?</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <span className="text-sm text-foreground dark:text-muted-foreground">Previous</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom User Section with Dropdown */}
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 p-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">D</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-foreground">dev</span>
                    <span className="text-xs text-muted-foreground">dev@localhost</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 border-border" align="start" side="top">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">dev</p>
                    <p className="text-xs leading-none text-muted-foreground">dev@localhost</p>
                    <p className="text-xs leading-none text-muted-foreground">Admin</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  Switch themes
                </DropdownMenuLabel>
                <div className="flex gap-1 p-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="w-4 h-4" />
                    System
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
