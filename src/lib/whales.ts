import { formatUsd, getBitcoinSummary } from "@/lib/market";

const WHALE_ALERT_BASE = "https://api.whale-alert.io/v1/transactions";
const BLOCKCHAIN_BASE = "https://blockchain.info";

export type WhaleEntityType = "exchange" | "wallet" | "unknown";

export type WhaleEntity = {
  address: string;
  owner: string | null;
  type: WhaleEntityType;
};

export type WhaleSignal = "bullish" | "bearish" | "neutral";

export type WhaleTransaction = {
  id: string;
  timestamp: number;
  amount: number;
  amountUsd: number;
  from: WhaleEntity;
  to: WhaleEntity;
  signal: WhaleSignal;
};

type WhaleAlertEntity = {
  address: string;
  owner?: string;
  owner_type?: string;
};

type WhaleAlertTransaction = {
  id: string;
  timestamp: number;
  amount: number;
  amount_usd: number;
  from: WhaleAlertEntity;
  to: WhaleAlertEntity;
};

type WhaleAlertResponse = {
  transactions: WhaleAlertTransaction[];
};

type BlockchainTx = {
  hash: string;
  time: number;
  out: { addr?: string; value: number }[];
  inputs?: { prev_out?: { addr?: string } }[];
};

type BlockchainResponse = {
  txs: BlockchainTx[];
};

function resolveEntityType(entity?: WhaleAlertEntity): WhaleEntityType {
  const ownerType = entity?.owner_type?.toLowerCase();
  if (ownerType === "exchange") return "exchange";
  if (entity?.owner) return "wallet";
  return "unknown";
}

function normalizeOwner(owner?: string) {
  if (!owner) return null;
  const trimmed = owner.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === "unknown") return null;
  return trimmed;
}

function normalizeEntity(entity?: WhaleAlertEntity): WhaleEntity {
  return {
    address: entity?.address ?? "--",
    owner: normalizeOwner(entity?.owner),
    type: resolveEntityType(entity),
  };
}

function resolveSignal(from: WhaleEntity, to: WhaleEntity): WhaleSignal {
  if (from.type === "exchange" && to.type !== "exchange") {
    return "bullish";
  }
  if (from.type !== "exchange" && to.type === "exchange") {
    return "bearish";
  }
  return "neutral";
}

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

async function fetchWhaleAlert(limit: number, minBtc: number) {
  const apiKey = process.env.WHALE_ALERT_API_KEY;
  if (!apiKey) return [];

  const response = await fetchJson<WhaleAlertResponse>(
    `${WHALE_ALERT_BASE}?api_key=${apiKey}&currency=btc`,
    60
  );
  const transactions = response?.transactions ?? [];

  return transactions
    .filter((tx) => tx.amount >= minBtc)
    .slice(0, limit)
    .map((tx) => {
      const from = normalizeEntity(tx.from);
      const to = normalizeEntity(tx.to);
      return {
        id: tx.id,
        timestamp: tx.timestamp * 1000,
        amount: tx.amount,
        amountUsd: tx.amount_usd,
        from,
        to,
        signal: resolveSignal(from, to),
      } as WhaleTransaction;
    });
}

async function fetchBlockchainFallback(limit: number, minBtc: number) {
  const response = await fetchJson<BlockchainResponse>(
    `${BLOCKCHAIN_BASE}/unconfirmed-transactions?format=json`,
    60
  );
  const summary = await getBitcoinSummary();
  const price = summary.price ?? 0;

  const transactions =
    response?.txs
      ?.map((tx) => {
        const amount =
          tx.out?.reduce((sum, output) => sum + output.value, 0) ?? 0;
        const amountBtc = amount / 100_000_000;
        return {
          id: tx.hash,
          timestamp: tx.time * 1000,
          amount: amountBtc,
          amountUsd: amountBtc * price,
          from: {
            address: tx.inputs?.[0]?.prev_out?.addr ?? "--",
            owner: null,
            type: "unknown",
          } as WhaleEntity,
          to: {
            address: tx.out?.[0]?.addr ?? "--",
            owner: null,
            type: "unknown",
          } as WhaleEntity,
          signal: "neutral" as WhaleSignal,
        };
      })
      ?.filter((tx) => tx.amount >= minBtc) ?? [];

  return transactions.slice(0, limit);
}

export async function getWhaleTransactions({
  limit = 5,
  minBtc = 100,
}: {
  limit?: number;
  minBtc?: number;
} = {}) {
  const whaleAlert = await fetchWhaleAlert(limit, minBtc);
  if (whaleAlert.length) {
    return whaleAlert;
  }
  return fetchBlockchainFallback(limit, minBtc);
}

export function formatWhaleEntity(entity: WhaleEntity) {
  if (entity.owner) return entity.owner;
  if (entity.type === "exchange") return "Exchange";
  if (entity.type === "wallet") return "Wallet";
  return "Unknown Wallet";
}

export function formatWhaleTimeAgo(timestamp: number) {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600)
    return `${Math.floor(diffSeconds / 60)} min ago`;
  if (diffSeconds < 86400)
    return `${Math.floor(diffSeconds / 3600)} hr ago`;
  return `${Math.floor(diffSeconds / 86400)} days ago`;
}

export function getSignalCopy(signal: WhaleSignal) {
  switch (signal) {
    case "bullish":
      return "Accumulation signal";
    case "bearish":
      return "Potential selling pressure";
    default:
      return "Large wallet transfer";
  }
}

export function formatWhaleAmountUsd(amountUsd: number) {
  if (!amountUsd) return "--";
  if (amountUsd >= 1_000_000) {
    return `${formatUsd(amountUsd / 1_000_000, 1)}M`;
  }
  return formatUsd(amountUsd, 0);
}
