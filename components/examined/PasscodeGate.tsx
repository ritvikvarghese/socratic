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

  if (authenticated === null) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src="/socratic-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <h1 className="font-serif text-5xl font-light tracking-[0.05em] text-white mb-2">
          Socratic
        </h1>
        <p className="text-white/70 text-sm italic mb-8">
          The unexamined life is not worth living
        </p>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Passcode"
            autoFocus
            className="flex-1 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-[16px] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
          />
          <Button
            onClick={handleSubmit}
            disabled={!passcode.trim() || loading}
            size="icon"
            className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 shrink-0 disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2} />
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-300 mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
