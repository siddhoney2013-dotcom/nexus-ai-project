"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, RotateCcw, User, Sparkles, AlertTriangle } from "lucide-react";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Props { msg: Message; isLast: boolean; onRegenerate?: () => void; }

export default function MessageBubble({ msg, isLast, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const isEmpty = !msg.content && msg.isStreaming;

  const copy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="group"
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        maxWidth: 820,
        margin: "0 auto",
        width: "100%",
        alignItems: "flex-start",
      }}>

      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
        background: isUser
          ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
          : msg.error ? "rgba(244,114,182,0.15)" : "rgba(139,92,246,0.12)",
        border: isUser ? "none" : "1px solid var(--border)",
        boxShadow: isUser ? "0 2px 10px rgba(139,92,246,0.3)" : "none",
      }}>
        {isUser
          ? <User size={14} color="white" />
          : msg.error
            ? <AlertTriangle size={14} color="#f472b6" />
            : <Sparkles size={14} color="var(--accent)" />}
      </div>

      {/* Content column */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 4,
        maxWidth: "80%", alignItems: isUser ? "flex-end" : "flex-start",
      }}>
        {/* Bubble */}
        <div style={{
          padding: "10px 15px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          background: isUser ? "var(--user-bg)" : "var(--ai-bg)",
          border: isUser ? "1px solid rgba(139,92,246,0.35)" : "1px solid var(--border)",
          color: "var(--text)",
          fontSize: 14,
          lineHeight: 1.65,
          wordBreak: "break-word",
        }}>
          {isEmpty ? (
            <span style={{ display: "flex", gap: 5, alignItems: "center", padding: "3px 0" }}>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </span>
          ) : isUser ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
          ) : (
            <div className={`prose${msg.isStreaming && isLast ? " streaming-cursor" : ""}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeStr = String(children).replace(/\n$/, "");
                    if (match) {
                      return (
                        <div>
                          <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "6px 14px",
                            background: "rgba(139,92,246,0.14)",
                            borderBottom: "1px solid var(--border)",
                          }}>
                            <span style={{ fontSize: 11, color: "var(--accenthi)", fontFamily: "JetBrains Mono, monospace", fontWeight: 500 }}>
                              {match[1]}
                            </span>
                            <button
                              className="btn"
                              onClick={() => { navigator.clipboard.writeText(codeStr); toast.success("Code copied!"); }}
                              style={{ fontSize: 11, color: "var(--muted)", background: "none", padding: "2px 8px", borderRadius: 6, border: "1px solid var(--border)" }}>
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus as Record<string, React.CSSProperties>}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, borderRadius: "0 0 11px 11px", fontSize: "0.78rem", padding: "14px 16px", background: "#080615" }}>
                            {codeStr}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                    return <code className={className}>{children}</code>;
                  },
                }}>
                {msg.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div
          className="opacity-0 group-hover:opacity-100"
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "0 4px",
            flexDirection: isUser ? "row-reverse" : "row",
            transition: "opacity 0.2s",
          }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>{format(msg.timestamp, "h:mm a")}</span>
          <button className="btn" onClick={copy} style={{ padding: 5, borderRadius: 7, background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>
            {copied ? <Check size={12} color="var(--accent)" /> : <Copy size={12} />}
          </button>
          {onRegenerate && (
            <button className="btn" onClick={onRegenerate} style={{ padding: 5, borderRadius: 7, background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
