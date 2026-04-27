"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Greetings, human. I'm Zetatron, Abiel's robot assistant. How can I help you?",
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
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl transition-colors hover:border-[#00f0ff]"
      >
        {/* Robot icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/70 hover:text-[#00f0ff] transition-colors"
        >
          {/* head */}
          <rect x="5" y="6" width="14" height="12" rx="3" />

          {/* eyes */}
          <circle cx="9" cy="11" r="1" />
          <circle cx="15" cy="11" r="1" />

          {/* antenna */}
          <path d="M12 6V3" />
          <circle cx="12" cy="2.2" r="0.8" />

          {/* mouth */}
          <path d="M9 15h6" />
        </svg>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-[4.5rem] right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0f]/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00f0ff]" />

                <span className="font-mono text-xs tracking-widest text-white/60">
                  ZETATRON
                </span>
              </div>
            </div>

            {/* Messages */}
            <div
              data-lenis-prevent
              className="flex flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
              style={{ minHeight: 220, maxHeight: 300 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 font-mono text-[11px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#00f0ff]/[0.08] text-[#00f0ff]/90"
                        : "bg-white/[0.03] text-white/65"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((delay, i) => (
                        <div
                          key={i}
                          className="h-1 w-1 animate-bounce rounded-full bg-[#00f0ff]/50"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] px-4 py-3">
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
                  className="flex-1 bg-transparent font-mono text-xs text-white/80 placeholder-white/20 outline-none disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="shrink-0 text-[#00f0ff]/50 transition-colors hover:text-[#00f0ff] disabled:cursor-not-allowed disabled:opacity-25"
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
