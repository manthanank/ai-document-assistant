"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Upload,
  Sparkles,
  Database,
  Menu,
  X,
  Zap,
  Layers,
  MessageSquare,
  FolderArchive,
  BarChart2,
  Settings,
  ExternalLink,
  User,
  LogOut,
  LogIn,
  Repeat,
  Shield,
} from "lucide-react";
import { UsageQuota } from "@/lib/types";

interface NavbarProps {
  quota?: UsageQuota;
  onOpenUpload?: () => void;
}

export function Navbar({ quota, onOpenUpload }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, login, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const remainingPercent = quota
    ? Math.max(0, 100 - Math.round((quota.tokensConsumed / quota.monthlyBudget) * 100))
    : user
    ? Math.max(0, 100 - Math.round((user.tokensConsumed / user.monthlyBudget) * 100))
    : 84;

  const navLinks = [
    { label: "Overview", href: "/", icon: Layers },
    { label: "Chat Studio", href: "/chat", icon: MessageSquare },
    { label: "Vector Vault", href: "/documents", icon: FolderArchive },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                <span>DocuMind</span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Database className="h-3 w-3" />
                  <span>pgvector HNSW</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">RAG Semantic Search & Grounded Generation</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 border-l border-slate-800 pl-6">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Token quota pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Quota:</span>
            <span className="text-white font-bold">{remainingPercent}%</span>
          </div>

          {/* User Session Dropdown */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/50"
                />
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-medium text-slate-200 leading-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.role === "Workspace Admin" && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">{user.tier}</div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => login("researcher@documind.ai", "AI Researcher")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <div className="font-semibold text-sm text-white">{user.name}</div>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Role: {user.role}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      switchRole();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-cyan-300 hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch to {user.role === "Workspace Admin" ? "Researcher" : "Workspace Admin"}</span>
                  </button>

                  <Link
                    href="/documents"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-xl transition"
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Vector Docs ({user.documentsCount})</span>
                  </Link>

                  <div className="border-t border-slate-800/80 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {onOpenUpload ? (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Doc</span>
            </button>
          ) : (
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Launch Studio</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="p-2 rounded-xl bg-cyan-600 text-white shadow-sm"
              aria-label="Upload Document"
            >
              <Upload className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-mono text-slate-400"
            >
              <span>Back to Public Product Tour</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
