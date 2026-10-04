const STORAGE_KEY = 'memory-game-results';
const MAX_RESULTS = 10;

export function loadResults() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveResult(moves) {
  const results = loadResults();
  results.push({ moves, finishedAt: Date.now() });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // localStorage может быть недоступен, тогда результат просто не сохранится
  }
}

export function getTopResults() {
  return loadResults()
    .sort((a, b) => a.moves - b.moves || a.finishedAt - b.finishedAt)
    .slice(0, MAX_RESULTS);
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}
