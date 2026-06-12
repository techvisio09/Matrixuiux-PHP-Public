const API = process.env.REACT_APP_BACKEND_URL;

export const getSessionId = () => {
  let id = localStorage.getItem("ucode_chat_session");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("ucode_chat_session", id);
  }
  return id;
};

// Reads the SSE token stream from /api/chat and calls onText with the
// accumulated, display-safe text (the [LEAD] capture marker is hidden).
export const streamChat = async (sessionId, message, onText) => {
  const res = await fetch(`${API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok || !res.body) throw new Error("bad response");

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop();
    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      let data;
      try { data = JSON.parse(part.slice(6)); } catch { continue; }
      if (!data.t) continue;
      full += data.t;
      const markerAt = full.indexOf("[LEAD]");
      const visible = markerAt === -1 ? full : full.slice(0, markerAt);
      onText(visible.trimStart());
    }
  }
};

export const submitLead = async (payload) => {
  await fetch(`${API}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
