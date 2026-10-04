export const FLIP_RESULT = {
  IGNORED: 'ignored',
  FIRST: 'first',
  MATCH: 'match',
  MISMATCH: 'mismatch',
  WIN: 'win',
};

export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createGame(images) {
  const cards = shuffle(
    [...images, ...images].map((image, index) => ({
      id: index,
      pairId: image,
      isOpen: false,
      isMatched: false,
    })),
  );

  return {
    cards,
    openIds: [],
    moves: 0,
    matchedPairs: 0,
    totalPairs: images.length,
    isLocked: false,
    isFinished: false,
  };
}

function findCard(game, cardId) {
  return game.cards.find((card) => card.id === cardId);
}

export function flipCard(game, cardId) {
  if (game.isFinished || game.isLocked) return FLIP_RESULT.IGNORED;

  const card = findCard(game, cardId);
  if (!card || card.isOpen || card.isMatched) return FLIP_RESULT.IGNORED;

  card.isOpen = true;
  game.openIds.push(cardId);

  if (game.openIds.length === 1) return FLIP_RESULT.FIRST;

  game.moves += 1;
  const [firstCard, secondCard] = game.openIds.map((id) => findCard(game, id));

  if (firstCard.pairId === secondCard.pairId) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    game.openIds = [];
    game.matchedPairs += 1;

    if (game.matchedPairs === game.totalPairs) {
      game.isFinished = true;
      return FLIP_RESULT.WIN;
    }
    return FLIP_RESULT.MATCH;
  }

  game.isLocked = true;
  return FLIP_RESULT.MISMATCH;
}

export function hideMismatchedCards(game) {
  for (const id of game.openIds) {
    findCard(game, id).isOpen = false;
  }
  game.openIds = [];
  game.isLocked = false;
}
