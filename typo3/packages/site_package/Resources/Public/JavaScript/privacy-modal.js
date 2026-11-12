(() => {
  const dialog = document.querySelector('[data-privacy-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const content = dialog.querySelector('[data-privacy-content]');
  const closeButton = dialog.querySelector('[data-privacy-close]');
  const pageLink = dialog.querySelector('[data-privacy-page-link]');
  const cache = new Map();
  let opener;
  let activeUrl;
  let backdropPointerDown = false;

  const status = message => {
    const text = document.createElement('p');
    text.className = 'privacy-dialog__status';
    text.setAttribute('role', 'status');
    text.textContent = message;
    content.replaceChildren(text);
  };

  async function load(url) {
    if (cache.has(url)) return cache.get(url).cloneNode(true);
    const response = await fetch(url, { credentials: 'same-origin', headers: { Accept: 'text/html' } });
    if (!response.ok || new URL(response.url).origin !== location.origin) throw new Error('Privacy page unavailable');
    const document = new DOMParser().parseFromString(await response.text(), 'text/html');
    const source = document.querySelector('.cms-text .editorial-copy');
    if (!source || !source.textContent.trim()) throw new Error('Privacy content missing');
    const copy = source.cloneNode(true);
    copy.querySelectorAll('script,style,iframe,object,embed,base,link,form').forEach(node => node.remove());
    // Keep IDs unique and preserve in-document references when reusing the CMS content.
    const ids = new Map();
    copy.querySelectorAll('[id]').forEach(node => {
      const previous = node.id;
      node.id = `privacy-modal-${previous}`;
      ids.set(previous, node.id);
    });
    copy.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#') && ids.has(href.slice(1))) link.setAttribute('href', `#${ids.get(href.slice(1))}`);
      else link.setAttribute('href', new URL(href, response.url).href);
    });
    cache.set(url, copy);
    return copy.cloneNode(true);
  }

  async function open(link) {
    opener = link;
    activeUrl = link.href;
    const url = activeUrl;
    pageLink.href = url;
    content.scrollTop = 0;
    status('Die Datenschutzhinweise werden geladen …');
    dialog.setAttribute('aria-busy', 'true');
    dialog.showModal();
    document.body.classList.add('privacy-modal-open');
    closeButton.focus({ preventScroll: true });
    try {
      const copy = await load(url);
      if (dialog.open && activeUrl === url) content.replaceChildren(copy);
    } catch {
      if (dialog.open && activeUrl === url) status('Die Datenschutzhinweise konnten nicht geladen werden. Bitte öffnen Sie die Datenschutzerklärung über den Link unten. Ihre Formulareingaben bleiben erhalten.');
    } finally {
      if (activeUrl === url) dialog.removeAttribute('aria-busy');
    }
  }

  document.querySelectorAll('.cms-form[data-privacy-url]').forEach(form => {
    let privacyUrl;
    try { privacyUrl = new URL(form.dataset.privacyUrl, location.href); } catch { return; }
    form.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== privacyUrl.pathname.replace(/\/$/, '')) return;
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', dialog.id);
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (!dialog.open) open(link);
      });
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(node => node.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  const outsideDialog = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => {
    backdropPointerDown = event.target === dialog && outsideDialog(event);
  });
  dialog.addEventListener('pointercancel', () => { backdropPointerDown = false; });
  dialog.addEventListener('click', event => {
    if (backdropPointerDown && event.target === dialog && outsideDialog(event)) dialog.close();
    backdropPointerDown = false;
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    document.body.classList.remove('privacy-modal-open');
    opener?.focus({ preventScroll: true });
  });
})();
