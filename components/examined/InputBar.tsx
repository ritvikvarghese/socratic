"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled = false }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-warm-border bg-background/80 backdrop-blur-sm p-4 pb-6 md:pb-4">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="State a belief, claim, or question..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-2xl border border-warm-border bg-card px-4 py-3 text-[16px] leading-[1.75] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-brown/20 focus:border-warm-brown/30 transition-all disabled:opacity-50"
          />
        </div>
        {/* Send button - dark charcoal pill */}
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="icon"
          className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-colors disabled:opacity-40"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
