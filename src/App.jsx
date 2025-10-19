import React, { useState, useEffect, useRef } from "react";

const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";
const PROMO_CODE = "TAR72";

export default function App() {
  const [messages, setMessages] = useState([{ id: 1, from: "bot", text: "Salut ! Je suis ton assistant pour profiter du code promo TAR72. Pose-moi une question !" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setTyping(true);

    try {
      // Appel à l'API serverless (backend) que nous créerons ensuite
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      const botMsg = { id: Date.now() + 1, from: "bot", text: data.reply };
      setMessages((s) => [...s, botMsg]);
    } catch (error) {
      const botMsg = { id: Date.now() + 1, from: "bot", text: "Oups, il y a eu une erreur. Réessaie plus tard." };
      setMessages((s) => [...s, botMsg]);
    }

    setTyping(false);
  };

  return (
    <div style={{ fontFamily: "Arial", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#1e1e2f", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "600px", background: "#2c2c3e", borderRadius: "15px", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "15px", borderBottom: "1px solid #444", color: "white", fontWeight: "bold" }}>Bot TAR72 - Code Promo 1XBET</div>

        <div ref={containerRef} style={{ flex: 1, padding: "15px", overflowY: "auto", maxHeight: "60vh" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: "12px", display: "flex", justifyContent: m.from === "bot" ? "flex-start" : "flex-end" }}>
              {m.from === "bot" && <div style={{ marginRight: "10px", color: "white" }}>🤖</div>}
              <div style={{ padding: "10px 15px", borderRadius: "15px", maxWidth: "400px", background: m.from === "bot" ? "#444" : "#4f46e5", color: "white" }}>{m.text}</div>
            </div>
          ))}
          {typing && <div style={{ color: "white" }}>🤖 Tape...</div>}
        </div>

        <div style={{ padding: "15px", borderTop: "1px solid #444", display: "flex", gap: "10px" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }} placeholder="Écris un message..." style={{ flex: 1, padding: "10px", borderRadius: "15px", border: "none", outline: "none" }} />
          <button onClick={() => handleSend(input)} style={{ padding: "10px 15px", borderRadius: "15px", background: "#4f46e5", color: "white", border: "none", cursor: "pointer" }}>Envoyer</button>
        </div>

        <div style={{ padding: "10px", display: "flex", gap: "10px", justifyContent: "space-around" }}>
          <a href={AFFILIATE_LINK} target="_blank" rel="noreferrer" style={{ background: "#6b5dd4", padding: "8px", borderRadius: "8px", color: "white", textDecoration: "none" }}>S'inscrire</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{ background: "#25d366", padding: "8px", borderRadius: "8px", color: "white", textDecoration: "none" }}>WhatsApp</a>
          <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" style={{ background: "#0088cc", padding: "8px", borderRadius: "8px", color: "white", textDecoration: "none" }}>Telegram</a>
        </div>
      </div>
    </div>
  );
}
