import { motion } from "framer-motion";

// Original SVG cat. Change colors here to match you two!
export function Cat({ c = "#f9c6d0", flip = false, sleep = false, size = 110 }) {
  const ink = "#5b3a4a";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="A cute blushing cat"
         style={{ transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M80 82c20-4 16-32 4-30" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="76" rx="26" ry="20" fill={c} />
      <polygon points="24,40 27,10 46,28" fill={c} /><polygon points="76,40 73,10 54,28" fill={c} />
      <polygon points="29,33 30,19 39,28" fill="#ffb3c1" /><polygon points="71,33 70,19 61,28" fill="#ffb3c1" />
      <ellipse cx="50" cy="48" rx="28" ry="24" fill={c} />
      {sleep
        ? <path d="M33 46q5 4 10 0M57 46q5 4 10 0" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : <><circle cx="38" cy="46" r="3.5" fill={ink} /><circle cx="62" cy="46" r="3.5" fill={ink} /></>}
      <ellipse cx="29" cy="56" rx="6" ry="3.5" fill="#ff8fa3" opacity=".65" />
      <ellipse cx="71" cy="56" rx="6" ry="3.5" fill="#ff8fa3" opacity=".65" />
      <path d="M46 55q4 4 8 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="53" r="2" fill="#ff7d96" />
    </svg>
  );
}

const Heart = ({ d = 0, x = 0 }) => (
  <motion.span aria-hidden className="mini-heart" style={{ left: `calc(50% + ${x}px)` }}
    animate={{ y: [0, -50], opacity: [0, 1, 0], scale: [0.6, 1.2] }}
    transition={{ duration: 2.4, repeat: Infinity, delay: d }}>💗</motion.span>
);

// mode: "walk" (walk + hug) | "sleep" (cuddle + Zzz) | "moon" (under moon & stars) | "hug" (static hug)
export function Scene({ mode = "walk" }) {
  const walk = mode === "walk";
  const L = walk ? { x: [-80, 8, 8, -80] } : { x: 8 };
  const R = walk ? { x: [80, -8, -8, 80] } : { x: -8 };
  const tr = walk ? { duration: 8, repeat: Infinity, times: [0, .4, .8, 1], ease: "easeInOut" } : {};
  return (
    <div className={`scene scene-${mode}`}>
      {mode === "moon" && <><span className="moon" aria-hidden>🌙</span>
        {[10, 25, 70, 85, 50].map((l, i) => <span key={i} className="star" style={{ left: l + "%", top: 8 + (i % 3) * 14 + "%", animationDelay: i * .4 + "s" }} aria-hidden>✨</span>)}</>}
      <div className="cats-row">
        <motion.div animate={{ ...L, y: mode === "sleep" ? 0 : [0, -4, 0] }} transition={{ ...tr, y: { duration: 2, repeat: Infinity } }}><Cat sleep={mode === "sleep"} /></motion.div>
        <motion.div animate={{ ...R, y: mode === "sleep" ? 0 : [0, -4, 0] }} transition={{ ...tr, y: { duration: 2.3, repeat: Infinity } }}><Cat c="#d9c9f5" flip sleep={mode === "sleep"} /></motion.div>
      </div>
      {mode === "sleep" && <><span className="blanket" aria-hidden /><span className="zzz" aria-hidden>Z z z</span></>}
      {mode !== "sleep" && [0, 1, 2].map(i => <Heart key={i} d={i * .8} x={(i - 1) * 24} />)}
    </div>
  );
}
