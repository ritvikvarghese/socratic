"use client";

import { useRef, useEffect } from "react";
import { MessageBubble, type Message } from "./MessageBubble";
import { InputBar } from "./InputBar";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background dot-grid">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        {messages.length === 0 ? (
          // Empty state - centered, minimal, philosophical
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h2 className="preserve-case font-serif text-4xl md:text-5xl font-light tracking-[0.05em] text-foreground mb-4">
              Socratic
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              What do you believe?
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-message-in">
                <div className="bg-card shadow-sm shadow-warm-border/50 rounded-2xl px-5 py-4">
                  <ThinkingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <InputBar onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
