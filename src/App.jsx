
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Heart, X, ChevronLeft, ChevronRight,
  Mail, Sparkles, Send
} from "lucide-react";
import cfg from "./data/loveConfig.js";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65 }
};

function Floaters() {
  const reduceMotion = useReducedMotion();
  const items = useRef(Array.from({ length: 20 }, (_, i) => ({
    emoji: ["💗", "✨", "🌸", "⭐", "💖"][i % 5],
    left: (i * 37 + 11) % 100,
    delay: (i % 9) * 1.1,
    size: 13 + (i % 4) * 4,
    duration: 13 + (i % 5) * 2
  }))).current;

  if (reduceMotion) return null;

  return (
    <div className="floaters" aria-hidden="true">
      {items.map((item, i) => (
        <span key={i} style={{
          left: `${item.left}%`,
          fontSize: item.size,
          animationDelay: `-${item.delay}s`,
          animationDuration: `${item.duration}s`
        }}>{item.emoji}</span>
      ))}
    </div>
  );
}

function Burst({ burstKey }) {
  const reduceMotion = useReducedMotion();
  if (!burstKey || reduceMotion) return null;

  return (
    <div className="burst" key={burstKey} aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} style={{
          left: `${(i * 29 + 7) % 100}%`,
          animationDelay: `${(i % 8) * 0.09}s`,
          fontSize: 15 + (i % 4) * 5
        }}>{["💗", "💖", "💕", "❤️"][i % 4]}</span>
      ))}
    </div>
  );
}

function Cat({ color = "#f9c6d0", flip = false, sleep = false, size = 110 }) {
  const ink = "#5b3a4a";

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
      role="img" aria-label="A cute blushing cat"
      className="cat-svg"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M80 82c20-4 16-32 4-30" stroke={color} strokeWidth="9"
        fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="76" rx="26" ry="20" fill={color} />
      <polygon points="24,40 27,10 46,28" fill={color} />
      <polygon points="76,40 73,10 54,28" fill={color} />
      <polygon points="29,33 30,19 39,28" fill="#ffb3c1" />
      <polygon points="71,33 70,19 61,28" fill="#ffb3c1" />
      <ellipse cx="50" cy="48" rx="28" ry="24" fill={color} />
      {sleep
        ? <path d="M33 46q5 4 10 0M57 46q5 4 10 0"
            stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : <>
            <circle cx="38" cy="46" r="3.5" fill={ink} />
            <circle cx="62" cy="46" r="3.5" fill={ink} />
          </>}
      <ellipse cx="29" cy="56" rx="6" ry="3.5" fill="#ff8fa3" opacity=".7" />
      <ellipse cx="71" cy="56" rx="6" ry="3.5" fill="#ff8fa3" opacity=".7" />
      <path d="M46 55q4 4 8 0" stroke={ink} strokeWidth="2"
        fill="none" strokeLinecap="round" />
      <circle cx="50" cy="53" r="2" fill="#ff7d96" />
      <path d="M23 53l-12-2M24 57l-11 2M77 53l12-2M76 57l11 2"
        stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Scene({ mode = "walk" }) {
  const reduceMotion = useReducedMotion();
  const walk = mode === "walk";
  const leftMotion = walk && !reduceMotion ? { x: [-70, 7, 7, -70] } : { x: 7 };
  const rightMotion = walk && !reduceMotion ? { x: [70, -7, -7, 70] } : { x: -7 };
  const movement = walk && !reduceMotion
    ? { duration: 7, repeat: Infinity, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }
    : { duration: 0.01 };

  return (
    <div className={`scene scene-${mode}`}>
      {mode === "moon" && <>
        <span className="moon" aria-hidden="true">🌙</span>
        {[10, 25, 70, 85, 50].map((left, i) => (
          <span key={i} className="star"
            style={{
              left: `${left}%`,
              top: `${8 + (i % 3) * 14}%`,
              animationDelay: `${i * 0.4}s`
            }} aria-hidden="true">✨</span>
        ))}
      </>}
      <div className="cats-row">
        <motion.div animate={{ ...leftMotion, y: reduceMotion ? 0 : [0, -4, 0] }}
          transition={{ ...movement, y: { duration: 2, repeat: reduceMotion ? 0 : Infinity } }}>
          <Cat sleep={mode === "sleep"} />
        </motion.div>
        <motion.div animate={{ ...rightMotion, y: reduceMotion ? 0 : [0, -4, 0] }}
          transition={{ ...movement, y: { duration: 2.3, repeat: reduceMotion ? 0 : Infinity } }}>
          <Cat color="#d9c9f5" flip sleep={mode === "sleep"} />
        </motion.div>
      </div>
      {mode === "sleep" && <>
        <span className="blanket" aria-hidden="true" />
        <span className="zzz" aria-hidden="true">Z z z</span>
      </>}
      {mode !== "sleep" && !reduceMotion && [0, 1, 2].map(i => (
        <span key={i} className="mini-heart"
          style={{
            left: `calc(50% + ${(i - 1) * 24}px)`,
            animationDelay: `${i * 0.8}s`
          }} aria-hidden="true">💗</span>
      ))}
      {mode === "hug" && <span className="hug-label">a little love, just for you 💗</span>}
    </div>
  );
}

function MusicPlayer({ playing, muted, missing, toggle, setMuted }) {
  return (
    <div className="player glass" role="region" aria-label="Music player">
      <span className={`disc ${playing ? "spin" : ""}`} aria-hidden="true">💿</span>
      <div className="song">
        <strong>{cfg.music.title}</strong>
        {missing && <small>Check your song file at {cfg.music.file} 🎵</small>}
      </div>
      <span className={`bars ${playing ? "on" : ""}`} aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <button type="button" onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}>
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button type="button" onClick={() => setMuted(value => !value)}
        aria-label={muted ? "Unmute music" : "Mute music"}>
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

function CatsSection() {
  const [index, setIndex] = useState(0);
  const modes = ["walk", "sleep", "moon"];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex(value => value + 1), 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="sec" id="cats">
      <motion.h2 {...fade}>Two Little Hearts 🐾</motion.h2>
      <motion.div className="glass card center cat-card" {...fade}>
        <AnimatePresence mode="wait">
          <motion.div key={index % modes.length}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}>
            <Scene mode={modes[index % modes.length]} />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={index % cfg.catCaptions.length}
            className="script big-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}>
            {cfg.catCaptions[index % cfg.catCaptions.length]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Gallery() {
  const [openIndex, setOpenIndex] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const photos = cfg.photos;
  const move = direction =>
    setOpenIndex(current => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    if (openIndex === null) return undefined;

    const handleKey = event => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, photos.length]);

  function Photo({ photo, index, large = false }) {
    if (brokenImages[index]) {
      return (
        <div className="ph" role="img"
          aria-label={`Photo placeholder for ${photo.caption}`}>
          🐱💕<small>Add {photo.file.split("/").pop()}</small>
        </div>
      );
    }

    return (
      <img src={photo.file} alt={photo.caption} loading="lazy"
        className={large ? "big" : ""}
        onError={() => setBrokenImages(current => ({ ...current, [index]: true }))} />
    );
  }

  return (
    <section className="sec" id="gallery">
      <motion.h2 {...fade}>Our Little World Together 💞</motion.h2>
      <p className="section-intro">
        A few little moments I wish I could keep in my pocket forever.
      </p>

      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <motion.button
            type="button"
            key={`${photo.file}-${index}`}
            {...fade}
            whileHover={{ y: -5, scale: 1.02 }}
            className="polaroid"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open photo: ${photo.caption}`}>
            <span className="sticker" aria-hidden="true">💗</span>
            <Photo photo={photo} index={index} />
            <span className="cap">{photo.caption}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && photos.length > 0 && (
          <motion.div className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button type="button" className="lb-btn close-btn"
              aria-label="Close photo viewer"
              onClick={() => setOpenIndex(null)}><X /></button>

            {photos.length > 1 && <>
              <button type="button" className="lb-btn prev-btn"
                aria-label="Previous photo"
                onClick={event => { event.stopPropagation(); move(-1); }}>
                <ChevronLeft />
              </button>
              <button type="button" className="lb-btn next-btn"
                aria-label="Next photo"
                onClick={event => { event.stopPropagation(); move(1); }}>
                <ChevronRight />
              </button>
            </>}

            <AnimatePresence mode="wait">
              <motion.figure key={openIndex} className="polaroid lbfig"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={event => event.stopPropagation()}>
                <Photo photo={photos[openIndex]} index={openIndex} large />
                <figcaption className="cap">{photos[openIndex].caption}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Timeline() {
  return (
    <section className="sec" id="timeline">
      <motion.h2 {...fade}>Our Little Love Story 🌷</motion.h2>
      <p className="section-intro">
        Not a perfect story. Just ours — and every small moment means something to me.
      </p>
      <ol className="timeline">
        {cfg.timeline.map((item, index) => (
          <motion.li key={`${item.title}-${index}`} {...fade} className="glass card">
            <Heart size={16} className="dot" aria-hidden="true" />
            <small>{item.date}</small>
            <h3 className="script">{item.title}</h3>
            <p>{item.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Reasons() {
  const [revealed, setRevealed] = useState([]);
  const toggleReason = index =>
    setRevealed(current => current.includes(index)
      ? current.filter(item => item !== index)
      : [...current, index]);

  return (
    <section className="sec" id="reasons">
      <motion.h2 {...fade}>Reasons I Love You 💗</motion.h2>
      <p className="section-intro">
        Tap a little heart. Each one is hiding a tiny piece of what you mean to me.
      </p>
      <div className="reasons-grid">
        {cfg.reasons.map((reason, index) => {
          const isOpen = revealed.includes(index);

          return (
            <motion.button type="button" key={`${reason.title}-${index}`}
              className={`reason-card glass ${isOpen ? "revealed" : ""}`}
              onClick={() => toggleReason(index)} aria-expanded={isOpen}>
              <motion.span className="beating-heart"
                animate={isOpen ? { scale: [1, 1.16, 1] } : { scale: [1, 1.07, 1] }}
                transition={{ duration: isOpen ? 0.45 : 1.4, repeat: isOpen ? 0 : Infinity }}
                aria-hidden="true">💗</motion.span>
              <strong>{reason.title}</strong>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span className="reason-text"
                    initial={{ opacity: 0, height: 0, y: 6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 4 }}>
                    {reason.text}
                  </motion.span>
                )}
              </AnimatePresence>
              <small>{isOpen ? "tap to hide" : "tap to open"}</small>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function Letter() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setText(cfg.letter.slice(0, index));
      if (index >= cfg.letter.length) window.clearInterval(timer);
    }, 22);

    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <section className="sec center" id="letter">
      <motion.h2 {...fade}>A Letter For You 💌</motion.h2>
      <p className="section-intro">
        Some things are easier to write when I imagine you reading them.
      </p>
      {!open ? (
        <motion.button type="button" className="envelope"
          whileHover={{ scale: 1.04 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2.4 } }}
          onClick={() => setOpen(true)} aria-label="Open the love letter">
          <Mail size={52} /><span>Tap to open 💗</span>
        </motion.button>
      ) : (
        <motion.div className="glass card letter"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }} aria-live="polite">
          <p>{text}</p>
        </motion.div>
      )}
    </section>
  );
}

function OpenWhen() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="sec" id="open-when">
      <motion.h2 {...fade}>Open When... 💌</motion.h2>
      <p className="section-intro">
        For the days when I can't be right beside you, I hope these little letters can be.
      </p>
      <div className="stack">
        {cfg.openWhen.map((letter, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.article key={letter.title} className="glass open-card" {...fade}>
              <button type="button" className="open-trigger"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}>
                <span className="open-icon"><Mail size={19} /></span>
                <span>{letter.title}</span>
                <span className={`chevron ${isOpen ? "turned" : ""}`} aria-hidden="true">⌄</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div className="open-letter"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeInOut" }}>
                    <p>{letter.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Slogans() {
  const [index, setIndex] = useState(0);
  const slogans = cfg.slogans;

  useEffect(() => {
    if (slogans.length < 2) return undefined;
    const timer = window.setInterval(
      () => setIndex(current => (current + 2) % slogans.length), 4600
    );
    return () => window.clearInterval(timer);
  }, [slogans.length]);

  return (
    <section className="sec center" id="slogans">
      <motion.h2 {...fade}>Little Whispers 💖</motion.h2>
      <div className="glass card slogan-card" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}>
            <p className="script big-text">{slogans[index]}</p>
            {slogans.length > 1 && (
              <p className="script big-text secondary-slogan">
                {slogans[(index + 1) % slogans.length]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Promises() {
  return (
    <section className="sec" id="promises">
      <motion.h2 {...fade}>My Promises To You 🤍</motion.h2>
      <p className="section-intro">
        Not grand promises about being perfect — just little things I want to keep choosing, every day.
      </p>
      <div className="promise-grid">
        {cfg.promises.map((promise, index) => (
          <motion.article key={`${promise.title}-${index}`}
            className="glass promise-card" {...fade}
            transition={{ duration: 0.6, delay: index * 0.07 }}>
            <span className="promise-number">0{index + 1}</span>
            <Sparkles size={19} aria-hidden="true" />
            <h3>{promise.title}</h3>
            <p>{promise.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function LoveButtons() {
  const [step, setStep] = useState(-1);
  const [burst, setBurst] = useState(0);
  const [hug, setHug] = useState(false);
  const hugTimer = useRef(null);
  const steps = cfg.loveSteps;

  useEffect(() => () => window.clearTimeout(hugTimer.current), []);

  const clickLove = () => {
    const next = step + 1 >= steps.length ? -1 : step + 1;
    setStep(next);
    if (next === steps.length - 1) setBurst(value => value + 1);
  };

  const sendHug = () => {
    setHug(true);
    setBurst(value => value + 1);
    window.clearTimeout(hugTimer.current);
    hugTimer.current = window.setTimeout(() => setHug(false), 3200);
  };

  return (
    <section className="sec center" id="love-buttons">
      <Burst burstKey={burst} />
      <motion.h2 {...fade}>A Little Love, Just for You 🫶</motion.h2>
      <div className="glass card love-actions">
        <motion.button type="button" className="glow"
          whileHover={{ scale: 1.04 }} onClick={clickLove}>
          How Much Do You Love Me? 💗
        </motion.button>
        <div className="answer" aria-live="polite">
          <AnimatePresence mode="wait">
            {step >= 0 && (
              <motion.p key={step} className="script big-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}>{steps[step]}</motion.p>
            )}
          </AnimatePresence>
        </div>
        <button type="button" className="glow alt" onClick={sendHug}>
          <Send size={17} /> Send You a Hug 🤗
        </button>
      </div>
      <AnimatePresence>
        {hug && (
          <motion.div className="hug" initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
            <Scene mode="hug" />
            <p className="script big-text">
              A big warm hug, until I can give you a real one 🤗
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Surprise() {
  const [show, setShow] = useState(false);
  const [burst, setBurst] = useState(0);

  return (
    <section className="sec center" id="surprise">
      <Burst burstKey={burst} />
      <motion.h2 {...fade}>One Last Thing, My Love...</motion.h2>
      <p className="section-intro">I saved one more little piece of my heart for you.</p>
      {!show ? (
        <motion.button type="button" className="glow"
          whileHover={{ scale: 1.05 }}
          onClick={() => { setShow(true); setBurst(value => value + 1); }}>
          Click for Your Surprise 💝
        </motion.button>
      ) : (
        <motion.div className="glass card night"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}>
          <p className="big-text">{cfg.finalMessage}</p>
          <Scene mode="moon" />
          <motion.p className="script big-text"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.2 }}>
            {cfg.finalLine}
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [missing, setMissing] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => { setPlaying(true); setMissing(false); })
      .catch(() => { setPlaying(false); setMissing(true); });
  };

  const toggleMusic = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      playMusic();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={cfg.music.file} loop preload="metadata"
        onError={() => setMissing(true)} />
      <Floaters />
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.main key="welcome" className="welcome"
            exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.65 }}>
            <span className="welcome-kicker">
              <Sparkles size={15} /> a tiny world made for you <Sparkles size={15} />
            </span>
            <motion.h1 className="script"
              initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
              Hey, My Favorite Person ❤️
            </motion.h1>
            <p>I made a little something just for you...</p>
            <Scene mode="hug" />
            <motion.button type="button" className="glow"
              whileHover={{ scale: 1.05 }}
              onClick={() => { setEntered(true); playMusic(); }}>
              Open Your Little Love World 💗
            </motion.button>
            <small className="hint">Psst... there's something special waiting for you.</small>
          </motion.main>
        ) : (
          <motion.main key="world" className="world"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}>
            <header className="hero">
              <span className="hero-sparkles" aria-hidden="true">✧･ﾟ: *✧･ﾟ:* 💗 *:･ﾟ✧*:･ﾟ✧</span>
              <h1 className="script">For {cfg.herName} 💗</h1>
              <p>From {cfg.yourName} · Just because I love you 💗</p>
              <div className="glass why-note">
                <Heart size={19} fill="currentColor" aria-hidden="true" />
                <p>{cfg.whyNote}</p>
              </div>
            </header>
            <CatsSection />
            <Gallery />
            <Timeline />
            <Reasons />
            <Letter />
            <OpenWhen />
            <Slogans />
            <Promises />
            <LoveButtons />
            <Surprise />
            <footer>
              Made with <Heart size={14} fill="currentColor" aria-label="love" />
              by {cfg.yourName}, with all my heart.
            </footer>
            <MusicPlayer playing={playing} muted={muted} missing={missing}
              toggle={toggleMusic} setMuted={setMuted} />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
