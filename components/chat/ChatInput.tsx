"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";

interface Props { onSend: (msg: string) => void; loading: boolean; streaming: boolean; }

export default function ChatInput({ onSend, loading, streaming }: Props) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const send = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const toggleVoice = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    if (!SR) { toast.error("Voice not supported in this browser"); return; }
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.onresult = (e: any) =>
      setInput(Array.from(e.results).map((x) => x[0].transcript).join(""));
    r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("chat-input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ padding: "6px 16px 18px", flexShrink: 0 }}>
      <motion.div
        animate={{ boxShadow: input ? "0 0 0 1px var(--accent), 0 8px 40px rgba(139,92,246,0.2)" : "0 4px 30px rgba(0,0,0,0.4)" }}
        style={{
          borderRadius: 20,
          background: "rgba(11,9,25,0.96)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
        }}>
        {/* Textarea row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "12px 14px 8px" }}>
          <TextareaAutosize
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={streaming ? "Nexus is thinking..." : "Ask anything..."}
            disabled={loading && !streaming}
            minRows={1}
            maxRows={7}
            style={{
              flex: 1, resize: "none", background: "transparent", border: "none",
              outline: "none", color: "var(--text)", fontSize: 14, lineHeight: 1.65,
              fontFamily: "DM Sans, sans-serif", caretColor: "var(--accent)", paddingTop: 2,
            }}
          />

          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <button
              className="btn"
              onClick={toggleVoice}
              style={{
                padding: 8, borderRadius: 10, border: "none",
                background: listening ? "rgba(244,114,182,0.15)" : "transparent",
                color: listening ? "#f472b6" : "var(--muted)",
              }}>
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <motion.button
              className="btn"
              onClick={send}
              disabled={!input.trim() || (loading && !streaming)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 36, height: 36, borderRadius: 12, border: "none",
                background: input.trim()
                  ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                  : "rgba(139,92,246,0.15)",
                boxShadow: input.trim() ? "0 4px 18px var(--glow)" : "none",
                opacity: loading && !streaming ? 0.4 : 1,
                cursor: input.trim() ? "pointer" : "default",
              }}>
              <Send size={15} color="white" style={{ transform: "translateX(1px)" }} />
            </motion.button>
          </div>
        </div>

        {/* Hints bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 14px 10px", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            <kbd style={{ padding: "1px 5px", borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", fontFamily: "monospace" }}>⌘K</kbd> focus
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            {input.length > 0 ? `${input.length} chars · ` : ""}Enter to send · Shift+Enter new line
          </span>
        </div>
      </motion.div>
    </div>
  );
}
