(function () {
  function disable(el) {
    if (!el || el.dataset._disabled) return;
    el.dataset._disabled = '1';
    el.classList.add('is-disabled');
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('tabindex', '-1');
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    });
  }

  function isExternalHref(href) {
    if (!href) return false;
    try {
      const u = new URL(href, window.location.href);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  function isSamePageAnchor(href) {
    if (!href || href[0] !== '#') return false;
    const id = href.slice(1);
    return !!document.getElementById(id);
  }

  // Smooth-scroll for valid in-page anchors
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (isSamePageAnchor(href)) {
      e.preventDefault();
      document.getElementById(href.slice(1)).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Disable dead links (no href, '#', '#missing', empty)
  function auditLinks() {
    document.querySelectorAll('a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').trim();
      const hasDataLink = !!a.getAttribute('data-link');
      if (hasDataLink) return; // apply-links.js will handle
      if (!href || href === '#') return disable(a);
      if (href[0] === '#') {
        if (!document.getElementById(href.slice(1))) return disable(a);
        return;
      }
      // Internal relative or external URLs are fine
      if (isExternalHref(href)) return;
    });
  }

  function injectDisabledStyle() {
    const css = ".is-disabled{opacity:.45;pointer-events:none;cursor:default;filter:grayscale(1);} .is-disabled *{pointer-events:none;}";
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectDisabledStyle();
    // run after apply-links sets hrefs
    setTimeout(auditLinks, 60);

    // Contact quick-send (mailto) if fields exist
    const form = document.getElementById('contactForm');
    if (form) {
      const send = form.querySelector('[data-send]');
      if (send) {
        send.addEventListener('click', function () {
          const name = (form.querySelector('[name="name"]')?.value || '').trim();
          const email = (form.querySelector('[name="email"]')?.value || '').trim();
          const msg = (form.querySelector('[name="message"]')?.value || '').trim();
          const subject = encodeURIComponent('Kam Dridi — Contact');
          const body = encodeURIComponent((name ? `Name: ${name}\n` : '') + (email ? `Email: ${email}\n\n` : '') + (msg || ''));
          window.location.href = `mailto:contact@kamdridi.com?subject=${subject}&body=${body}`;
        });
      }
    }
  });
})();