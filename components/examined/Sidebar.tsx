"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DebateSession {
  id: string;
  title: string;
  subtitle?: string;
  date: Date;
}

interface SidebarProps {
  sessions: DebateSession[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewDebate: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewDebate,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-72 md:w-64 h-full 
          border-r border-warm-border bg-sidebar 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:transform-none
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-serif text-lg font-light tracking-[0.05em]">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-foreground/70 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* New Debate button - dark charcoal pill */}
        <div className="p-4 pt-2 md:pt-4">
          <Button
            onClick={() => {
              onNewDebate();
              onClose?.();
            }}
            className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-normal h-10"
          >
            <Plus className="h-4 w-4" />
            New Debate
          </Button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose?.();
                }}
                className={`
                  w-full text-left px-3 py-3 rounded-xl transition-all
                  ${activeSessionId === session.id
                    ? "bg-sand border-l-2 border-l-warm-brown"
                    : "hover:bg-muted/50"
                  }
                `}
              >
                {/* Title - Cormorant Garamond medium */}
                <span className="block font-serif font-medium text-[15px] text-foreground truncate leading-relaxed">
                  {session.title}
                </span>
                {/* Subtitle - first line preview */}
                {session.subtitle && (
                  <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                    {session.subtitle}
                  </span>
                )}
                {/* Date */}
                <span className="block text-xs text-muted-foreground/70 mt-1">
                  {formatDate(session.date)}
                </span>
              </button>
            ))}
          </div>

          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 px-4 leading-relaxed">
              No debates yet. Start your first examination.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
