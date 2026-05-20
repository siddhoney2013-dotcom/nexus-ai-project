"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import {
  Conversation, DEFAULT_MODEL, DEFAULT_SYSTEM,
  DEFAULT_TEMP, DEFAULT_TOKENS,
} from "@/lib/types";
import { getAll, saveConv, deleteConv } from "@/lib/storage";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import SettingsPanel from "@/components/settings/SettingsPanel";

function freshConv(): Conversation {
  return {
    id: uuidv4(),
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model: DEFAULT_MODEL,
    systemPrompt: DEFAULT_SYSTEM,
    temperature: DEFAULT_TEMP,
    maxTokens: DEFAULT_TOKENS,
  };
}

export default function Home() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getAll();
    if (saved.length > 0) {
      setConvs(saved);
      setActiveId(saved[0].id);
    } else {
      const c = freshConv();
      saveConv(c);
      setConvs([c]);
      setActiveId(c.id);
    }
    // Close sidebar on mobile by default
    if (window.innerWidth < 768) setSidebarOpen(false);
    setMounted(true);
  }, []);

  const active = convs.find((c) => c.id === activeId) || null;

  const handleNew = useCallback(() => {
    const c = freshConv();
    saveConv(c);
    setConvs((prev) => [c, ...prev]);
    setActiveId(c.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const handleUpdate = useCallback((updated: Conversation) => {
    setConvs((prev) =>
      prev
        .map((c) => (c.id === updated.id ? updated : c))
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.updatedAt - a.updatedAt;
        })
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteConv(id);
    setConvs((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        if (filtered.length > 0) setActiveId(filtered[0].id);
        else {
          const c = freshConv();
          saveConv(c);
          setActiveId(c.id);
          return [c];
        }
      }
      return filtered;
    });
  }, [activeId]);

  const handlePin = useCallback((id: string) => {
    setConvs((prev) => {
      const updated = prev
        .map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
      updated.forEach(saveConv);
      return updated;
    });
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      overflow: "hidden", background: "var(--bg)", position: "relative",
    }}>

      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: "-15%", left: "-10%", background: "radial-gradient(circle, rgba(109,40,217,0.25), transparent)", animationDelay: "0s" }} />
      <div className="orb" style={{ width: 350, height: 350, bottom: "-10%", right: "-5%", background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent)", animationDelay: "3s" }} />
      <div className="orb" style={{ width: 250, height: 250, top: "40%", right: "25%", background: "radial-gradient(circle, rgba(244,114,182,0.12), transparent)", animationDelay: "1.5s" }} />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 20 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        convs={convs}
        activeId={activeId}
        isOpen={sidebarOpen}
        onNew={handleNew}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onPin={handlePin}
        onSettings={() => setSettingsOpen(true)}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Main area — offset by sidebar width when open */}
      <div style={{
        flex: 1, minWidth: 0,
        marginLeft: sidebarOpen ? 268 : 0,
        transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)",
        position: "relative", zIndex: 10,
      }}>
        {active ? (
          <ChatArea
            conv={active}
            sidebarOpen={sidebarOpen}
            onUpdate={handleUpdate}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onNew={handleNew}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <p style={{ color: "var(--muted)" }}>Loading...</p>
          </div>
        )}
      </div>

      {/* Settings modal */}
      <AnimatePresence>
        {settingsOpen && active && (
          <SettingsPanel
            conv={active}
            onUpdate={handleUpdate}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
