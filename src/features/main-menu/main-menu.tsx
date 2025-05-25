"use client";

import { Button } from "@/features/ui/button";
import {
  MenuItem,
  MenuItemContainer
} from "@/ui/menu";
import {
  Book,
  Home,
  PocketKnife,
  Sheet,
  VenetianMask
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserProfile } from "./user-profile";

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
    <div className="flex flex-column justify-between h-screen" style={{ flexDirection: 'column' }}>
      {/* Sidebar */}
      <div className="flex justify-center border-r border-border bg-background dark:bg-aithoria-dark w-24 h-full">
        {/* Left Icon Navigation */}
        <div className="w-12 flex flex-col items-center py-4 space-y-2 border-border">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <MenuItem tooltip={item.label} asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-0 rounded-xl transition-all duration-200 hover-lift group relative ${isActive
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
      </div>

      {/* Bottom User Section with Dropdown */}
      <div className="object-bottom p-4 border-t border-r border-border flex justify-center items-center">
          <MenuItemContainer>
          <MenuItem tooltip="Profile">
            <UserProfile />
          </MenuItem>
        </MenuItemContainer>
      </div>
    </div>
  );
};
