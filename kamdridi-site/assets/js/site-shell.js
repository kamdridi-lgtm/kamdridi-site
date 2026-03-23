(function () {
  const site = window.KAMDRIDI_SITE || {};
  const routes = site.routes || {};
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  function routeFor(key) {
    return routes[key] || null;
  }

  function routeEnabled(route) {
    return Boolean(route && route.enabled && route.href);
  }

  function routeMatches(route) {
    if (!route) return false;
    const matches = Array.isArray(route.match) ? route.match : [];
    return matches.some((match) => {
      const normalized = String(match || "").replace(/\/+$/, "") || "/";
      return normalized === currentPath;
    });
  }

  function disableElement(el, label) {
    if (label) {
      if (el.dataset.useFallbackLabel === "1" || !el.textContent.trim()) {
        el.textContent = label;
      }
    }

    el.classList.add("is-disabled-link");
    el.setAttribute("aria-disabled", "true");

    if (el.tagName === "A") {
      el.removeAttribute("href");
      el.setAttribute("tabindex", "-1");
    } else if (el.tagName === "BUTTON") {
      el.disabled = true;
    }
  }

  function hideElement(el) {
    const target = el.closest("[data-route-wrap]") || el;
    target.hidden = true;
  }

  function renderNavLinks(keys, withHints) {
    return keys
      .map((key) => {
        const route = routeFor(key);
        if (!routeEnabled(route)) return "";
        const active = routeMatches(route) ? ' aria-current="page"' : "";
        const activeClass = routeMatches(route) ? " is-active" : "";

        if (withHints) {
          const hint = route.hint ? `<span class="hint">${route.hint}</span>` : "";
          return `<li><a href="${route.href}" class="${activeClass.trim()}"${active}><span>${route.label}</span>${hint}</a></li>`;
        }

        return `<a href="${route.href}" class="site-nav__link${activeClass}"${active}>${route.label}</a>`;
      })
      .join("");
  }

  document.querySelectorAll("[data-site-nav]").forEach((nav) => {
    const keys = (nav.dataset.navKeys || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const navKeys = keys.length ? keys : site.nav || [];
    nav.innerHTML = renderNavLinks(navKeys, false);
  });

  document.querySelectorAll("[data-site-menu]").forEach((menu) => {
    const keys = (menu.dataset.menuKeys || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const menuKeys = keys.length ? keys : site.menu || site.nav || [];
    menu.innerHTML = renderNavLinks(menuKeys, true);
  });

  document.querySelectorAll("[data-route-key]").forEach((el) => {
    const route = routeFor(el.dataset.routeKey);
    const shouldHide = (el.dataset.hideWhenDisabled || "").toLowerCase() === "true"
      || (route && route.hideWhenDisabled === true);

    if (!routeEnabled(route)) {
      if (shouldHide) {
        hideElement(el);
      } else {
        disableElement(el, route && route.fallbackLabel ? route.fallbackLabel : "Coming soon");
      }
      return;
    }

    if (el.tagName === "A") {
      el.href = route.href;
      if (route.href.startsWith("http")) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    }
  });

  document.querySelectorAll("img[data-safe-image]").forEach((img) => {
    img.addEventListener("error", () => {
      const target = img.closest("[data-image-wrap]") || img;
      target.hidden = true;
    });
  });

  const gallery = document.querySelector("[data-photo-gallery]");
  if (gallery && Array.isArray(site.photos)) {
    gallery.innerHTML = site.photos
      .map(
        (photo, index) => `
          <button class="gallery-card" type="button" data-photo-index="${index}">
            <span class="gallery-media" data-image-wrap>
              <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" data-safe-image>
            </span>
            <span class="gallery-caption">${photo.caption}</span>
          </button>
        `
      )
      .join("");

    const lightbox = document.querySelector("[data-photo-lightbox]");
    const lightboxImage = lightbox ? lightbox.querySelector("img") : null;

    gallery.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-photo-index]");
      if (!trigger || !lightbox || !lightboxImage) return;
      const photo = site.photos[Number(trigger.dataset.photoIndex)];
      if (!photo) return;

      lightbox.hidden = false;
      lightbox.classList.add("is-open");
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;
      document.body.classList.add("has-lightbox");
    });

    document.querySelectorAll("[data-photo-close]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.hidden = true;
        lightbox.classList.remove("is-open");
        lightboxImage.src = "";
        document.body.classList.remove("has-lightbox");
      });
    });

    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
          const close = lightbox.querySelector("[data-photo-close]");
          if (close) close.click();
        }
      });
    }
  }

  const mediaFeature = document.querySelector("[data-media-feature]");
  if (mediaFeature) {
    const media = site.media || {};

    if (media.featuredEmbed) {
      mediaFeature.innerHTML = `
        <div class="media-embed">
          <iframe src="${media.featuredEmbed}" title="${media.title || "Official media"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      `;
    } else {
      mediaFeature.innerHTML = `
        <div class="status-card">
          <div class="status-chip">Official media</div>
          <h2>${media.status || "Official media coming soon"}</h2>
          <p>${media.body || ""}</p>
          <div class="button-row">
            <a class="btn primary" href="${window.KAMDRIDI_LINKS.youtubeChannel}" target="_blank" rel="noopener">Open YouTube channel</a>
            <a class="btn" href="/photos">Open press photos</a>
            <a class="btn" href="/press">Open press page</a>
          </div>
        </div>
      `;
    }
  }
})();
