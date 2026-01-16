export type LessonSection = {
  title: string;
  body: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  tldr: string[];
  sections: LessonSection[];
  level: "Beginner" | "Core" | "Advanced";
};

export const lessons: Lesson[] = [
  {
    slug: "bitcoin-in-five-minutes",
    title: "Bitcoin in Five Minutes",
    summary:
      "Bitcoin is a scarce, digital money secured by a distributed network rather than a central authority.",
    tldr: [
      "Fixed supply capped at 21 million.",
      "Transactions are recorded on a public ledger called the blockchain.",
      "Blocks are secured through proof-of-work.",
      "Users can self-custody without intermediaries.",
    ],
    sections: [
      {
        title: "Why it exists",
        body:
          "Bitcoin was created to offer a digital form of money that does not depend on a central bank or trusted intermediary.",
      },
      {
        title: "How it stays scarce",
        body:
          "New coins are issued on a predictable schedule that halves every four years, making supply growth transparent.",
      },
    ],
    level: "Beginner",
  },
  {
    slug: "wallets-and-self-custody",
    title: "Wallets and Self-Custody",
    summary:
      "A wallet holds your private keys. Self-custody means you control them directly.",
    tldr: [
      "Custodial wallets are easier but rely on a third party.",
      "Self-custody gives you full control and responsibility.",
      "Back up your seed phrase offline and never share it.",
      "Use hardware wallets for long-term holdings.",
    ],
    sections: [
      {
        title: "Custodial vs self-custody",
        body:
          "Custodial wallets are like bank accounts. Self-custody means you are the bank, so security matters.",
      },
      {
        title: "Security basics",
        body:
          "Use two-factor authentication, verify addresses, and keep a secure offline backup of your seed phrase.",
      },
    ],
    level: "Beginner",
  },
  {
    slug: "fees-and-confirmation-times",
    title: "Fees and Confirmation Times",
    summary:
      "Fees are market-driven and determine how quickly your transaction confirms.",
    tldr: [
      "Higher fees usually confirm faster.",
      "Fees rise when network activity is high.",
      "Use fee estimators before sending.",
      "Batching and timing can lower costs.",
    ],
    sections: [
      {
        title: "What fees represent",
        body:
          "Fees are the incentive for miners to include your transaction in a block.",
      },
      {
        title: "How to avoid overpaying",
        body:
          "Check fee recommendations and avoid sending during peak network activity when possible.",
      },
    ],
    level: "Core",
  },
  {
    slug: "lightning-network-basics",
    title: "Lightning Network Basics",
    summary:
      "Lightning is a second-layer network that enables faster, cheaper Bitcoin payments.",
    tldr: [
      "Lightning uses payment channels to avoid on-chain fees.",
      "It is ideal for small, fast transactions.",
      "Balances stay in channels until settlement.",
      "Choose wallets that manage channels for you.",
    ],
    sections: [
      {
        title: "Why Lightning exists",
        body:
          "Bitcoin prioritizes security. Lightning adds speed and low fees for everyday payments.",
      },
      {
        title: "Getting started",
        body:
          "Use a trusted Lightning wallet and start with small amounts as you learn the flow.",
      },
    ],
    level: "Core",
  },
  {
    slug: "halvings-and-supply-schedule",
    title: "Halvings and Supply Schedule",
    summary:
      "Bitcoin issuance halves every 210,000 blocks, slowing supply growth over time.",
    tldr: [
      "Halvings reduce the block subsidy by 50 percent.",
      "The schedule is deterministic and predictable.",
      "Supply scarcity increases over time.",
      "Historically, halvings drive awareness and demand.",
    ],
    sections: [
      {
        title: "What halves",
        body:
          "The reward miners earn for each block halves roughly every four years.",
      },
      {
        title: "Why it matters",
        body:
          "A shrinking issuance rate keeps supply growth low and transparent for long-term holders.",
      },
    ],
    level: "Core",
  },
  {
    slug: "mindset-for-daily-checkers",
    title: "Mindset for Daily Checkers",
    summary:
      "A daily ritual can be calm and healthy when it is anchored to fundamentals.",
    tldr: [
      "Focus on long-term signals, not short-term noise.",
      "Limit checks to a few predictable times each day.",
      "Track sats per dollar for perspective.",
      "Write down your rules and stick to them.",
    ],
    sections: [
      {
        title: "Reduce anxiety",
        body:
          "Short, scheduled check-ins prevent overreaction and keep your routine sustainable.",
      },
      {
        title: "Build a ritual",
        body:
          "Pair price checks with learning and review to reinforce confidence, not stress.",
      },
    ],
    level: "Advanced",
  },
];
