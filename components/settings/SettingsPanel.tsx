"use client";
import { motion } from "framer-motion";
import { X, Zap, Thermometer, Hash, Brain, FileText } from "lucide-react";
import { Conversation, MODELS } from "@/lib/types";
import { saveConv } from "@/lib/storage";

interface Props { conv: Conversation; onUpdate: (c: Conversation) => void; onClose: () => void; }

export default function SettingsPanel({ conv, onUpdate, onClose }: Props) {
  const update = (partial: Partial<Conversation>) => {
    const updated = { ...conv, ...partial };
    saveConv(updated);
    onUpdate(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}>

      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} />

      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 500,
          maxHeight: "88vh", overflowY: "auto",
          borderRadius: 22, background: "var(--bg2)",
          border: "1px solid var(--borderhi)", zIndex: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
        }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 14px", borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, background: "var(--bg2)", zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>Settings</h2>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Affects current conversation</p>
          </div>
          <button className="btn" onClick={onClose}
            style={{ padding: 7, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Model */}
          <Section icon={<Brain size={14} />} label="AI Model">
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {MODELS.map((m) => (
                <button key={m.id} className="btn" onClick={() => update({ model: m.id })}
                  style={{
                    justifyContent: "flex-start", gap: 12, padding: "11px 14px", borderRadius: 13,
                    background: conv.model === m.id ? "rgba(139,92,246,0.16)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${conv.model === m.id ? "var(--borderhi)" : "var(--border)"}`,
                    textAlign: "left",
                  }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: conv.model === m.id ? "var(--accent)" : "var(--muted)",
                    boxShadow: conv.model === m.id ? "0 0 8px var(--accent)" : "none",
                  }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{m.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>{m.desc}</p>
                  </div>
                  {conv.model === m.id && <Zap size={12} color="var(--accent)" style={{ marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
          </Section>

          {/* Temperature */}
          <Section icon={<Thermometer size={14} />} label={`Temperature — ${conv.temperature.toFixed(1)}`}>
            <input type="range" min="0" max="2" step="0.1" value={conv.temperature}
              onChange={(e) => update({ temperature: parseFloat(e.target.value) })}
              style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              <span>🎯 Precise</span><span>⚖️ Balanced</span><span>🎨 Creative</span>
            </div>
          </Section>

          {/* Max tokens */}
          <Section icon={<Hash size={14} />} label={`Max Tokens — ${conv.maxTokens.toLocaleString()}`}>
            <input type="range" min="256" max="8192" step="256" value={conv.maxTokens}
              onChange={(e) => update({ maxTokens: parseInt(e.target.value) })}
              style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              <span>256</span><span>8192</span>
            </div>
          </Section>

          {/* System prompt */}
          <Section icon={<FileText size={14} />} label="System Prompt">
            <textarea
              value={conv.systemPrompt}
              onChange={(e) => update({ systemPrompt: e.target.value })}
              rows={5}
              style={{
                width: "100%", padding: "11px 13px", borderRadius: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 12, resize: "vertical", outline: "none",
                fontFamily: "JetBrains Mono, monospace", lineHeight: 1.6, boxSizing: "border-box",
              }}
              className="inp"
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {[
                { label: "Default", value: "You are Nexus, a highly intelligent and helpful AI assistant. Be concise but thorough." },
                { label: "Coder", value: "You are an expert software engineer. Write clean, well-commented code and explain your reasoning." },
                { label: "Writer", value: "You are a creative writing expert. Help craft compelling, engaging content." },
                { label: "Gamer", value: "You are a gaming expert who knows everything about games, strategies, builds, and tips." },
              ].map(({ label, value }) => (
                <button key={label} className="btn" onClick={() => update({ systemPrompt: value })}
                  style={{
                    padding: "4px 10px", borderRadius: 8, fontSize: 11,
                    background: conv.systemPrompt === value ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${conv.systemPrompt === value ? "var(--borderhi)" : "var(--border)"}`,
                    color: conv.systemPrompt === value ? "var(--accenthi)" : "var(--muted)",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </Section>

        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--muted)" }}>{label}</p>
      </div>
      {children}
    </div>
  );
}
