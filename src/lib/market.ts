const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const BLOCKCHAIN_BASE = "https://api.blockchain.info";

export type MarketSummary = {
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  dominance: number | null;
  updatedAt: string;
};

export type HistoryData = {
  prices: number[];
  stats: {
    start: number;
    end: number;
    low: number;
    high: number;
  } | null;
  updatedAt: string;
};

export type HistorySeriesPoint = {
  timestamp: number;
  price: number;
};

export type HistorySeries = {
  series: HistorySeriesPoint[];
  updatedAt: string;
};

type PriceResponse = {
  bitcoin: Record<string, number>;
};

type GlobalResponse = {
  data: {
    market_cap_percentage: {
      btc: number;
    };
  };
};

type ChartResponse = {
  prices: [number, number][];
};

type BlockchainChartResponse = {
  values: { x: number; y: number }[];
};

async function fetchJson<T>(url: string, revalidateSeconds = 120) {
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

async function fetchHistorySeries(): Promise<HistorySeriesPoint[]> {
  const blockchainData = await fetchJson<BlockchainChartResponse>(
    `${BLOCKCHAIN_BASE}/charts/market-price?timespan=all&format=json`,
    3600
  );

  let series =
    blockchainData?.values
      ?.map((point) => ({
        timestamp: point.x * 1000,
        price: point.y,
      }))
      ?.filter((point) => Number.isFinite(point.price)) ?? [];

  if (!series.length) {
    const fallback = await fetchJson<ChartResponse>(
      `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=3650&interval=daily`,
      3600
    );
    series =
      fallback?.prices?.map(([timestamp, price]) => ({
        timestamp,
        price,
      })) ?? [];
  }

  return series;
}

export async function getBitcoinSummary(currency = "usd") {
  const currencyKey = currency.toLowerCase();
  const [priceData, globalData] = await Promise.all([
    fetchJson<PriceResponse>(
      `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=${currencyKey}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
      60
    ),
    fetchJson<GlobalResponse>(`${COINGECKO_BASE}/global`, 300),
  ]);

  const summary: MarketSummary = {
    price: priceData?.bitcoin?.[currencyKey] ?? null,
    marketCap: priceData?.bitcoin?.[`${currencyKey}_market_cap`] ?? null,
    volume24h: priceData?.bitcoin?.[`${currencyKey}_24h_vol`] ?? null,
    change24h: priceData?.bitcoin?.[`${currencyKey}_24h_change`] ?? null,
    dominance: globalData?.data?.market_cap_percentage?.btc ?? null,
    updatedAt: new Date().toISOString(),
  };

  return summary;
}

function downsampleSeries(data: number[], maxPoints: number) {
  if (data.length <= maxPoints) {
    return data;
  }
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

export async function getBitcoinChart(
  days: number | "max" = 30,
  maxPoints = 120,
  currency = "usd"
) {
  const revalidateSeconds = days === "max" ? 3600 : 600;
  const chartData = await fetchJson<ChartResponse>(
    `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=${currency}&days=${days}&interval=daily`,
    revalidateSeconds
  );

  if (!chartData?.prices?.length) {
    return [];
  }

  const prices = chartData.prices.map(([, price]) => price);
  return downsampleSeries(prices, maxPoints);
}

export async function getBitcoinHistory(): Promise<HistoryData> {
  const series = await fetchHistorySeries();

  if (!series.length) {
    return {
      prices: [],
      stats: null,
      updatedAt: new Date().toISOString(),
    };
  }

  const prices = series.map((point) => point.price);
  const nonZero = prices.filter((value) => value > 0);
  const sample = nonZero.length ? nonZero : prices;
  const stats = {
    start: nonZero[0] ?? prices[0],
    end: prices[prices.length - 1],
    low: Math.min(...sample),
    high: Math.max(...sample),
  };

  return {
    prices: downsampleSeries(prices, 360),
    stats,
    updatedAt: new Date().toISOString(),
  };
}

export async function getBitcoinHistorySeries(): Promise<HistorySeries> {
  const series = await fetchHistorySeries();

  return {
    series,
    updatedAt: new Date().toISOString(),
  };
}

export function formatCurrency(
  value: number,
  currency = "USD",
  maximumFractionDigits = 2
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits,
  }).format(value);
}

export function formatUsd(value: number, maximumFractionDigits = 2) {
  return formatCurrency(value, "USD", maximumFractionDigits);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function satsPerDollar(price: number | null) {
  if (!price || price <= 0) {
    return null;
  }
  return Math.round(100_000_000 / price);
}
