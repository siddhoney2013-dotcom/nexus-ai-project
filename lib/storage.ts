import { Conversation } from "./types";
const KEY = "nexus_groq_convs";

export function getAll(): Conversation[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveConv(conv: Conversation) {
  const all = getAll();
  const idx = all.findIndex((c) => c.id === conv.id);
  if (idx >= 0) all[idx] = conv; else all.unshift(conv);
  all.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteConv(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getAll().filter((c) => c.id !== id)));
}

export function exportConv(conv: Conversation) {
  const lines = conv.messages.map((m) => `[${m.role.toUpperCase()}]\n${m.content}`).join("\n\n---\n\n");
  const blob = new Blob([`# ${conv.title}\nModel: ${conv.model}\n\n${lines}`], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${conv.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
  a.click();
}
