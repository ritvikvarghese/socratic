"use client";

import { useState, useCallback, useEffect } from "react";
import { TopBar } from "@/components/examined/TopBar";
import { Sidebar, type DebateSession } from "@/components/examined/Sidebar";
import { ChatWindow } from "@/components/examined/ChatWindow";
import { useChat } from "@/hooks/use-chat";
import { useConversations } from "@/hooks/use-conversations";

export default function DebatePage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { conversations, createConversation, refreshConversations } = useConversations();
  const { messages, isLoading, title, sendMessage, loadMessages, clearMessages } = useChat(activeSessionId);

  // When a title is generated from the first message, refresh the sidebar
  useEffect(() => {
    if (title) {
      refreshConversations();
    }
  }, [title, refreshConversations]);

  const sessions: DebateSession[] = conversations.map((c) => ({
    id: c.id,
    title: c.title || "New examination",
    subtitle: c.firstMessage ?? undefined,
    date: new Date(c.updatedAt),
  }));

  const handleNewDebate = useCallback(async () => {
    const id = await createConversation();
    if (id) {
      setActiveSessionId(id);
      clearMessages();
    }
  }, [createConversation, clearMessages]);

  const handleSelectSession = useCallback(
    async (id: string) => {
      setActiveSessionId(id);
      try {
        const res = await fetch(`/api/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          loadMessages(
            data.messages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: new Date(m.created_at),
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    },
    [loadMessages]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      // If no active session, create one first
      if (!activeSessionId) {
        const id = await createConversation();
        if (id) {
          setActiveSessionId(id);
          // Small delay to let state update, then send
          setTimeout(() => sendMessage(content), 0);
        }
        return;
      }
      sendMessage(content);
    },
    [activeSessionId, createConversation, sendMessage]
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId ?? undefined}
          onSelectSession={handleSelectSession}
          onNewDebate={handleNewDebate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
