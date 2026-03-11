"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("examined_auth");
    setAuthenticated(stored === "true");
  }, []);

  const handleSubmit = async () => {
    if (!passcode.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("examined_auth", "true");
        setAuthenticated(true);
      } else {
        setError("Incorrect passcode");
        setPasscode("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Still checking sessionStorage
  if (authenticated === null) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background dot-grid">
      <h1 className="font-serif text-5xl font-light tracking-[0.05em] text-foreground mb-2">
        Socratic
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Enter passcode to continue
      </p>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Passcode"
          autoFocus
          className="flex-1 rounded-2xl border border-warm-border bg-card px-4 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-brown/20 focus:border-warm-brown/30 transition-all"
        />
        <Button
          onClick={handleSubmit}
          disabled={!passcode.trim() || loading}
          size="icon"
          className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 disabled:opacity-40"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive mt-4">{error}</p>
      )}
    </div>
  );
}
