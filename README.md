# Nexus AI — Groq Edition ⚡

Ultra-fast AI chat powered by Groq (100% free, no credit card needed).

---

## 🚀 Setup — 3 Steps

### Step 1 — Install
Open cmd inside this folder and run:
```
npm install
```

### Step 2 — Add your Groq API key
Open the file called `.env.local` in Notepad.
Replace `paste_your_groq_key_here` with your actual key:
```
GROQ_API_KEY=gsk_your_actual_key_here
```
Get your FREE key at: https://console.groq.com
→ Sign up → API Keys → Create API Key → Copy it

### Step 3 — Run
```
npm run dev
```
Open your browser at: http://localhost:3000

---

## ✨ Features
- ⚡ Blazing fast responses (Groq is the fastest AI API)
- 💬 Multiple conversations with history saved locally
- 🔍 Search through your chats
- 📌 Pin important conversations
- ✏️ Rename and delete chats
- 📥 Export chats as .txt files
- 🎨 Markdown + code syntax highlighting
- 🎤 Voice input (mic button)
- 🔁 Regenerate responses
- ⏹️ Stop generation anytime
- ⚙️ Settings: model, temperature, max tokens, system prompt
- 📱 Works on mobile and desktop

## 🤖 Available Models
- Llama 3.3 70B — Most capable
- Llama 3.1 8B — Ultra fast
- Mixtral 8x7B — Great for coding
- Gemma 2 9B — Google model

## 🚢 Deploy Free on Vercel
1. Push to GitHub
2. Go to vercel.com → Import repo
3. Add environment variable: GROQ_API_KEY = your key
4. Click Deploy — done!
