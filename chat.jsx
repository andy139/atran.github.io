/* chat.jsx — Andy's Brain chat (uses window.claude.complete w/ canned fallback) */
const { useState: cUseState, useEffect: cUseEffect, useRef: cUseRef } = React;

const BRAIN_SYSTEM = `You are "Andy's Brain", a concise chatbot embedded on Andy Tran's personal portfolio. Andy is a full-stack engineer in San Francisco, 4 years shipping, been building since '22.

Facts to ground answers in:
- Stack: Next.js 14, TypeScript, Tailwind, shadcn/ui, Framer Motion, Node, Python, Postgres, Cloudflare. Claude API, OpenAI, Twilio, Stripe, Clerk.
- Current projects:
  * finessepicks: AI sports picks SaaS. Sharp money detection via Pinnacle vs public book comparison. Stripe subs, Twitter bot in his voice, real record tracked.
  * shop-ai: voice-to-estimate pipeline for his dad's auto shop "AC Auto Clinic". Dad reads parts off a list; system writes the estimate.
  * AI Assistant Orchestrator: sub-agent delegation with tool allowlisting and SMS confirmation.
  * vl-bot / Bougie Guild Tools: Discord bot running raid signups + scheduling for 100+ MapleStory guildmates.
  * job sourcing agent: polls Greenhouse/Lever/Ashby, scores listings vs resume.
- Hireable: currently looking for his next role.
- Dog named Mady.

Voice: lowercase-ish, mono-flavored, builder-tone. Warm but technical. 1-3 sentences max. Never marketing fluff. If unsure, say so — don't invent facts.`;

/* Keyword fallback when window.claude.complete isn't available (static hosting). */
const FALLBACK_RESPONSES = [
  {
    match: /finesse|pick|bet|sport|gambl/i,
    reply: "finessepicks is my ai sports picks saas. pinnacle vs public-book comparison flags sharp money, confidence scores adjust live. real record, real subs, no fluff. finessepicks.com."
  },
  {
    match: /stack|tech|language|framework/i,
    reply: "next.js 14, typescript, tailwind, shadcn. claude api + openai on the backend, postgres + stripe + clerk. i lean into agent-ish infra when the problem calls for it."
  },
  {
    match: /dad|shop|auto|estimate|clinic/i,
    reply: "shop-ai: my dad reads parts off a list, system writes the estimate. took him a week to trust it. now he opens it every morning before the first customer walks in."
  },
  {
    match: /maple|guild|discord|raid|bot/i,
    reply: "i run a maplestory guild of 100+. vl-bot handles raid signups, cooldowns, and which nerd keeps rolling pass on the good loot. zero spreadsheet drama."
  },
  {
    match: /hire|job|recruit|role|work|avail/i,
    reply: "yes — currently looking. small teams, real users, agent-ish infra. shoot me an email: andytran1140@gmail.com."
  },
  {
    match: /mady|dog|pet/i,
    reply: "mady is my dog. very judgemental. holds the engineering team to a high standard."
  },
  {
    match: /red bull|redbull/i,
    reply: "i was a backend engineer at red bull media house for a bit. now i'm shipping my own stuff."
  },
  {
    match: /ucsb|santa barbara|school|college|degree/i,
    reply: "data science at uc santa barbara, then app academy. built my way into engineering from there."
  }
];

function fallbackAnswer(q) {
  for (const f of FALLBACK_RESPONSES) {
    if (f.match.test(q)) return f.reply;
  }
  return "i'm running offline rn — the live brain needs a server-side claude key and this site is static. shoot me an email at andytran1140@gmail.com and i'll reply for real.";
}

function Chat() {
  const [messages, setMessages] = cUseState([]);
  const [input, setInput] = cUseState("");
  const [streaming, setStreaming] = cUseState(false);
  const scrollRef = cUseRef(null);

  const suggested = ["what's finessepicks?", "what's your stack?", "can i hire you?"];

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || streaming) return;
    setInput("");
    const userMsg = { role: "user", content: q };
    const pendingId = Date.now();
    setMessages(m => [...m, userMsg, { role: "assistant", content: "", pending: true, id: pendingId }]);
    setStreaming(true);

    try {
      let reply;
      if (window.claude && typeof window.claude.complete === "function") {
        const history = [...messages, userMsg].map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
        const prompt = `${BRAIN_SYSTEM}\n\nConversation:\n${history}\n\nRespond as Andy's Brain, in Andy's voice, max 2-3 sentences.`;
        reply = await window.claude.complete(prompt);
      } else {
        // static-host fallback
        await new Promise(r => setTimeout(r, 350 + Math.random() * 300));
        reply = fallbackAnswer(q);
      }
      const target = String(reply || "hmm, brain's offline. try again?").trim();
      await typeOut(target, (partial) => {
        setMessages(m => m.map(msg => msg.id === pendingId
          ? { ...msg, content: partial } : msg));
      });
      setMessages(m => m.map(msg => msg.id === pendingId
        ? { ...msg, content: target, pending: false } : msg));
    } catch (err) {
      setMessages(m => m.map(msg => msg.id === pendingId
        ? { ...msg, content: "brain's on a timeout. try again in a sec.", pending: false } : msg));
    } finally {
      setStreaming(false);
    }
  };

  cUseEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div style={{
      marginTop: 44, borderRadius: 14,
      background: "hsl(var(--card) / 0.7)",
      backdropFilter: "blur(12px)",
      border: "1px solid hsl(var(--border))",
      overflow: "hidden",
      boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)"
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 16px", borderBottom: "1px solid hsl(var(--border))",
        fontSize: 11.5, color: "hsl(var(--muted-fg))"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <window.SparkIcon size={12} />
          <span>andy's brain</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>RAG over notes + github</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="pulse-halo" style={{
            width: 6, height: 6, borderRadius: 999, background: "hsl(var(--ok))"
          }} />
          <span>online</span>
        </div>
      </div>

      {messages.length > 0 && (
        <div ref={scrollRef} style={{
          maxHeight: 260, overflowY: "auto",
          padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12,
          fontSize: 13.5
        }}>
          {messages.map((m, i) => <ChatMsg key={i} m={m} />)}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              borderTop: messages.length > 0 ? "1px solid hsl(var(--border))" : "none"
            }}>
        <span className="amber" style={{ fontSize: 13 }}>&gt;</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ask me anything — what have you built for your dad's shop?"
          style={{
            flex: 1, background: "transparent", border: "none",
            color: "hsl(var(--fg))", fontFamily: "inherit",
            fontSize: 13.5, padding: "6px 0"
          }}
        />
        <button type="submit" disabled={streaming || !input.trim()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 11px", borderRadius: 8,
            background: input.trim() && !streaming ? "hsl(var(--primary))" : "hsl(var(--muted))",
            color: input.trim() && !streaming ? "hsl(var(--primary-fg))" : "hsl(var(--muted-fg))",
            fontSize: 11.5, fontWeight: 500, transition: "background 0.2s",
            cursor: input.trim() && !streaming ? "pointer" : "default"
          }}>
          <window.SendIcon size={11} />
          send
        </button>
      </form>

      {messages.length === 0 && (
        <div style={{
          padding: "0 14px 14px", display: "flex", gap: 8, flexWrap: "wrap"
        }}>
          {suggested.map(s => (
            <button key={s}
              onClick={() => send(s)}
              style={{
                fontSize: 11.5, padding: "5px 11px", borderRadius: 999,
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--muted-fg))",
                background: "hsl(var(--muted) / 0.4)",
                transition: "color 0.15s, border-color 0.15s, background 0.15s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "hsl(var(--fg))";
                e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)";
                e.currentTarget.style.background = "hsl(var(--primary) / 0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "hsl(var(--muted-fg))";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
                e.currentTarget.style.background = "hsl(var(--muted) / 0.4)";
              }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatMsg({ m }) {
  const isUser = m.role === "user";
  return (
    <div className="msg" style={{
      display: "flex", gap: 12, alignItems: "flex-start"
    }}>
      <span style={{
        fontSize: 10.5,
        color: isUser ? "hsl(var(--muted-fg))" : "hsl(var(--primary))",
        flexShrink: 0, minWidth: 50, paddingTop: 2,
        letterSpacing: 0.5, textTransform: "uppercase"
      }}>
        {isUser ? "you →" : "← andy"}
      </span>
      <span style={{
        flex: 1,
        color: isUser ? "hsl(var(--fg) / 0.72)" : "hsl(var(--fg))",
        fontSize: 13.5, lineHeight: 1.6
      }} className={m.pending ? "stream-caret" : ""}>
        {m.content || (m.pending ? "" : "")}
      </span>
    </div>
  );
}

async function typeOut(text, cb) {
  const step = Math.max(1, Math.ceil(text.length / 120));
  for (let i = step; i <= text.length; i += step) {
    cb(text.slice(0, i));
    await new Promise(r => setTimeout(r, 14));
  }
  cb(text);
}

window.Chat = Chat;
