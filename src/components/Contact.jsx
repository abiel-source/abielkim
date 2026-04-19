"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "GitHub", href: "https://github.com/abiel-source" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abiel-source/" },
  { label: "arXiv", href: "https://arxiv.org/abs/2512.15749" },
];

export default function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });

      tl.from(".ct-left > *", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      }).from(
        ".ct-form > *",
        { y: 25, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" },
        "-=0.5"
      );
    },
    { scope: ref }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border-b border-white/[0.06] bg-transparent py-3 font-mono text-sm text-white/70 placeholder:text-white/15 transition-colors focus:border-white/20 focus:outline-none";

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div className="ct-left flex flex-col justify-center">
          <span className="mb-3 font-mono text-xs tracking-[0.25em] uppercase text-white/30">
            Contact
          </span>

          <h2 className="mb-4 font-mono text-3xl font-light tracking-tight text-white/90 sm:text-4xl">
            Let&apos;s talk
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-white/35">
            Open to opportunities, collaborations, and interesting
            conversations. Reach out and I&apos;ll get back to you.
          </p>

          <div className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-mono text-xs tracking-wider text-white/25 transition-colors hover:text-white/60"
              >
                <div className="h-px w-4 bg-white/10 transition-all group-hover:w-6 group-hover:bg-white/30" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ct-form flex flex-col gap-0">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`}
          />

          <MagneticButton
            as="button"
            type="submit"
            disabled={status === "sending"}
            className="mt-6 w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-3 font-mono text-xs tracking-wider text-white/60 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/90 disabled:opacity-40"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
              ? "Sent — thank you"
              : status === "error"
              ? "Error — try again"
              : "Send Message"}
          </MagneticButton>
        </form>
      </div>
    </section>
  );
}
