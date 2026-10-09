(function () {
  const doc = document.documentElement;
  doc.classList.add("is-enhanced");

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dustContainer = document.createElement("div");
  dustContainer.className = "dust-layer";
  document.body.appendChild(dustContainer);

  function normalizeHashNavigation() {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  }

  function onInternalLinkClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", href);
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  }

  function burstDust(event) {
    if (prefersReduced) return;
    const trigger = event.target.closest(".btn, .card, .iconbtn, [data-dust]");
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const pointX = event.clientX || rect.left + rect.width / 2;
    const pointY = event.clientY || rect.top + rect.height / 2;
    const particleCount = Math.max(20, Math.min(40, Math.round(rect.width / 10)));

    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "dust-particle";
      particle.style.left = `${pointX}px`;
      particle.style.top = `${pointY}px`;
      particle.style.setProperty("--dust-x", `${(Math.random() - 0.5) * 46}px`);
      particle.style.setProperty("--dust-y", `${(Math.random() - 0.7) * 34}px`);
      particle.style.width = `${3 + Math.random() * 5}px`;
      particle.style.height = particle.style.width;
      particle.style.background = [
        "rgba(191, 160, 104, 0.86)",
        "rgba(154, 128, 84, 0.72)",
        "rgba(214, 188, 136, 0.82)"
      ][Math.floor(Math.random() * 3)];
      dustContainer.appendChild(particle);
      window.setTimeout(() => particle.remove(), 620);
    }
  }

  document.addEventListener("click", onInternalLinkClick);
  document.addEventListener("pointerdown", burstDust, { passive: true });
  window.addEventListener("hashchange", normalizeHashNavigation);
  window.addEventListener("load", normalizeHashNavigation, { once: true });
})();
