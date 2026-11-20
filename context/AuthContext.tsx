"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "AI Researcher" | "Workspace Admin";
  tier: string;
  avatarUrl: string;
  tokensConsumed: number;
  monthlyBudget: number;
  documentsCount: number;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: "AI Researcher" | "Workspace Admin") => void;
  logout: () => void;
  switchRole: () => void;
}

const DEMO_RESEARCHER: UserSession = {
  id: "usr_doc_101",
  name: "Dr. Sarah Lin",
  email: "sarah.lin@documind.ai",
  role: "AI Researcher",
  tier: "Enterprise AI Pro",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  tokensConsumed: 16500,
  monthlyBudget: 100000,
  documentsCount: 14,
};

const DEMO_ADMIN: UserSession = {
  id: "usr_doc_002",
  name: "Marcus Stone",
  email: "marcus.admin@documind.ai",
  role: "Workspace Admin",
  tier: "System Administrator",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  tokensConsumed: 42000,
  monthlyBudget: 500000,
  documentsCount: 88,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("documind_auth_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(DEMO_RESEARCHER);
      }
    } else {
      setUser(DEMO_RESEARCHER);
    }
  }, []);

  const login = (email: string, name?: string, role: "AI Researcher" | "Workspace Admin" = "AI Researcher") => {
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      role,
      tier: role === "Workspace Admin" ? "System Administrator" : "AI Researcher Standard",
      avatarUrl: DEMO_RESEARCHER.avatarUrl,
      tokensConsumed: 1200,
      monthlyBudget: 50000,
      documentsCount: 2,
    };
    setUser(newUser);
    localStorage.setItem("documind_auth_session", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("documind_auth_session");
  };

  const switchRole = () => {
    setUser((prev) => {
      const next = prev?.role === "Workspace Admin" ? DEMO_RESEARCHER : DEMO_ADMIN;
      localStorage.setItem("documind_auth_session", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
