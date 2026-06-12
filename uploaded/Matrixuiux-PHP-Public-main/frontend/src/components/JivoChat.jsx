import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Headset } from "lucide-react";
import { COMPANY } from "../data/company";
import { getSessionId, streamChat } from "./chat/chatApi";
import LeadForm from "./chat/LeadForm";

const TypingDots = () => (
  <span className="inline-flex gap-1 items-center py-1">
    {[1, 2, 3].map((n) => (
      <span key={n} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${(n - 1) * 0.15}s` }} />
    ))}
  </span>
);

const leadMessages = (callbackRequested, form) => {
  if (callbackRequested === true) {
    return [
      { from: "user", text: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n→ Requested a callback` },
      { from: "agent", text: "✅ You're now connected with our live support team." },
      { from: "agent", text: `📞 Our agent is going to call you shortly — please be near your phone (${form.phone}).\n\nIn the meantime, I can help you right here with purchase assistance or the installation guide. What do you need?` },
    ];
  }
  if (callbackRequested === false) {
    return [
      { from: "user", text: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}` },
      { from: "agent", text: `Great, ${form.name.split(" ")[0]}! Call us now at ${COMPANY.phone} (Mon–Sat 9 AM–6 PM EST) and our team will assist you right away. I'm also here if you'd like to chat.` },
    ];
  }
  return [{ from: "agent", text: "No problem! Ask me anything — products, pricing, installation, activation… I'm here to help. 😊" }];
};

const ChatLauncher = ({ onOpen }) => (
  <button onClick={onOpen} className="flex items-center gap-2 bg-white shadow-xl rounded-full pl-2 pr-4 py-2 border border-slate-200 hover:shadow-2xl transition" data-testid="chat-open-btn">
    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center relative">
      <Sparkles className="w-4 h-4" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
    </span>
    <span className="text-sm font-semibold text-slate-900 hidden sm:inline">Chat</span>
  </button>
);

const JivoChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(() => !localStorage.getItem("ucode_lead_done"));
  const [messages, setMessages] = useState([
    { id: 1, from: "agent", text: "Hi there! 👋 Ask me anything about Microsoft Office, Windows, antivirus, pricing or installation." },
  ]);
  const bottomRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const idRef = useRef(1);
  const nextId = () => { idRef.current += 1; return idRef.current; };

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, showLeadForm]);

  // Allow other components (e.g. order success page) to open the chat
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ucode-open-chat", handler);
    return () => window.removeEventListener("ucode-open-chat", handler);
  }, []);

  const onLeadSubmitted = (callbackRequested, form) => {
    setShowLeadForm(false);
    setMessages((m) => [...m, ...leadMessages(callbackRequested, form).map((msg) => ({ ...msg, id: nextId() }))]);
  };

  const setLastAgentText = (value) =>
    setMessages((m) => {
      const c = [...m];
      c[c.length - 1] = { ...c[c.length - 1], text: value, typing: false };
      return c;
    });

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { id: nextId(), from: "user", text }, { id: nextId(), from: "agent", text: "", typing: true }]);

    try {
      await streamChat(sessionId.current, text, setLastAgentText);
      // finalize: replace with fallback if nothing arrived
      setMessages((m) => {
        const c = [...m];
        const last = c[c.length - 1];
        if (last.from === "agent" && !last.text) {
          c[c.length - 1] = { ...last, text: `Please call us toll-free at ${COMPANY.phone} (Mon–Fri 9 AM–6 PM EST) and a sales expert will help you.`, typing: false };
        }
        return c;
      });
    } catch (err) {
      console.warn("Chat stream failed:", err);
      setLastAgentText(`Sorry, I couldn't connect just now. Please call us toll-free at ${COMPANY.phone} (Mon–Fri 9 AM–6 PM EST), or try again in a moment.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2">
      {!open && <ChatLauncher onOpen={() => setOpen(true)} />}
      {open && (
        <div className="w-[320px] sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" data-testid="chat-panel">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-1.5"><Sparkles className="w-4 h-4" />Chat</div>
              <div className="text-[11px] opacity-90 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" />Ask anything · Max, AI assistant</div>
            </div>
            <button onClick={() => setOpen(false)} data-testid="chat-close-btn"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-3 bg-slate-50 h-64 overflow-y-auto space-y-2 text-sm" data-testid="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-2.5 rounded-lg shadow-sm leading-snug whitespace-pre-wrap ${m.from === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`}>
                  {m.text || <TypingDots />}
                </div>
              </div>
            ))}
            {showLeadForm && <LeadForm onSubmitted={onLeadSubmitted} />}
            <div ref={bottomRef} />
          </div>

          {/* Have a Question? */}
          <div className="px-3 py-2.5 bg-blue-50 border-t border-slate-200 flex items-center gap-2.5" data-testid="chat-question-block">
            <Headset className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="text-[11px] leading-tight text-slate-600">
              <span className="font-semibold text-slate-900">Prefer to talk?</span> Mon–Sat 9 AM–6 PM EST{" "}
              <a href={`tel:${COMPANY.phone}`} className="font-bold text-blue-700">{COMPANY.phone}</a>
            </div>
          </div>

          <form onSubmit={send} className="p-3 border-t border-slate-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask anything..."
              data-testid="chat-input"
            />
            <button type="submit" disabled={busy} className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition" data-testid="chat-send-btn" aria-label="Send message">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JivoChat;
