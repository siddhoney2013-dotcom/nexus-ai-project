export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", desc: "Most capable — recommended" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", desc: "Ultra fast responses" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", desc: "Great for coding & reasoning" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", desc: "Google's efficient model" },
];

export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_SYSTEM = "You are Nexus, a highly intelligent and helpful AI assistant. You provide clear, accurate, and thoughtful responses. Be concise but thorough.";
export const DEFAULT_TEMP = 0.7;
export const DEFAULT_TOKENS = 2048;
