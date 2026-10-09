(function () {
  const L = (window.KAMDRIDI_LINKS || {});

  function getByPath(obj, path) {
    return path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);
  }

  document.querySelectorAll('[data-link]').forEach((el) => {
    const key = el.getAttribute('data-link');
    const url = getByPath(L, key);
    if (!url) return;

    if (el.tagName === 'A') {
      el.href = url;
      el.target = url.startsWith('http') ? '_blank' : el.target;
      el.rel = url.startsWith('http') ? 'noopener noreferrer' : el.rel;
    } else {
      el.addEventListener('click', () => window.open(url, '_blank', 'noopener'));
      el.style.cursor = 'pointer';
    }
  });
})();
