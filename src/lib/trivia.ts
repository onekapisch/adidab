export type TriviaQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: "genesis",
    question: "When was the Bitcoin genesis block mined?",
    options: ["2008", "2009", "2010", "2011"],
    answerIndex: 1,
    explanation: "The genesis block was mined on January 3, 2009.",
  },
  {
    id: "supply",
    question: "What is Bitcoin's maximum supply?",
    options: ["18 million", "21 million", "100 million", "210 million"],
    answerIndex: 1,
    explanation: "Bitcoin is capped at 21 million coins.",
  },
  {
    id: "halving",
    question: "How often does the Bitcoin halving occur?",
    options: ["Every year", "Every 2 years", "Every 4 years", "Every 10 years"],
    answerIndex: 2,
    explanation: "Halvings occur roughly every 4 years or every 210,000 blocks.",
  },
  {
    id: "satoshi",
    question: "How many sats are in one BTC?",
    options: ["1,000,000", "10,000,000", "100,000,000", "1,000,000,000"],
    answerIndex: 2,
    explanation: "1 BTC equals 100,000,000 satoshis.",
  },
  {
    id: "difficulty",
    question: "What adjusts to keep Bitcoin blocks around 10 minutes?",
    options: ["Block reward", "Mining difficulty", "Transaction fees", "Supply cap"],
    answerIndex: 1,
    explanation: "Mining difficulty adjusts about every two weeks.",
  },
  {
    id: "custody",
    question: "Which option is the safest for long-term BTC storage?",
    options: ["Exchange wallet", "Mobile hot wallet", "Hardware wallet", "Paper wallet only"],
    answerIndex: 2,
    explanation: "Hardware wallets are generally safest for long-term storage.",
  },
  {
    id: "whitepaper",
    question: "Who published the Bitcoin whitepaper?",
    options: ["Vitalik Buterin", "Satoshi Nakamoto", "Hal Finney", "Nick Szabo"],
    answerIndex: 1,
    explanation: "The whitepaper was published by Satoshi Nakamoto in 2008.",
  },
  {
    id: "utxo",
    question: "Bitcoin uses which model for tracking balances?",
    options: ["Account model", "UTXO model", "Proof of stake", "Credit system"],
    answerIndex: 1,
    explanation: "Bitcoin tracks funds via the UTXO model.",
  },
  {
    id: "lightning",
    question: "The Lightning Network is designed for:",
    options: ["Faster payments", "Proof of stake", "Mining rewards", "Privacy only"],
    answerIndex: 0,
    explanation: "Lightning enables fast, low-fee Bitcoin payments off-chain.",
  },
  {
    id: "fees",
    question: "Bitcoin transaction fees are primarily paid to:",
    options: ["Developers", "Miners", "Exchanges", "Wallet providers"],
    answerIndex: 1,
    explanation: "Fees are paid to miners who include transactions in blocks.",
  },
];
