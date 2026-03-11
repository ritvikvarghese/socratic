"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/examined/TopBar";
import { Sidebar, type DebateSession } from "@/components/examined/Sidebar";
import { ChatWindow } from "@/components/examined/ChatWindow";
import { useChat } from "@/hooks/use-chat";
import { useConversations } from "@/hooks/use-conversations";

export default function ConversationPage() {
  const params = useParams();
  const id = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { conversations, createConversation, refreshConversations } = useConversations();
  const { messages, isLoading, title, sendMessage, loadMessages } = useChat(id);

  useEffect(() => {
    if (title) refreshConversations();
  }, [title, refreshConversations]);

  // Load conversation messages on mount
  useEffect(() => {
    async function load() {
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
    }
    load();
  }, [id, loadMessages]);

  const sessions: DebateSession[] = conversations.map((c) => ({
    id: c.id,
    title: c.title || "New examination",
    subtitle: c.firstMessage ?? undefined,
    date: new Date(c.updatedAt),
  }));

  const handleNewDebate = async () => {
    const newId = await createConversation();
    if (newId) {
      window.location.href = `/debate/${newId}`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sessions={sessions}
          activeSessionId={id}
          onSelectSession={(sessionId) => {
            window.location.href = `/debate/${sessionId}`;
          }}
          onNewDebate={handleNewDebate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
