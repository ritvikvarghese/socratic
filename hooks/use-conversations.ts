"use client";

import { useState, useCallback, useEffect } from "react";

export interface ConversationSummary {
  id: string;
  title: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  firstMessage: string | null;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createConversation = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/conversations", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        await fetchConversations();
        return data.id;
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
    return null;
  }, [fetchConversations]);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
        if (res.ok) {
          await fetchConversations();
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    },
    [fetchConversations]
  );

  return {
    conversations,
    loading,
    createConversation,
    deleteConversation,
    refreshConversations: fetchConversations,
  };
}
