import { el } from '../utils/dom.js';

export function createBoard(onCardClick) {
  const element = el('div', { className: 'board' });
  let cards = [];
  let nodes = new Map();

  function setCards(newCards) {
    cards = newCards;
    nodes = new Map();

    const buttons = cards.map((card, index) => {
      const front = el('img', { className: 'card__front', attrs: { src: card.pairId, alt: '' } });
      const button = el('button', {
        className: 'card',
        attrs: { type: 'button', 'aria-label': `Карточка ${index + 1}` },
        on: { click: () => onCardClick(card.id) },
        children: [
          el('span', { className: 'card__inner', children: [
            el('span', { className: 'card__back' }),
            front,
          ] }),
        ],
      });
      nodes.set(card.id, button);
      return button;
    });

    element.replaceChildren(...buttons);
    update();
  }

  function update() {
    for (const card of cards) {
      const node = nodes.get(card.id);
      node.classList.toggle('is-open', card.isOpen);
      node.classList.toggle('is-matched', card.isMatched);
    }
  }

  return { element, setCards, update };
}
