"use client";
import { motion } from "framer-motion";
import { Zap, Code, Pencil, BarChart3, Gamepad2, BookOpen, Sparkles, Brain } from "lucide-react";

const PROMPTS = [
  { icon: Code,      text: "Write a Python function to reverse a linked list" },
  { icon: Gamepad2,  text: "Best settings for max FPS in Valorant on low-end PC" },
  { icon: Pencil,    text: "Write a catchy YouTube thumbnail title about AI" },
  { icon: BarChart3, text: "How to start investing with ₹5000 in India?" },
  { icon: BookOpen,  text: "Explain transformers in AI like I am 15 years old" },
  { icon: Brain,     text: "Give me 5 profitable SaaS ideas for 2025" },
];

export default function Welcome({ onSend }: { onSend: (m: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100%", padding: "40px 20px", textAlign: "center",
      }}>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
        style={{
          width: 72, height: 72, borderRadius: 22,
          background: "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 22, boxShadow: "0 0 50px rgba(139,92,246,0.5)",
        }}>
        <Sparkles size={32} color="white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grad"
        style={{ fontSize: 30, fontWeight: 800, fontFamily: "Syne, sans-serif", marginBottom: 8 }}>
        What can I help you with?
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36 }}>
        <Zap size={13} color="var(--accenthi)" />
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          Powered by Groq · Blazing fast · 100% free
        </p>
      </motion.div>

      {/* Suggestion grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10, width: "100%", maxWidth: 540,
      }}>
        {PROMPTS.map(({ icon: Icon, text }, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            whileHover={{ scale: 1.02, borderColor: "var(--accent)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSend(text)}
            style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "12px 14px", borderRadius: 14, cursor: "pointer",
              background: "rgba(139,92,246,0.07)",
              border: "1px solid var(--border)", textAlign: "left",
              transition: "border-color 0.2s, background 0.2s",
            }}>
            <Icon size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>{text}</span>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ marginTop: 28, fontSize: 12, color: "var(--muted)" }}>
        Enter to send · Shift+Enter for new line · Voice input supported
      </motion.p>
    </motion.div>
  );
}
