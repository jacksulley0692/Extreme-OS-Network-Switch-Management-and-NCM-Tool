import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Server,
  Network
} from "lucide-react";
import { AuthUser } from "../types";

interface LoginModalProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        // Save session in sessionStorage so it clears on browser close
        sessionStorage.setItem("extreme_portal_user", JSON.stringify(data.user));
        if (data.token) {
          sessionStorage.setItem("extreme_portal_token", data.token);
        }
        onLoginSuccess(data.user);
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err: any) {
      setError("Network or server error during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 p-6 border-b border-slate-800 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Extreme Switch Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enterprise Switch Management & Audit System</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. bill.gates or netadmin"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Switch Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Fill Buttons for Ease of Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Accounts (from users.txt):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("bill.gates", "ServiceDesk2026!")}
                className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Bill Gates</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800">
                    Service Desk
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">bill.gates / ServiceDesk2026!</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("netadmin", "NetworkTeam2026!")}
                className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 flex items-center justify-between">
                  <span>IT Network Team</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    Network Admin
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">netadmin / NetworkTeam2026!</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center pt-1">
              Sessions terminate automatically when you close your browser tab.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
