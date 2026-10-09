/* ------------------------------------------------------------
   PHASE 2 — Scroll Reveal (no libs)
   Applies a subtle fade+lift to sections as they enter viewport.
------------------------------------------------------------- */

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Targets: all major sections and cards
  const targets = [
    ...document.querySelectorAll("section.section, section.alt, section.hero, .grid, .card, article")
  ];

  // Add base class
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  targets.forEach((el) => io.observe(el));
})();


/* ------------------------------------------------------------
   PHASE 3 — Parallax Background (no libs)
   Applies to sections with [data-parallax="1"].
   Safe + lightweight. Disabled for reduced motion.
------------------------------------------------------------- */
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const sections = Array.from(document.querySelectorAll('section[data-parallax="1"]'));
  if (!sections.length) return;

  // Add a light sweep layer (visual only)
  sections.forEach((s) => {
    if (!s.querySelector(".light-sweep")) {
      const sweep = document.createElement("div");
      sweep.className = "light-sweep";
      s.prepend(sweep);
    }
  });

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function update() {
    const vh = window.innerHeight || 800;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      // progress: 0 when section enters bottom, 1 when leaves top
      const progress = clamp(1 - (rect.bottom / (vh + rect.height)), 0, 1);
      // shift background position subtly
      const y = Math.round( (progress * 18) ); // 0..18%
      // Keep X center; move Y a bit (adds "long photo" feel)
      sec.style.backgroundPosition = `center ${30 + y}%`;
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", update);
  update();
})();


/* ------------------------------------------------------------
   GO PLUS — Chapter Fade + SFX (tiny WebAudio)
   - Fade to black on internal nav jumps
   - Micro bass pulse on selected chapters (on view)
   - Soft UI ticks on hover/click (requires user gesture)
------------------------------------------------------------- */
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Overlay
  let fade = document.getElementById("chapterFade");
  if (!fade) {
    fade = document.createElement("div");
    fade.id = "chapterFade";
    document.body.appendChild(fade);
  }

  // WebAudio (created after user gesture)
  let audioCtx = null;
  const ensureAudio = () => {
    if (audioCtx) return audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
    return audioCtx;
  };

  const tick = (type = "hover") => {
    const ctx = ensureAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    // very low volume
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(type === "click" ? 0.03 : 0.015, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (type === "click" ? 0.08 : 0.05));

    o.type = "triangle";
    o.frequency.setValueAtTime(type === "click" ? 110 : 220, now);
    o.frequency.exponentialRampToValueAtTime(type === "click" ? 70 : 180, now + (type === "click" ? 0.08 : 0.05));

    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + (type === "click" ? 0.09 : 0.06));
  };

  // User gesture unlock
  window.addEventListener("pointerdown", () => {
    const ctx = ensureAudio();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }, { once: true });

  // Hover/click SFX on buttons/links (subtle)
  const bindSfx = () => {
    const nodes = document.querySelectorAll("a, button, .iconbtn, .chip, .btn");
    nodes.forEach((n) => {
      n.addEventListener("mouseenter", () => { if (!prefersReduced) tick("hover"); }, { passive: true });
      n.addEventListener("click", () => { tick("click"); }, { passive: true });
    });
  };

  // Chapter fade for internal anchors
  const isInternalHash = (href) => href && href.startsWith("#") && href.length > 1;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!isInternalHash(href)) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Fade in, jump, fade out
    fade.classList.add("on");
    window.setTimeout(() => {
      try { target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }); }
      catch { location.hash = href; }
    }, 120);

    window.setTimeout(() => fade.classList.remove("on"), 420);
  });

  // Bass pulse on view for key chapters
  const pulseTargets = document.querySelectorAll("#tour, #photos, #videos, #media");
  if (pulseTargets.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (prefersReduced) return;
        if (en.isIntersecting) en.target.classList.add("bass-pulse");
        else en.target.classList.remove("bass-pulse");
      });
    }, { threshold: 0.35 });
    pulseTargets.forEach((el) => io.observe(el));
  }

  // Init
  bindSfx();
})();



/* ------------------------------------------------------------
   Content Expand — Accordion (no libs)
------------------------------------------------------------- */
(function(){
  const root = document.querySelector('[data-accordion="1"]');
  if(!root) return;
  const btns = root.querySelectorAll('.acc-btn');
  btns.forEach((b)=>{
    b.addEventListener('click', ()=>{
      const panel = b.nextElementSibling;
      if(!panel) return;
      const open = panel.style.display === 'block';
      // close all
      root.querySelectorAll('.acc-panel').forEach(p=> p.style.display='none');
      if(!open) panel.style.display = 'block';
    });
  });
})();
