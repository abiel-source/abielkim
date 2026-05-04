"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const AMBER = "#c68c2f";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Greetings, human! Got questions?",
};

export default function Zetatron() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/zetatron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      const reply =
        data.reply ??
        "*Crackle* ... *Static Noises* ... Zetatron is currently experiencing... *Static Noises*... high load right now... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*";
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content:
            "*Crackle* ... *Static Noises* ... Zetatron is currently experiencing... *Static Noises*... high load right now... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Trigger */}
      <motion.button
        type="button"
        aria-label="Open Zetatron chat"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 cursor-pointer overflow-hidden rounded-full"
        style={{
          background: `radial-gradient(circle at 60% 35%, #1e140a, #0a0806)`,
          boxShadow: open
            ? `0 0 0 2px ${AMBER}, 0 0 22px ${AMBER}55`
            : `0 0 0 1px ${AMBER}55`,
        }}
      >
        {/* Replace robot-face.png with a cropped screenshot of the robot */}
        <Image
          src="/robot-face.png"
          alt="Zetatron"
          width={56}
          height={56}
          className="h-full w-full scale-[0.72] object-contain"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-[4.5rem] right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl"
            style={{
              background: "#1c1208f5",
              border: `1px solid ${AMBER}44`,
              boxShadow: `0 0 0 1px ${AMBER}18, 0 24px 48px #00000099`,
            }}
          >
            {/* Messages */}
            <div
              data-lenis-prevent
              className="flex flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
              style={{ minHeight: 220, maxHeight: 320 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    // Robot: no bubble, just floating text
                    <p
                      className="max-w-[85%] text-[11px] leading-relaxed"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: AMBER,
                        fontWeight: 700,
                      }}
                    >
                      {msg.content}
                    </p>
                  ) : (
                    // User: bold black text in a warm cream bubble
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        background: "#f5e0b0",
                        color: "#000000",
                        fontWeight: 700,
                      }}
                    >
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-1 py-2">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((delay, i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full"
                          style={{
                            animationDelay: `${delay}ms`,
                            background: AMBER,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3"
              style={{ borderTop: `1px solid ${AMBER}33` }}
            >
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Abiel..."
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs text-white/70 outline-none placeholder:text-white/25 disabled:opacity-50"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    caretColor: AMBER,
                  }}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="shrink-0 transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
                  style={{ color: AMBER }}
                  aria-label="Send"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
