"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Settings, Pin, Trash2, Edit3, Download,
  ChevronLeft, Sparkles, Check, Search, MessageSquare,
} from "lucide-react";
import { Conversation } from "@/lib/types";
import { saveConv, exportConv } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";

interface Props {
  convs: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onSettings: () => void;
  onToggle: () => void;
}

export default function Sidebar({ convs, activeId, isOpen, onNew, onSelect, onDelete, onPin, onSettings, onToggle }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = convs.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()))
  );
  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  const commitEdit = (conv: Conversation) => {
    if (editTitle.trim()) {
      saveConv({ ...conv, title: editTitle.trim() });
      window.location.reload();
    }
    setEditId(null);
  };

  return (
    <>
      {/* Sidebar panel */}
      <motion.aside
        animate={{ x: isOpen ? 0 : -268 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{
          width: 268, height: "100%", flexShrink: 0,
          display: "flex", flexDirection: "column",
          background: "rgba(5,3,14,0.97)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid var(--border)",
          position: "fixed", zIndex: 30,
        }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 12px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(139,92,246,0.4)",
            }}>
              <Sparkles size={15} color="white" />
            </div>
            <div>
              <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1.5, color: "var(--text)" }}>NEXUS AI</p>
              <p style={{ fontSize: 10, color: "var(--muted)" }}>Powered by Groq</p>
            </div>
          </div>
          <button className="btn" onClick={onToggle}
            style={{ padding: 5, borderRadius: 8, background: "transparent", border: "none", color: "var(--muted)" }}>
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* New chat button */}
        <div style={{ padding: "0 10px 10px" }}>
          <button className="btn" onClick={onNew}
            style={{
              width: "100%", gap: 8, padding: "10px 14px", borderRadius: 13,
              background: "linear-gradient(135deg,rgba(139,92,246,0.22),rgba(34,211,238,0.08))",
              border: "1px solid var(--borderhi)", color: "var(--accenthi)",
              fontSize: 13, fontWeight: 600,
            }}>
            <Plus size={15} /> New Chat
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "0 10px 10px" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              style={{
                width: "100%", padding: "8px 10px 8px 28px",
                borderRadius: 10, background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)", color: "var(--text)",
                fontSize: 12, outline: "none", fontFamily: "DM Sans, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {pinned.length > 0 && (
            <>
              <SectionLabel>Pinned</SectionLabel>
              {pinned.map((c) => (
                <ConvRow key={c.id} conv={c} activeId={activeId} editId={editId} editTitle={editTitle}
                  hoverId={hoverId} setHoverId={setHoverId} setEditId={setEditId} setEditTitle={setEditTitle}
                  onSelect={onSelect} onDelete={onDelete} onPin={onPin} onCommit={commitEdit} />
              ))}
              <Divider />
            </>
          )}

          {recent.length > 0 && (
            <>
              <SectionLabel>Recent</SectionLabel>
              {recent.map((c) => (
                <ConvRow key={c.id} conv={c} activeId={activeId} editId={editId} editTitle={editTitle}
                  hoverId={hoverId} setHoverId={setHoverId} setEditId={setEditId} setEditTitle={setEditTitle}
                  onSelect={onSelect} onDelete={onDelete} onPin={onPin} onCommit={commitEdit} />
              ))}
            </>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 16px" }}>
              <MessageSquare size={28} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                {search ? "No results found" : "No chats yet. Start one!"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px", borderTop: "1px solid var(--border)" }}>
          <button className="btn" onClick={onSettings}
            style={{
              width: "100%", gap: 7, padding: "9px 14px", borderRadius: 11,
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--muted)", fontSize: 12,
            }}>
            <Settings size={13} /> Settings
          </button>
        </div>
      </motion.aside>

      {/* Collapsed toggle */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onToggle}
            style={{
              position: "fixed", left: 12, top: 12, zIndex: 30,
              width: 36, height: 36, borderRadius: 12,
              background: "rgba(139,92,246,0.18)",
              border: "1px solid var(--borderhi)", color: "var(--accenthi)",
            }}>
            <Sparkles size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", padding: "6px 8px 4px" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "6px 6px 8px" }} />;
}

function ConvRow({ conv, activeId, editId, editTitle, hoverId,
  setHoverId, setEditId, setEditTitle,
  onSelect, onDelete, onPin, onCommit }: {
  conv: Conversation; activeId: string | null;
  editId: string | null; editTitle: string; hoverId: string | null;
  setHoverId: (id: string | null) => void;
  setEditId: (id: string | null) => void;
  setEditTitle: (t: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onCommit: (c: Conversation) => void;
}) {
  const isActive = conv.id === activeId;
  const isEditing = editId === conv.id;
  const isHovered = hoverId === conv.id;

  return (
    <div
      onClick={() => onSelect(conv.id)}
      onMouseEnter={() => setHoverId(conv.id)}
      onMouseLeave={() => setHoverId(null)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 10px", borderRadius: 11, cursor: "pointer", marginBottom: 2,
        background: isActive ? "rgba(139,92,246,0.17)" : isHovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: isActive ? "1px solid rgba(139,92,246,0.38)" : "1px solid transparent",
        transition: "background 0.15s, border-color 0.15s",
      }}>
      {conv.pinned && <Pin size={9} color="var(--accent)" style={{ flexShrink: 0 }} />}

      <div style={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onCommit(conv); if (e.key === "Escape") setEditId(null); }}
              style={{
                flex: 1, minWidth: 0, fontSize: 12, padding: "2px 7px",
                borderRadius: 5, background: "rgba(255,255,255,0.1)",
                border: "1px solid var(--borderhi)", color: "var(--text)", outline: "none",
              }}
            />
            <button className="btn" onClick={() => onCommit(conv)}
              style={{ background: "none", border: "none", color: "var(--accent)", padding: 2 }}>
              <Check size={12} />
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, fontWeight: 500, color: isActive ? "var(--text)" : "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {conv.title}
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              {formatDistanceToNow(conv.updatedAt, { addSuffix: true })}
            </p>
          </>
        )}
      </div>

      {isHovered && !isEditing && (
        <div style={{ display: "flex", gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <IconBtn onClick={() => { setEditId(conv.id); setEditTitle(conv.title); }}><Edit3 size={11} /></IconBtn>
          <IconBtn onClick={() => onPin(conv.id)} color={conv.pinned ? "var(--accent)" : undefined}><Pin size={11} /></IconBtn>
          <IconBtn onClick={() => exportConv(conv)}><Download size={11} /></IconBtn>
          <IconBtn onClick={() => onDelete(conv.id)} danger><Trash2 size={11} /></IconBtn>
        </div>
      )}
    </div>
  );
}

function IconBtn({ onClick, children, color, danger }: {
  onClick: () => void; children: React.ReactNode; color?: string; danger?: boolean;
}) {
  return (
    <button className="btn" onClick={onClick}
      style={{
        padding: 5, borderRadius: 6, border: "none", background: "transparent",
        color: color || "var(--muted)",
      }}
      onMouseEnter={(e) => { if (danger) (e.currentTarget as HTMLButtonElement).style.color = "#f472b6"; }}
      onMouseLeave={(e) => { if (danger) (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
      {children}
    </button>
  );
}
