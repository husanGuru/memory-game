import { CARD_IMAGES } from './data/cards.js';
import { createGame, flipCard, hideMismatchedCards, FLIP_RESULT } from './game/game.js';
import { formatDate, getTopResults, saveResult } from './storage/leaderboard.js';
import { createBoard } from './ui/board.js';
import { createModal } from './ui/modal.js';
import { el } from './utils/dom.js';

const modal = createModal();
const board = createBoard(handleCardClick);
const movesValue = el('span', { className: 'stat__value' });
const pairsValue = el('span', { className: 'stat__value' });

let game;
let hideTimer = null;

function makeButton(text, onClick, className = 'btn') {
  return el('button', { className, attrs: { type: 'button' }, text, on: { click: onClick } });
}

function randomHideDelay() {
  return 700 + Math.random() * 800;
}

function renderCounters() {
  movesValue.textContent = String(game.moves);
  pairsValue.textContent = `${game.matchedPairs} из ${game.totalPairs}`;
}

function startNewGame() {
  clearTimeout(hideTimer);
  hideTimer = null;
  modal.close();
  game = createGame(CARD_IMAGES);
  board.setCards(game.cards);
  renderCounters();
}

function handleCardClick(cardId) {
  if (modal.isOpen()) return;

  const result = flipCard(game, cardId);
  if (result === FLIP_RESULT.IGNORED) return;

  board.update();
  renderCounters();

  if (result === FLIP_RESULT.MISMATCH) {
    hideTimer = setTimeout(() => {
      hideMismatchedCards(game);
      hideTimer = null;
      board.update();
    }, randomHideDelay());
  }

  if (result === FLIP_RESULT.WIN) {
    saveResult(game.moves);
    showWinDialog();
  }
}

function showWinDialog() {
  modal.open({
    title: 'Победа!',
    body: [el('p', { className: 'modal__text', text: `Вы нашли все пары за ${game.moves} ходов.` })],
    actions: [
      makeButton('Новая игра', startNewGame, 'btn btn--primary'),
      makeButton('Закрыть', () => modal.close()),
    ],
  });
}

function buildResultsTable(results) {
  const headers = ['Место', 'Ходы', 'Дата'].map((text) => el('th', { text }));
  const rows = results.map((result, index) => el('tr', { children: [
    el('td', { text: String(index + 1) }),
    el('td', { text: String(result.moves) }),
    el('td', { text: formatDate(result.finishedAt) }),
  ] }));

  return el('table', { className: 'results', children: [
    el('thead', { children: [el('tr', { children: headers })] }),
    el('tbody', { children: rows }),
  ] });
}

function showLeaderboard() {
  const results = getTopResults();
  const content = results.length
    ? buildResultsTable(results)
    : el('p', { className: 'modal__text', text: 'Пока нет результатов' });

  modal.open({
    title: 'Таблица лидеров',
    body: [content],
    actions: [makeButton('Закрыть', () => modal.close())],
  });
}

function createHeader() {
  return el('header', { className: 'header', children: [
    el('h1', { className: 'header__title', text: 'Поиск пар' }),
    el('div', { className: 'header__buttons', children: [
      makeButton('Новая игра', startNewGame),
      makeButton('Таблица лидеров', showLeaderboard),
    ] }),
  ] });
}

function createStats() {
  return el('div', { className: 'stats', children: [
    el('p', { className: 'stat', children: [el('span', { text: 'Ходы: ' }), movesValue] }),
    el('p', { className: 'stat', children: [el('span', { text: 'Найдено пар: ' }), pairsValue] }),
  ] });
}

document.body.append(
  el('main', { className: 'app', children: [createHeader(), createStats(), board.element] }),
);
startNewGame();
