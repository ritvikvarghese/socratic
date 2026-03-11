"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-14 border-b border-warm-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden h-9 w-9 text-foreground/70 hover:text-foreground hover:bg-transparent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        
        {/* Logo - Cormorant Garamond, thin weight, letter-spacing */}
        <h1 className="font-serif text-2xl font-light tracking-[0.05em] text-foreground">
          Socratic
        </h1>
      </div>
      
      <nav>
        <Link
          href="/insights"
          className="font-serif text-lg font-light tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Insights
        </Link>
      </nav>
    </header>
  );
}
