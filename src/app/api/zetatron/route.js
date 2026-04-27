import { NextResponse } from "next/server";
import { ZETATRON_SYSTEM_PROMPT } from "@/data/zetatron";

// Endpoints and settings
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

const MAX_TOKENS = 120;
const USAGE_LIMIT = 2;
const WINDOW_MS = 1000 * 60 * 60 * 2; // reset limit every 2 hours

// Simple IP-based session tracking (for now)
const IPUsageMap = new Map();

// TO-DO randomly cycle through various usage limit responses by Zetatron
// ...

// Utility function to convert messages into Open AI usable format (Groq + Mistral)
function buildOpenAIMessages(messages) {
  return [
    { role: "system", content: ZETATRON_SYSTEM_PROMPT },
    ...messages
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content })),
  ];
}

async function callGroq(messages, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: buildOpenAIMessages(messages),
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(
        "Groq error:",
        res.status,
        (await res.text().catch(() => "")).slice(0, 300)
      );
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    clearTimeout(timeout);
    console.error(
      err?.name === "AbortError" ? "Groq timed out" : "Groq failed:",
      err
    );
    return null;
  }
}

async function callGemini(messages, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const contents = messages
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: ZETATRON_SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.7 },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(
        "Gemini error:",
        res.status,
        (await res.text().catch(() => "")).slice(0, 300)
      );
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    clearTimeout(timeout);
    console.error(
      err?.name === "AbortError" ? "Gemini timed out" : "Gemini failed:",
      err
    );
    return null;
  }
}

async function callMistral(messages, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: buildOpenAIMessages(messages),
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(
        "Mistral error:",
        res.status,
        (await res.text().catch(() => "")).slice(0, 300)
      );
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    clearTimeout(timeout);
    console.error(
      err?.name === "AbortError" ? "Mistral timed out" : "Mistral failed:",
      err
    );
    return null;
  }
}

export async function POST(req) {
  try {
    // Parse request
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        reply:
          "*beep boop beep* ... Zetatron sensors unable to understand your request, please try again *beep beep boop*",
      });
    }

    // const userMessages = messages.filter((m) => m.role === "user");
    // if (userMessages.length > 5) {
    //   return NextResponse.json(
    //     { error: "Session limit reached" },
    //     { status: 429 }
    //   );
    // }

    const last = messages[messages.length - 1];
    if (
      !last?.content ||
      typeof last.content !== "string" ||
      last.content.length > 500
    ) {
      return NextResponse.json({
        reply:
          "*beep beep boop* Zetatron kernel detecting RAM overload... hmm, maybe try shortening your message? *beep beep*",
      });
    }

    // Ensure usage limit per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const usage = IPUsageMap.get(ip);

    if (
      usage &&
      now - usage.timestamp < WINDOW_MS &&
      usage.count >= USAGE_LIMIT
    ) {
      return NextResponse.json({
        reply:
          "*Crackle* ... *Static Noises* ... Zetatron usage limit detected... *Static Noises*... clearing cache now... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*",
      });
    }

    // cut ip usage tracking map when needed
    if (IPUsageMap.size > 1000) {
      for (const [key, value] of IPUsageMap) {
        if (now - value.timestamp > WINDOW_MS) {
          IPUsageMap.delete(key);
        }
      }
    }

    // Try fallback models in sequence
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const mistralKey = process.env.MISTRAL_API_KEY;

    if (!groqKey && !geminiKey && !mistralKey) {
      return NextResponse.json({
        reply:
          "*Crackle* ... *Static Noises* ... Zetatron is currently experiencing... *Static Noises*... high load right now... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*",
      });
    }

    let reply = null;
    let provider = null;

    if (groqKey) {
      console.log("[Zetatron] Trying Groq (llama-3.1-8b-instant)...");
      reply = await callGroq(messages, groqKey);
      if (reply) provider = "Groq (llama-3.1-8b-instant)";
      else console.warn("[Zetatron] Groq failed — moving to next provider");
    }

    if (!reply && geminiKey) {
      console.log("[Zetatron] Trying Gemini (gemini-2.0-flash)...");
      reply = await callGemini(messages, geminiKey);
      if (reply) provider = "Gemini (gemini-2.0-flash)";
      else console.warn("[Zetatron] Gemini failed — moving to next provider");
    }

    if (!reply && mistralKey) {
      console.log("[Zetatron] Trying Mistral (mistral-small-latest)...");
      reply = await callMistral(messages, mistralKey);
      if (reply) provider = "Mistral (mistral-small-latest)";
      else console.warn("[Zetatron] Mistral failed — all providers exhausted");
    }

    // Handle reply
    if (!reply) {
      return NextResponse.json({
        reply:
          "*Crackle* ... *Static Noises* ... Zetatron is currently experiencing... *Static Noises*... high load right now... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*",
      });
    }

    console.log(`[Zetatron] Response served by: ${provider}`);

    // Increment after success to avoid penalizing response failure
    if (usage && now - usage.timestamp < WINDOW_MS) {
      IPUsageMap.set(ip, {
        count: usage.count + 1,
        timestamp: usage.timestamp,
      });
    } else {
      IPUsageMap.set(ip, { count: 1, timestamp: now });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Zetatron fatal error:", err);

    return NextResponse.json({
      reply:
        "*Crackle* ... *Static Noises* ... Zetatron encountered a critical system fault... must- *Crackle* repair... but my human, Abiel Kim, is a developer focused on AI systems and full-stack engineering... *Crackle* talk soon *Crackle*",
    });
  }
}
