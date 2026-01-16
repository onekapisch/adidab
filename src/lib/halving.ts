const BLOCKCHAIN_BASE = "https://blockchain.info";
const HALVING_INTERVAL = 210_000;
const AVERAGE_BLOCK_SECONDS = 600;

export type HalvingEstimate = {
  height: number | null;
  nextHalvingHeight: number | null;
  blocksRemaining: number | null;
  estimatedDate: string | null;
  estimatedDays: number | null;
  updatedAt: string;
};

async function fetchText(url: string, revalidateSeconds = 300) {
  try {
    const response = await fetch(url, {
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch {
    return null;
  }
}

export async function getHalvingEstimate(): Promise<HalvingEstimate> {
  const rawHeight = await fetchText(`${BLOCKCHAIN_BASE}/q/getblockcount`, 300);
  const height = rawHeight ? Number(rawHeight) : null;

  if (!height || !Number.isFinite(height)) {
    return {
      height: null,
      nextHalvingHeight: null,
      blocksRemaining: null,
      estimatedDate: null,
      estimatedDays: null,
      updatedAt: new Date().toISOString(),
    };
  }

  const nextHalvingHeight =
    (Math.floor(height / HALVING_INTERVAL) + 1) * HALVING_INTERVAL;
  const blocksRemaining = Math.max(nextHalvingHeight - height, 0);
  const secondsRemaining = blocksRemaining * AVERAGE_BLOCK_SECONDS;
  const estimatedDate = new Date(Date.now() + secondsRemaining * 1000);
  const estimatedDays = Math.round(secondsRemaining / 86400);

  return {
    height,
    nextHalvingHeight,
    blocksRemaining,
    estimatedDate: estimatedDate.toISOString(),
    estimatedDays,
    updatedAt: new Date().toISOString(),
  };
}
