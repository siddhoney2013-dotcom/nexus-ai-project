"use client";
import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Conversation } from "@/lib/types";
import { saveConv } from "@/lib/storage";
import toast from "react-hot-toast";

export function useChat(conv: Conversation, onUpdate: (c: Conversation) => void) {
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const persist = useCallback(
    (c: Conversation) => { saveConv(c); onUpdate(c); },
    [onUpdate]
  );

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || loading) return;

      const userMsg: Message = {
        id: uuidv4(), role: "user",
        content: content.trim(), timestamp: Date.now(),
      };
      const aiMsg: Message = {
        id: uuidv4(), role: "assistant",
        content: "", timestamp: Date.now(), isStreaming: true,
      };

      const withNew: Conversation = {
        ...conv,
        messages: [...conv.messages, userMsg, aiMsg],
        updatedAt: Date.now(),
      };
      persist(withNew);
      setLoading(true);
      setStreaming(true);
      abortRef.current = new AbortController();

      try {
        const history = withNew.messages.slice(0, -1).map((m) => ({
          role: m.role, content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            model: conv.model,
            systemPrompt: conv.systemPrompt,
            temperature: conv.temperature,
            maxTokens: conv.maxTokens,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "API error");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            const lines = text.split("\n").filter((l) => l.startsWith("data: "));
            for (const line of lines) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                accumulated += parsed.delta || "";
                onUpdate({
                  ...withNew,
                  messages: withNew.messages.map((m) =>
                    m.id === aiMsg.id ? { ...m, content: accumulated } : m
                  ),
                });
              } catch { /* skip malformed chunks */ }
            }
          }
        }

        const final: Conversation = {
          ...withNew,
          messages: withNew.messages.map((m) =>
            m.id === aiMsg.id ? { ...m, content: accumulated, isStreaming: false } : m
          ),
        };
        persist(final);

        // Auto-generate title after first message
        if (conv.messages.length === 0) {
          fetch("/api/title", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage: content, assistantMessage: accumulated }),
          })
            .then((r) => r.json())
            .then(({ title }) => persist({ ...final, title }))
            .catch(() => {});
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          persist({
            ...withNew,
            messages: withNew.messages.map((m) =>
              m.id === aiMsg.id ? { ...m, isStreaming: false } : m
            ),
          });
        } else {
          const msg = err instanceof Error ? err.message : "Unknown error";
          toast.error(msg);
          persist({
            ...withNew,
            messages: withNew.messages.map((m) =>
              m.id === aiMsg.id
                ? { ...m, content: `⚠️ ${msg}`, isStreaming: false, error: true }
                : m
            ),
          });
        }
      } finally {
        setLoading(false);
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [conv, loading, onUpdate, persist]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const regenerate = useCallback(async () => {
    const msgs = conv.messages;
    const lastUserIdx = [...msgs].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const idx = msgs.length - 1 - lastUserIdx;
    const userContent = msgs[idx].content;
    persist({ ...conv, messages: msgs.slice(0, idx) });
    setTimeout(() => send(userContent), 60);
  }, [conv, send, persist]);

  return { send, stop, regenerate, loading, streaming };
}
