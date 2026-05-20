"use client";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Plus, Square, ChevronDown } from "lucide-react";
import { Conversation } from "@/lib/types";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Welcome from "./Welcome";

interface Props {
  conv: Conversation;
  sidebarOpen: boolean;
  onUpdate: (c: Conversation) => void;
  onToggleSidebar: () => void;
  onNew: () => void;
}

export default function ChatArea({ conv, sidebarOpen, onUpdate, onToggleSidebar, onNew }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const { send, stop, regenerate, loading, streaming } = useChat(conv, onUpdate);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv.messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>

      {/* Top bar */}
      <div className="glass" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 5,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!sidebarOpen && (
            <button className="btn" onClick={onToggleSidebar}
              style={{ padding: 7, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <Menu size={17} />
            </button>
          )}
          <div>
            <p style={{
              fontSize: 14, fontWeight: 700, color: "var(--text)",
              fontFamily: "Syne, sans-serif", maxWidth: 320,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{conv.title}</p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              {conv.model} · {conv.messages.length} message{conv.messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AnimatePresence>
            {streaming && (
              <motion.button
                className="btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={stop}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                  borderRadius: 10, border: "1px solid rgba(244,114,182,0.4)",
                  background: "rgba(244,114,182,0.1)", color: "#f472b6", fontSize: 12, fontWeight: 500,
                }}>
                <Square size={11} /> Stop
              </motion.button>
            )}
          </AnimatePresence>
          <button className="btn" onClick={onNew}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 10, border: "1px solid var(--border)",
              background: "transparent", color: "var(--muted)", fontSize: 12,
            }}>
            <Plus size={13} /> New
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: "auto", padding: "20px 16px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
        {conv.messages.length === 0 ? (
          <Welcome onSend={send} />
        ) : (
          <>
            <AnimatePresence initial={false}>
              {conv.messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isLast={idx === conv.messages.length - 1}
                  onRegenerate={
                    msg.role === "assistant" &&
                    idx === conv.messages.length - 1 &&
                    !streaming
                      ? regenerate
                      : undefined
                  }
                />
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!autoScroll && (
          <motion.button
            className="btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => { setAutoScroll(true); endRef.current?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              position: "absolute", bottom: 90, right: 20, width: 34, height: 34,
              borderRadius: "50%", border: "1px solid var(--borderhi)",
              background: "var(--accent)", color: "white",
              boxShadow: "0 4px 20px var(--glow)",
            }}>
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <ChatInput onSend={send} loading={loading} streaming={streaming} />
    </div>
  );
}
