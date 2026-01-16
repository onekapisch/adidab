const FEAR_GREED_BASE = "https://api.alternative.me/fng/";

type FearGreedApiPoint = {
  value: string;
  value_classification: string;
  timestamp: string;
};

type FearGreedApiResponse = {
  name: string;
  data: FearGreedApiPoint[];
};

export type FearGreedPoint = {
  value: number;
  classification: string;
  timestamp: string;
};

export type FearGreedData = {
  value: number | null;
  classification: string | null;
  timestamp: string | null;
  history: FearGreedPoint[];
  updatedAt: string;
};

async function fetchJson<T>(url: string, revalidateSeconds = 3600) {
  try {
    const response = await fetch(url, {
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getFearGreedIndex(limit = 30): Promise<FearGreedData> {
  const response = await fetchJson<FearGreedApiResponse>(
    `${FEAR_GREED_BASE}?limit=${limit}&format=json`,
    3600
  );

  const rawPoints = response?.data ?? [];
  const points = rawPoints
    .map((point) => ({
      value: Number(point.value),
      classification: point.value_classification,
      timestamp: point.timestamp,
    }))
    .filter((point) => Number.isFinite(point.value));

  const sorted = points.slice().reverse();
  const latest = points[0];

  return {
    value: latest?.value ?? null,
    classification: latest?.classification ?? null,
    timestamp: latest?.timestamp ?? null,
    history: sorted,
    updatedAt: new Date().toISOString(),
  };
}
