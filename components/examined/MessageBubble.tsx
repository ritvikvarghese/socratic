"use client";

import ReactMarkdown from "react-markdown";
import { ThinkingIndicator } from "./ThinkingIndicator";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isLoading = message.isLoading && !isUser;

  return (
    <div
      className={`
        flex ${isUser ? "justify-end" : "justify-start"} mb-4
        ${isLatest ? "animate-message-in" : ""}
      `}
    >
      <div
        className={`
          max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl 
          text-[16px] leading-[1.75]
          ${isUser
            ? "bg-sand text-foreground"
            : "bg-card shadow-sm shadow-warm-border/50 text-foreground"
          }
        `}
      >
        {isLoading ? (
          <ThinkingIndicator />
        ) : (
          <>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-warm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3 prose-headings:font-semibold prose-strong:font-semibold prose-a:text-foreground prose-a:underline">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
            {message.timestamp && (
              <time className="block mt-2 text-xs text-muted-foreground/70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </>
        )}
      </div>
    </div>
  );
}
