/* components.jsx — icons, reveal, BlurText, DotGrid */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Icons ---------- */
const Icon = ({ size = 16, stroke = 1.6, children, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);
const GithubIcon = (p) => (
  <Icon {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 2.5 5.4 2.5a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8.9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
  </Icon>
);
const XIcon = (p) => (<Icon {...p}><path d="M4 4l16 16M20 4L4 20"/></Icon>);
const MailIcon = (p) => (<Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Icon>);
const ArrowIcon = (p) => (<Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>);
const SendIcon = (p) => (<Icon {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></Icon>);
const SparkIcon = (p) => (<Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Icon>);
const ExternalIcon = (p) => (<Icon {...p}><path d="M7 17L17 7"/><path d="M8 7h9v9"/></Icon>);
const TerminalIcon = (p) => (<Icon {...p}><path d="M4 17l5-5-5-5M12 19h8"/></Icon>);
const CommitIcon = (p) => (<Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6"/></Icon>);

/* ---------- Reveal on scroll ---------- */
function Reveal({ as: Tag = "div", className = "", delay = 0, children, style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // Fallback: if element is already in the viewport on mount, trigger immediately.
    const r = el.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) {
      requestAnimationFrame(() => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`}
         style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- BlurText ---------- */
function BlurText({ text, className = "", stagger = 55, start = 150 }) {
  // Split by pipes for italic spans: |italic part|. Preserve surrounding whitespace.
  const parts = useMemo(() => {
    const out = [];
    const tokens = text.split(/(\|[^|]+\|)/g);
    tokens.forEach(tok => {
      if (!tok) return;
      const italic = tok.startsWith("|") && tok.endsWith("|");
      const inner = italic ? tok.slice(1, -1) : tok;
      // Split keeping whitespace as separate tokens so we can re-emit it.
      inner.split(/(\s+)/).forEach(piece => {
        if (!piece) return;
        if (/^\s+$/.test(piece)) {
          out.push({ space: true });
        } else {
          out.push({ w: piece, italic });
        }
      });
    });
    return out;
  }, [text]);

  const rootRef = useRef(null);
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const trigger = () => {
      el.querySelectorAll(".blur-word").forEach((w, i) => {
        setTimeout(() => w.classList.add("in"), start + i * stagger);
      });
    };
    const r = el.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) {
      requestAnimationFrame(trigger);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { trigger(); io.unobserve(el); }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [stagger, start]);

  return (
    <span ref={rootRef} className={className}>
      {parts.map((p, i) => p.space ? (
        <span key={i}>{" "}</span>
      ) : (
        <span key={i} className={`blur-word ${p.italic ? "serif-italic" : ""}`}
              style={p.italic ? { color: "hsl(var(--fg) / 0.55)" } : undefined}>
          {p.w}
        </span>
      ))}
    </span>
  );
}

/* ---------- Dot grid hero canvas ---------- */
function DotGrid({ density = 28 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t0 = performance.now();
    let dots = [];

    const rebuild = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(w / density) + 2;
      const rows = Math.ceil(h / density) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            ox: c * density,
            oy: r * density,
            p: Math.random() * Math.PI * 2,
            s: 0.4 + Math.random() * 0.7
          });
        }
      }
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => { mouseRef.current.active = false; };

    const loop = (t) => {
      const dt = (t - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const active = mouseRef.current.active;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const driftX = Math.cos(dt * 0.22 * d.s + d.p) * 3;
        const driftY = Math.sin(dt * 0.19 * d.s + d.p) * 3;
        let x = d.ox + driftX;
        let y = d.oy + driftY;

        let near = 0;
        if (active) {
          const dx = mx - x, dy = my - y;
          const r = 150;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < r * r) {
            const dist = Math.sqrt(dist2);
            const f = 1 - dist / r;
            x += dx * f * 0.18;
            y += dy * f * 0.18;
            near = f;
          }
        }

        // base warm dot + amber highlight near cursor
        const baseA = 0.22 + 0.18 * Math.sin(dt * 0.5 + d.p);
        const rad = 1.0 + near * 1.2;
        const alpha = baseA + near * 0.6;
        ctx.beginPath();
        const hue = near > 0.2 ? 36 : 34;
        const sat = near > 0.2 ? 92 : 30;
        const light = near > 0.2 ? 62 : 68;
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rebuild();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("resize", rebuild);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return <canvas id="dot-canvas" ref={canvasRef} />;
}

/* Export to window */
Object.assign(window, {
  GithubIcon, XIcon, MailIcon, ArrowIcon, SendIcon, SparkIcon, ExternalIcon, TerminalIcon, CommitIcon,
  Reveal, BlurText, DotGrid
});
