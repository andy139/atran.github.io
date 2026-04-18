/* sections.jsx — Navbar, Hero, NowTicker, Work, About, Footer */
const { useState: sUseState, useEffect: sUseEffect, useRef: sUseRef } = React;

/* ---------------- Navbar ---------------- */
function Navbar() {
  const [dog, setDog] = sUseState(false);
  const t = sUseRef(0);
  const poke = () => {
    setDog(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setDog(false), 1600);
  };
  const items = ["work", "writing", "now", "brain"];

  return (
    <nav style={{
      position: "fixed", top: 22, left: "50%", transform: "translateX(-50%)",
      maxWidth: 720, width: "calc(100% - 32px)", zIndex: 50
    }}>
      <div className="glass" style={{
        borderRadius: 999, padding: "9px 16px 9px 18px",
        display: "flex", alignItems: "center", gap: 14, fontSize: 13
      }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span>andy</span>
          <span onMouseEnter={poke}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: dog ? 70 : 10, transition: "min-width 0.3s, color 0.3s",
              color: dog ? "hsl(var(--primary))" : "hsl(var(--fg))",
              fontSize: dog ? 10.5 : 13,
              whiteSpace: "nowrap",
              fontFamily: dog ? "'Instrument Serif', serif" : "inherit",
              fontStyle: dog ? "italic" : "normal"
            }}
            title="hover me">
            {dog ? "·hi mady·" : "/"}
          </span>
          <span className="blink amber">█</span>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 22 }}>
          {items.map(it => (
            <a key={it} href={`#${it}`}
               style={{ color: "hsl(var(--fg) / 0.62)", transition: "color 0.15s" }}
               onMouseEnter={e => e.currentTarget.style.color = "hsl(var(--fg))"}
               onMouseLeave={e => e.currentTarget.style.color = "hsl(var(--fg) / 0.62)"}>
              {it}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <CircleBtn label="GitHub" href="https://github.com/andy139"><window.GithubIcon size={13} /></CircleBtn>
          <CircleBtn label="X" href="#"><window.XIcon size={11} /></CircleBtn>
        </div>
      </div>
    </nav>
  );
}

function CircleBtn({ children, label, href = "#" }) {
  return (
    <a href={href} title={label} aria-label={label}
       target={href.startsWith("http") ? "_blank" : undefined}
       style={{
         width: 28, height: 28, borderRadius: 999,
         display: "inline-flex", alignItems: "center", justifyContent: "center",
         color: "hsl(var(--fg) / 0.75)",
         background: "rgba(255,255,255,0.04)",
         border: "1px solid rgba(255,255,255,0.07)",
         transition: "all 0.2s"
       }}
       onMouseEnter={e => {
         e.currentTarget.style.color = "hsl(var(--primary))";
         e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.4)";
       }}
       onMouseLeave={e => {
         e.currentTarget.style.color = "hsl(var(--fg) / 0.75)";
         e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
       }}>
      {children}
    </a>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden"
    }}>
      <window.DotGrid density={26} />

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 780, margin: "0 auto",
        padding: "170px 24px 100px"
      }}>
        <window.Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "6px 13px 6px 10px", borderRadius: 999,
            background: "hsl(var(--muted) / 0.65)",
            border: "1px solid hsl(var(--border))",
            fontSize: 11.5, color: "hsl(var(--muted-fg))",
            letterSpacing: 0.2
          }}>
            <span className="pulse-halo" style={{
              width: 6, height: 6, borderRadius: 999, background: "hsl(var(--ok))"
            }} />
            <span>SF — open to work · building since '22</span>
          </div>
        </window.Reveal>

        <h1 className="sans" style={{
          marginTop: 28,
          fontSize: "clamp(38px, 5.8vw, 72px)",
          lineHeight: 1.04,
          letterSpacing: "-0.03em",
          fontWeight: 500
        }}>
          <window.BlurText
            text="I build real tools for the people |actually in my life.|"
            stagger={55} start={150} />
        </h1>

        <window.Reveal delay={500}>
          <p style={{
            marginTop: 30, maxWidth: 560,
            fontSize: 14.5, lineHeight: 1.65,
            color: "hsl(var(--fg) / 0.65)"
          }}>
            full-stack engineer, 4 years shipping. lately: an AI sports picks
            SaaS, a voice-to-estimate system for my dad's auto shop, and the
            chat box right below this one.
          </p>
        </window.Reveal>

        <window.Reveal delay={700}>
          <window.Chat />
        </window.Reveal>
      </div>

      <div style={{
        position: "absolute", bottom: 26, left: "50%",
        transform: "translateX(-50%)",
        fontSize: 10, color: "hsl(var(--muted-fg))",
        letterSpacing: 3, textTransform: "uppercase", zIndex: 10,
        display: "flex", alignItems: "center", gap: 8
      }}>
        <span>scroll</span>
        <span style={{
          width: 24, height: 1, background: "hsl(var(--muted-fg))"
        }} />
      </div>
    </section>
  );
}

/* ---------------- Now Ticker ---------------- */
const TICKER = [
  { emoji: "🏈", name: "finessepicks",   status: "AI sports picks · sharp money engine", when: "1h ago",    color: "hsl(36 92% 62%)" },
  { emoji: "🔧", name: "shop-ai",        status: "voice→estimate pipeline",        when: "3h ago",    color: "hsl(200 80% 65%)" },
  { emoji: "🎮", name: "vl-bot",         status: "raid signups for 100+ maplers",  when: "yesterday", color: "hsl(280 70% 68%)" },
  { emoji: "🧠", name: "andys-brain",    status: "RAG over notes + github",        when: "5h ago",    color: "hsl(140 55% 60%)" },
  { emoji: "📬", name: "sourcing-agent", status: "scoring greenhouse/lever/ashby", when: "today",     color: "hsl(36 92% 62%)" },
  { emoji: "⚙️", name: "orch",           status: "sub-agent tool allowlists",      when: "1d ago",    color: "hsl(340 70% 65%)" },
];

function NowTicker() {
  const loop = [...TICKER, ...TICKER];
  return (
    <section id="now" className="marquee" style={{
      padding: "54px 0 56px",
      borderTop: "1px solid hsl(var(--border))",
      borderBottom: "1px solid hsl(var(--border))",
      overflow: "hidden", position: "relative",
      background: "linear-gradient(180deg, hsl(var(--bg)) 0%, hsl(var(--muted) / 0.3) 50%, hsl(var(--bg)) 100%)",
      "--marquee-speed": "55s"
    }}>
      <window.Reveal style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 40px", marginBottom: 22,
        fontSize: 11, color: "hsl(var(--muted-fg))",
        letterSpacing: 3, textTransform: "uppercase"
      }}>
        <span className="pulse-halo" style={{
          width: 6, height: 6, borderRadius: 999, background: "hsl(var(--ok))"
        }} />
        <span>now — live from github</span>
        <span style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />
        <span>{TICKER.length} repos tracked</span>
      </window.Reveal>

      <div style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)"
      }}>
        <div className="marquee-track" style={{ gap: 14, paddingInline: 20 }}>
          {loop.map((it, i) => <TickerCard key={i} {...it} />)}
        </div>
      </div>
    </section>
  );
}

function TickerCard({ emoji, name, status, when, color }) {
  return (
    <div className="glass" style={{
      width: 320, flexShrink: 0,
      borderRadius: 12, padding: "13px 16px",
      display: "flex", flexDirection: "column", gap: 4, fontSize: 12.5
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
        <span style={{ color, fontWeight: 500, letterSpacing: -0.2 }}>{name}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "hsl(var(--muted-fg))", display: "flex", alignItems: "center", gap: 5 }}>
          <window.CommitIcon size={10} />
          {when}
        </span>
      </div>
      <div style={{ color: "hsl(var(--fg) / 0.62)", fontSize: 11.5 }}>
        {status}
      </div>
    </div>
  );
}

/* ---------------- Selected Work ---------------- */
const WORKS = [
  {
    n: "01", title: "FinessePicks", subtitle: "AI sports picks SaaS",
    story: "ai-generated sports picks that actually track what wins. pinnacle vs public-book comparison flags sharp money, confidence scores adjust live. stripe subs, twitter bot in my voice, real users betting real money on the record.",
    tags: ["Next.js", "Claude API", "Stripe", "Postgres"],
    kind: "finesse",
    href: "https://finessepicks.com"
  },
  {
    n: "02", title: "Voice-to-Estimate", subtitle: "for AC Auto Clinic",
    story: "my dad reads off a list of parts and the system writes the estimate. it took him a week to trust it. now he uses it every morning before the first customer walks in.",
    tags: ["TypeScript", "Claude API", "Twilio", "Whisper"],
    kind: "shop",
    href: "#"
  },
  {
    n: "03", title: "AI Assistant Orchestrator", subtitle: "sub-agent delegation",
    story: "sub-agent delegation with tool allowlisting and sms confirmation. because i got tired of one-shot agents that nuke my inbox. every destructive action pings my phone before it fires.",
    tags: ["Next.js", "Claude", "Postgres", "Redis"],
    kind: "orch",
    href: "#"
  },
  {
    n: "04", title: "Bougie Guild Tools", subtitle: "discord ops for 100+ maplers",
    story: "one discord bot, one raid scheduler, zero spreadsheet drama. it remembers who ran what, cooldowns, and which nerd keeps rolling pass on the good loot.",
    tags: ["Discord.py", "Supabase", "Cron", "Python"],
    kind: "discord",
    href: "#"
  },
  {
    n: "05", title: "Job Sourcing Agent", subtitle: "built during my own search",
    story: "polls greenhouse/lever/ashby and scores listings against my resume. it's still running. if it pings you about a job, my resume already matched.",
    tags: ["Python", "Pydantic", "pgvector", "OpenAI"],
    kind: "agent",
    href: "#"
  }
];

function Work() {
  return (
    <section id="work" style={{
      padding: "120px 24px 80px", maxWidth: 1180, margin: "0 auto"
    }}>
      <window.Reveal style={{ marginBottom: 80 }}>
        <div style={{
          fontSize: 11, color: "hsl(var(--muted-fg))",
          letterSpacing: 3, textTransform: "uppercase", marginBottom: 18
        }}>
          / selected work
        </div>
        <h2 className="sans" style={{
          fontSize: "clamp(32px, 4.2vw, 52px)",
          letterSpacing: "-0.025em", lineHeight: 1.1, fontWeight: 500,
          maxWidth: 720
        }}>
          Five things i actually built,{" "}
          <span className="serif-italic" style={{ color: "hsl(var(--fg) / 0.55)" }}>
            for people i actually know.
          </span>
        </h2>
      </window.Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 110 }}>
        {WORKS.map((w, i) => (
          <WorkRow key={w.n} w={w} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function WorkRow({ w, flip }) {
  return (
    <window.Reveal>
      <div style={{
        display: "grid",
        gridTemplateColumns: flip ? "1fr 1fr" : "1fr 1fr",
        gap: 56,
        alignItems: "center"
      }}>
        <div style={{ order: flip ? 2 : 1 }}>
          <div style={{
            fontSize: 11, color: "hsl(var(--primary))",
            letterSpacing: 3, marginBottom: 14, textTransform: "uppercase"
          }}>
            {w.n} / {w.subtitle}
          </div>
          <h3 className="sans" style={{
            fontSize: "clamp(26px, 2.6vw, 34px)",
            letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 18,
            lineHeight: 1.15
          }}>
            {w.title}
          </h3>
          <p style={{
            fontSize: 13.5, lineHeight: 1.75,
            color: "hsl(var(--fg) / 0.7)",
            maxWidth: 480, marginBottom: 22
          }}>
            {w.story}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {w.tags.map((t, i) => (
              <React.Fragment key={t}>
                <span style={{ fontSize: 11.5, color: "hsl(var(--muted-fg))" }}>{t}</span>
                {i < w.tags.length - 1 && (
                  <span style={{ color: "hsl(var(--border))" }}>•</span>
                )}
              </React.Fragment>
            ))}
            <span style={{ flex: 1 }} />
            <a href={w.href || "#"}
               target={w.href && w.href.startsWith("http") ? "_blank" : undefined}
               className="link-amber" style={{
              fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 5
            }}>
              {w.href && w.href.startsWith("http") ? "view live" : "view repo"} <window.ExternalIcon size={10} />
            </a>
          </div>
        </div>

        <div style={{ order: flip ? 1 : 2 }}>
          <WorkFrame kind={w.kind} />
        </div>
      </div>
    </window.Reveal>
  );
}

function WorkFrame({ kind }) {
  return (
    <div className="work-frame glass" style={{
      borderRadius: 14, padding: 14,
      aspectRatio: "4 / 3", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 12, left: 16,
        display: "flex", gap: 5, zIndex: 2
      }}>
        {["#ef5e5e", "#f0b54a", "#5cc86f"].map((c, i) => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: 999, background: c, opacity: 0.75
          }} />
        ))}
      </div>
      <div style={{
        position: "absolute", inset: 14, top: 36,
        borderRadius: 8, overflow: "hidden",
        background: "hsl(var(--bg))",
        border: "1px solid hsl(var(--border))"
      }}>
        {kind === "finesse" && <FinesseMock />}
        {kind === "shop" && <ShopMock />}
        {kind === "orch" && <OrchMock />}
        {kind === "discord" && <DiscordMock />}
        {kind === "agent" && <AgentMock />}
      </div>
    </div>
  );
}

/* placeholder screenshots, drawn in CSS/JSX */
function FinesseMock() {
  const picks = [
    { matchup: "LAL -3.5 vs BOS", book: "PIN 1.91 · DK 1.87",   edge: "sharp", conf: 0.88, won: true },
    { matchup: "KC ML @ BUF",     book: "PIN 2.05 · FD 2.12",   edge: "public", conf: 0.72, won: true },
    { matchup: "UNDER 48.5 NYK",  book: "PIN 1.95 · MGM 1.90",  edge: "sharp",  conf: 0.81, won: null },
  ];
  return (
    <div style={{ padding: 14, fontSize: 10.5, fontFamily: "Geist Mono", color: "hsl(var(--fg) / 0.85)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "hsl(var(--muted-fg))", letterSpacing: 2, textTransform: "uppercase" }}>
          FinessePicks · today's board
        </div>
        <div style={{
          fontSize: 9, color: "hsl(var(--primary))",
          padding: "2px 6px", borderRadius: 4,
          border: "1px solid hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.1)"
        }}>
          PRO
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {picks.map((p, i) => (
          <div key={i} style={{
            padding: "7px 9px",
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            background: "hsl(var(--muted) / 0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                fontSize: 8.5,
                padding: "1px 5px", borderRadius: 3,
                background: p.edge === "sharp" ? "hsl(var(--primary) / 0.18)" : "hsl(var(--muted))",
                color: p.edge === "sharp" ? "hsl(var(--primary))" : "hsl(var(--muted-fg))",
                letterSpacing: 1, textTransform: "uppercase"
              }}>
                {p.edge}
              </span>
              <span style={{ fontSize: 10.5, color: "hsl(var(--fg))", fontWeight: 500 }}>
                {p.matchup}
              </span>
              <span style={{ flex: 1 }} />
              {p.won === true && (
                <span style={{ fontSize: 9, color: "hsl(var(--ok))" }}>✓ won</span>
              )}
              {p.won === null && (
                <span style={{ fontSize: 9, color: "hsl(var(--muted-fg))" }}>live</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "hsl(var(--muted-fg))" }}>
              <span>{p.book}</span>
              <span className="amber">conf {p.conf.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 10, padding: "6px 9px",
        background: "hsl(var(--primary) / 0.1)",
        borderRadius: 5,
        display: "flex", justifyContent: "space-between",
        border: "1px solid hsl(var(--primary) / 0.25)",
        fontSize: 10
      }}>
        <span>record · last 30d</span>
        <span className="amber" style={{ fontWeight: 600 }}>62-41 · +14.3u</span>
      </div>
    </div>
  );
}

function ShopMock() {
  return (
    <div style={{ padding: 18, fontSize: 10.5, fontFamily: "Geist Mono", color: "hsl(var(--fg) / 0.85)" }}>
      <div style={{ fontSize: 10, color: "hsl(var(--muted-fg))", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
        AC Auto Clinic · Estimate #2486
      </div>
      <div style={{ fontSize: 13, marginBottom: 12, color: "hsl(var(--primary))", fontFamily: "Geist" }}>
        2019 Honda Civic — brake job
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          ["Front brake pads", "$ 84.00"],
          ["Rear rotors (pair)", "$ 156.00"],
          ["Brake fluid flush", "$ 42.00"],
          ["Labor · 2.4h", "$ 288.00"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between",
            padding: "4px 0", borderBottom: "1px dashed hsl(var(--border))" }}>
            <span style={{ color: "hsl(var(--fg) / 0.85)" }}>{k}</span>
            <span className="muted">{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "7px 10px",
        background: "hsl(var(--primary) / 0.12)", borderRadius: 6,
        display: "flex", justifyContent: "space-between",
        border: "1px solid hsl(var(--primary) / 0.3)" }}>
        <span>total</span>
        <span className="amber" style={{ fontWeight: 600 }}>$ 570.00</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 9.5, color: "hsl(var(--muted-fg))", display: "flex", alignItems: "center", gap: 5 }}>
        <span className="pulse-halo" style={{ width: 5, height: 5, borderRadius: 999, background: "hsl(var(--ok))" }} />
        transcribed · 00:38 · accuracy 98.2%
      </div>
    </div>
  );
}

function OrchMock() {
  return (
    <div style={{ padding: 16, fontSize: 10, fontFamily: "Geist Mono", color: "hsl(var(--fg) / 0.85)" }}>
      <div style={{ fontSize: 9.5, color: "hsl(var(--muted-fg))", marginBottom: 10, letterSpacing: 2 }}>
        ORCHESTRATOR · run #4.112
      </div>
      {[
        ["→ plan", "ok", "hsl(var(--ok))"],
        ["  ├ email-agent", "read 3 threads", "hsl(var(--fg))"],
        ["  ├ calendar-agent", "found slot tue 3p", "hsl(var(--fg))"],
        ["  └ draft-agent", "reply pending confirm", "hsl(var(--primary))"],
        ["→ sms confirm", "sent to +1·510", "hsl(var(--primary))"],
        ["  └ user reply", "✓ go ahead", "hsl(var(--ok))"],
        ["→ execute", "sent · 2.3s", "hsl(var(--ok))"],
      ].map((r, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between",
          padding: "4px 0", fontSize: 10.5
        }}>
          <span style={{ color: r[2] }}>{r[0]}</span>
          <span className="muted">{r[1]}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, padding: 7, background: "hsl(var(--muted))", borderRadius: 5,
        fontSize: 9.5, color: "hsl(var(--muted-fg))" }}>
        tools: gmail.send, calendar.create · allowlisted
      </div>
    </div>
  );
}

function DiscordMock() {
  return (
    <div style={{ padding: 14, fontSize: 10.5, fontFamily: "Geist Mono" }}>
      <div style={{ fontSize: 10, color: "hsl(var(--muted-fg))", marginBottom: 8, letterSpacing: 2 }}>
        #raid-signups · BOUGIE GUILD
      </div>
      <div style={{ padding: "8px 10px", background: "hsl(var(--muted) / 0.5)", borderRadius: 6, marginBottom: 6,
        borderLeft: "2px solid hsl(280 70% 68%)" }}>
        <div style={{ fontSize: 11, color: "hsl(280 70% 78%)", fontWeight: 500 }}>vl-bot</div>
        <div style={{ fontSize: 11, marginTop: 3, color: "hsl(var(--fg) / 0.9)" }}>
          Cvellum raid — fri 8:30p PT
        </div>
        <div style={{ fontSize: 10, color: "hsl(var(--muted-fg))", marginTop: 4 }}>
          6/6 signed · waitlist: 3
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {["✅ ninaaa", "✅ xoSasuke", "✅ bigPappa", "✅ 9s", "✅ mad9y", "✅ kiloo"].map(n => (
          <span key={n} style={{
            fontSize: 9.5, padding: "2px 6px", borderRadius: 4,
            background: "hsl(140 55% 55% / 0.15)", color: "hsl(140 55% 70%)"
          }}>{n}</span>
        ))}
      </div>
      <div style={{ fontSize: 9.5, color: "hsl(var(--muted-fg))" }}>
        next: Lotus · sun 9p · reminder in 2h
      </div>
    </div>
  );
}

function AgentMock() {
  return (
    <div style={{ padding: 16, fontSize: 10.5, fontFamily: "Geist Mono" }}>
      <div style={{ fontSize: 9.5, color: "hsl(var(--muted-fg))", marginBottom: 10, letterSpacing: 2 }}>
        JOB SOURCING · 04:17 am
      </div>
      {[
        { co: "Anthropic",    role: "Product Eng",       score: 0.91 },
        { co: "Vercel",       role: "Platform / Infra",  score: 0.86 },
        { co: "Linear",       role: "Full-stack",        score: 0.79 },
        { co: "Replit",       role: "Agents team",       score: 0.77 },
      ].map((j, i) => (
        <div key={i} style={{ padding: "6px 0", display: "flex", alignItems: "center", gap: 10,
          borderBottom: i < 3 ? "1px dashed hsl(var(--border))" : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "hsl(var(--fg))" }}>{j.co}</div>
            <div style={{ fontSize: 9.5, color: "hsl(var(--muted-fg))" }}>{j.role}</div>
          </div>
          <div style={{
            width: 54, height: 4, borderRadius: 99,
            background: "hsl(var(--muted))", overflow: "hidden"
          }}>
            <div style={{ width: `${j.score * 100}%`, height: "100%",
              background: j.score > 0.85 ? "hsl(var(--primary))" : "hsl(var(--fg) / 0.4)" }} />
          </div>
          <span className="amber" style={{ fontSize: 10, width: 28, textAlign: "right" }}>{j.score.toFixed(2)}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, fontSize: 9.5, color: "hsl(var(--muted-fg))" }}>
        47 scanned · 4 matched · 0 sent to trash
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="writing" style={{
      padding: "100px 24px 80px", maxWidth: 780, margin: "0 auto"
    }}>
      <window.Reveal>
        <div style={{
          fontSize: 11, color: "hsl(var(--muted-fg))",
          letterSpacing: 3, textTransform: "uppercase", marginBottom: 22
        }}>
          / about
        </div>
        <div className="sans" style={{
          fontSize: "clamp(22px, 2.6vw, 30px)",
          lineHeight: 1.45, letterSpacing: "-0.02em",
          color: "hsl(var(--fg) / 0.88)", fontWeight: 400
        }}>
          i ship things for{" "}
          <span className="serif-italic amber">people i know</span>{" "}
          first. my dad. my friends. the 100+ maplers in my discord. the
          degens on my finessepicks sub. it keeps the feedback loop short
          and the bullshit low. recruiters: i like small teams that ship
          on fridays.
        </div>

        <div style={{
          marginTop: 44, display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24
        }}>
          {[
            ["4 yrs", "shipping"],
            ["~12", "prod projects"],
            ["1", "very judgemental dog"]
          ].map(([k, v]) => (
            <div key={v} style={{
              padding: "18px 20px", borderRadius: 10,
              background: "hsl(var(--muted) / 0.4)",
              border: "1px solid hsl(var(--border))"
            }}>
              <div className="sans" style={{
                fontSize: 26, letterSpacing: "-0.02em", fontWeight: 500,
                color: "hsl(var(--primary))"
              }}>
                {k}
              </div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-fg))", marginTop: 4 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </window.Reveal>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer style={{
      padding: "70px 24px 50px",
      borderTop: "1px solid hsl(var(--border))",
      background: "hsl(var(--muted) / 0.2)"
    }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{
            fontSize: 11, color: "hsl(var(--muted-fg))",
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 18
          }}>
            / get in touch
          </div>
          <h2 className="sans" style={{
            fontSize: "clamp(30px, 4vw, 46px)",
            letterSpacing: "-0.025em", lineHeight: 1.1, fontWeight: 500,
            marginBottom: 18
          }}>
            looking for{" "}
            <span className="serif-italic amber">my next one.</span>
          </h2>
          <p style={{
            fontSize: 14, lineHeight: 1.7,
            color: "hsl(var(--fg) / 0.65)", maxWidth: 520, marginBottom: 30
          }}>
            small teams, real users, agent-ish infra. if that's you — say hi.
          </p>
          <a href="mailto:andytran1140@gmail.com" className="link-amber" style={{
            fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8
          }}>
            <window.MailIcon size={14} />
            andytran1140@gmail.com
          </a>

          <div style={{
            marginTop: 60, display: "flex", justifyContent: "space-between",
            alignItems: "center", fontSize: 11,
            color: "hsl(var(--muted-fg))", flexWrap: "wrap", gap: 16
          }}>
            <div>© 2026 andy tran · built in SF</div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://github.com/andy139" target="_blank" className="link-amber" style={{ borderBottomColor: "transparent" }}>github</a>
              <a href="https://www.linkedin.com/in/andy139/" target="_blank" className="link-amber" style={{ borderBottomColor: "transparent" }}>linkedin</a>
              <a href="https://finessepicks.com" target="_blank" className="link-amber" style={{ borderBottomColor: "transparent" }}>finessepicks</a>
              <a href="https://drive.google.com/file/d/1S4CK1MtJIsGy16YhnTOfpNwi4HDF_hTi/view?usp=drive_link" target="_blank" className="link-amber" style={{ borderBottomColor: "transparent" }}>resume</a>
            </div>
          </div>
        </window.Reveal>
      </div>
    </footer>
  );
}

Object.assign(window, { Navbar, Hero, NowTicker, Work, About, Footer });
