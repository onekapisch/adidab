export type PredictionDirection = "higher" | "lower";

export type PredictionHistoryItem = {
  date: string;
  prediction: PredictionDirection;
  priceStart: number;
  priceEnd: number;
  result: "win" | "loss";
};

export type PredictionState = {
  currentPrediction: {
    direction: PredictionDirection;
    priceAtPrediction: number;
    timestamp: number;
    resolveAt: number;
  } | null;
  history: PredictionHistoryItem[];
  stats: {
    wins: number;
    losses: number;
    currentStreak: number;
    bestStreak: number;
  };
};

const STORAGE_KEY = "adidab:prediction";

export const defaultPredictionState: PredictionState = {
  currentPrediction: null,
  history: [],
  stats: {
    wins: 0,
    losses: 0,
    currentStreak: 0,
    bestStreak: 0,
  },
};

export function loadPredictionState(): PredictionState {
  if (typeof window === "undefined") return defaultPredictionState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPredictionState;
    const parsed = JSON.parse(raw) as PredictionState;
    return {
      ...defaultPredictionState,
      ...parsed,
      history: parsed.history ?? [],
    };
  } catch {
    return defaultPredictionState;
  }
}

export function savePredictionState(state: PredictionState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createPrediction(
  state: PredictionState,
  direction: PredictionDirection,
  price: number,
  timestamp = Date.now()
) {
  return {
    ...state,
    currentPrediction: {
      direction,
      priceAtPrediction: price,
      timestamp,
      resolveAt: timestamp + 24 * 60 * 60 * 1000,
    },
  };
}

export function resolvePrediction(
  state: PredictionState,
  priceNow: number,
  timestamp = Date.now()
) {
  const current = state.currentPrediction;
  if (!current || timestamp < current.resolveAt) {
    return state;
  }

  const isWin =
    current.direction === "higher"
      ? priceNow > current.priceAtPrediction
      : priceNow < current.priceAtPrediction;
  const result: "win" | "loss" = isWin ? "win" : "loss";
  const wins = state.stats.wins + (isWin ? 1 : 0);
  const losses = state.stats.losses + (isWin ? 0 : 1);
  const currentStreak = isWin ? state.stats.currentStreak + 1 : 0;
  const bestStreak = Math.max(state.stats.bestStreak, currentStreak);
  const date = new Date(current.timestamp).toISOString().slice(0, 10);

  const history: PredictionHistoryItem[] = [
    {
      date,
      prediction: current.direction,
      priceStart: current.priceAtPrediction,
      priceEnd: priceNow,
      result,
    },
    ...state.history,
  ].slice(0, 30);

  return {
    currentPrediction: null,
    history,
    stats: {
      wins,
      losses,
      currentStreak,
      bestStreak,
    },
  };
}
