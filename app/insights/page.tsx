"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InsightCard } from "@/components/examined/InsightCard";

interface Insight {
  type: "belief_challenged" | "recurring_topic" | "position_shift";
  label: string;
  count: number;
  lastSeen: string;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insights");
        if (res.ok) {
          const data = await res.json();
          setInsights(data);
        } else {
          setError("Failed to load insights");
        }
      } catch {
        setError("Failed to load insights");
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-background dot-grid">
      {/* Header */}
      <header className="h-14 border-b border-warm-border bg-background/80 backdrop-blur-sm flex items-center px-4 md:px-6 sticky top-0 z-10">
        <Link
          href="/debate"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to debates
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <h1 className="font-serif text-4xl font-light tracking-[0.05em] text-foreground mb-2">
          Insights
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          patterns across your Socratic examinations
        </p>

        {loading && (
          <p className="text-muted-foreground text-sm italic font-serif">
            Analyzing your debates...
          </p>
        )}

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {!loading && !error && insights.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg font-light">
              No insights yet
            </p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              Complete a few debates to see patterns emerge
            </p>
          </div>
        )}

        {insights.length > 0 && (
          <div className="grid gap-4">
            {insights.map((insight, i) => (
              <InsightCard
                key={i}
                type={insight.type}
                label={insight.label}
                count={insight.count}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
