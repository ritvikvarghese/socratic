"use client";

import { useState, useCallback } from "react";
import type { Message } from "@/components/examined/MessageBubble";

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const loadMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Build history from current messages (before adding user message)
      const messageHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            message: content,
            messageHistory,
          }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = (Date.now() + 1).toString();

        // Add empty assistant message to stream into
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);

            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              }

              if (parsed.title) {
                setTitle(parsed.title);
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      } catch (error) {
        console.error("Send message failed:", error);
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setTitle(null);
  }, []);

  return { messages, isLoading, title, sendMessage, loadMessages, clearMessages };
}
