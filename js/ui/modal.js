import { el } from '../utils/dom.js';

export function createModal() {
  let overlay = null;
  let previousOverflow = '';

  function handleKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function handleOverlayClick(event) {
    if (event.target === overlay) close();
  }

  function open({ title, body = [], actions = [] }) {
    if (overlay) return;

    overlay = el('div', {
      className: 'modal-overlay',
      on: { click: handleOverlayClick },
      children: [
        el('div', {
          className: 'modal',
          attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
          children: [
            el('h2', { className: 'modal__title', text: title }),
            ...body,
            el('div', { className: 'modal__actions', children: actions }),
          ],
        }),
      ],
    });

    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.append(overlay);
    document.addEventListener('keydown', handleKeydown);
  }

  function close() {
    if (!overlay) return;

    overlay.remove();
    overlay = null;
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handleKeydown);
  }

  function isOpen() {
    return overlay !== null;
  }

  return { open, close, isOpen };
}
