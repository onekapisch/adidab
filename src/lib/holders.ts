export type BitcoinHolderType =
  | "exchange"
  | "etf"
  | "government"
  | "company"
  | "individual"
  | "unknown";

export type BitcoinHolder = {
  rank: number;
  name: string;
  type: BitcoinHolderType;
  btcBalance: number;
  percentOfSupply: number;
  lastUpdated: string;
  note?: string;
};

export const TOP_HOLDERS: BitcoinHolder[] = [
  {
    rank: 1,
    name: "Satoshi Nakamoto",
    type: "individual",
    btcBalance: 1_096_000,
    percentOfSupply: 5.22,
    lastUpdated: "2025-02-12",
    note: "Coins have never moved.",
  },
  {
    rank: 2,
    name: "Coinbase",
    type: "exchange",
    btcBalance: 884_000,
    percentOfSupply: 4.21,
    lastUpdated: "2025-02-12",
    note: "Largest exchange custodian.",
  },
  {
    rank: 3,
    name: "Strategy (MSTR)",
    type: "company",
    btcBalance: 687_410,
    percentOfSupply: 3.27,
    lastUpdated: "2025-02-12",
    note: "Largest corporate holder led by Michael Saylor.",
  },
  {
    rank: 4,
    name: "Binance",
    type: "exchange",
    btcBalance: 629_000,
    percentOfSupply: 3.0,
    lastUpdated: "2025-02-12",
    note: "Includes large cold wallet holdings.",
  },
  {
    rank: 5,
    name: "US Government",
    type: "government",
    btcBalance: 328_000,
    percentOfSupply: 1.56,
    lastUpdated: "2025-02-12",
    note: "Seized holdings from major cases.",
  },
  {
    rank: 6,
    name: "Grayscale Bitcoin Trust",
    type: "etf",
    btcBalance: 218_000,
    percentOfSupply: 1.04,
    lastUpdated: "2025-02-12",
    note: "Holdings across thousands of addresses.",
  },
  {
    rank: 7,
    name: "Chinese Government",
    type: "government",
    btcBalance: 194_775,
    percentOfSupply: 0.93,
    lastUpdated: "2025-02-12",
    note: "Confiscated from major enforcement actions.",
  },
  {
    rank: 8,
    name: "Robinhood",
    type: "exchange",
    btcBalance: 177_000,
    percentOfSupply: 0.84,
    lastUpdated: "2025-02-12",
    note: "Custody for client deposits.",
  },
  {
    rank: 9,
    name: "Upbit",
    type: "exchange",
    btcBalance: 175_000,
    percentOfSupply: 0.83,
    lastUpdated: "2025-02-12",
    note: "Major South Korean exchange holdings.",
  },
  {
    rank: 10,
    name: "Tether",
    type: "company",
    btcBalance: 96_300,
    percentOfSupply: 0.46,
    lastUpdated: "2025-02-12",
    note: "Bitcoin reserves for operations.",
  },
];

export const topHolderShare = TOP_HOLDERS.reduce(
  (total, holder) => total + holder.percentOfSupply,
  0
);
