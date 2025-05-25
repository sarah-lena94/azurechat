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
  VenetianMask
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
      {/* Left Icon Navigation */}
      <div className="w-14 flex flex-col items-center py-6 space-y-3 border-r border-border">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <MenuItem tooltip={item.label} asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-xl transition-all duration-200 hover-lift group relative ${
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
        <MenuTrayToggle />
      </div>
      {/* Bottom User Section with Dropdown */}
      <div className="p-6 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 h-14 p-3 rounded-xl hover:bg-muted transition-all duration-200 hover-lift"
            >
              <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold text-foreground">dev</span>
                <span className="text-xs text-muted-foreground">dev@localhost</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 border-border"
            align="start"
            side="top"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-semibold leading-none">dev</p>
                <p className="text-xs leading-none text-muted-foreground">dev@localhost</p>
                <p className="text-xs leading-none text-muted-foreground font-medium">Admin</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Switch themes
            </DropdownMenuLabel>
            <div className="flex gap-2 p-3">
              <Button
                variant={resolvedTheme === "light" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2 text-xs px-3 py-2 rounded-lg transition-all duration-200 hover-lift"
                onClick={() => setTheme("light")}
              >
                <Sun className="w-3 h-3" />
                Light
              </Button>
              <Button
                variant={resolvedTheme === "dark" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2 text-xs px-3 py-2 rounded-lg transition-all duration-200 hover-lift"
                onClick={() => setTheme("dark")}
              >
                <Moon className="w-3 h-3" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2 text-xs px-3 py-2 rounded-lg transition-all duration-200 hover-lift"
                onClick={() => setTheme("system")}
              >
                <Monitor className="w-3 h-3" />
                System
              </Button>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg m-1 transition-all duration-200 hover-lift">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
