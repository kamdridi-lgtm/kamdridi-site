/* KAMDRIDI — Merch Store JS (clean + minimal)
   - Scroll reveal (IntersectionObserver)
   - Stripe checkout buttons open in new tab securely
*/
(function(){
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const catalog = window.KAM_DRIDI_PRODUCTS || {};

  if(!reduced){
    const targets = Array.from(document.querySelectorAll(".section, .card, .bundle, .hero-inner"));
    targets.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -10% 0px"});
    targets.forEach(el => io.observe(el));
  }

  document.addEventListener("click", (ev)=>{
    const btn = ev.target.closest("[data-checkout], [data-disabled]");
    if(!btn) return;
    const productKey = btn.getAttribute("data-product");
    const product = productKey ? catalog[productKey] : null;
    if(btn && btn.hasAttribute("data-disabled")){ alert("Coming soon."); return; }
    const url = btn.getAttribute("data-checkout");
    if(!url) return;

    if (product) {
      try {
        sessionStorage.setItem("kamdridi:last-product", JSON.stringify(product));
      } catch (_) {
        // Ignore storage issues and keep checkout flow moving.
      }
    }

    // Placeholder guard
    if(url.startsWith("REPLACE_WITH_STRIPE_LINK")){
      alert("Admin: add your Stripe link or Stripe price_id in merch.html (data-checkout).");
      return;
    }

    // If a Stripe price_id is provided, create a Checkout Session via Netlify Function
    if(url.startsWith("price_")){
      btn.disabled = true;
      btn.classList.add("loading");
      fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          priceId: url,
          quantity: 1,
          mode: btn.getAttribute("data-mode") || "payment",
          cancelPath: btn.getAttribute("data-cancel") || "/merch.html",
          productKey,
          productName: product ? product.name : "",
          successPath: "/success.html"
        })
      })
      .then(r => r.json())
      .then(({ url: checkoutUrl, error }) => {
        if(error || !checkoutUrl) throw new Error(error || "No checkout URL returned");
        window.location.href = checkoutUrl;
      })
      .catch(() => alert("Checkout error: please try again or contact support."))
      .finally(() => { btn.disabled = false; btn.classList.remove("loading"); });
      return;
    }

    // Otherwise treat as a Stripe Payment Link URL
    window.open(url, "_blank", "noopener,noreferrer");
  });
})();
