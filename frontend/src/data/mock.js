// Mock data layer for the DEX aggregator UI
// Prices are intentional approximations for demo purposes.

export const TOKENS = [
  {
    symbol: "ETH",
    name: "Ether",
    address: "0xeeee...eeee",
    decimals: 18,
    price: 3842.17,
    balance: 2.4173,
    color: "#627EEA",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b8...eB48",
    decimals: 6,
    price: 1.0,
    balance: 12450.55,
    color: "#2775CA",
  },
  {
    symbol: "USDT",
    name: "Tether",
    address: "0xdAC1...1ec7",
    decimals: 6,
    price: 1.0,
    balance: 5230.12,
    color: "#26A17B",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B17...1d0F",
    decimals: 18,
    price: 1.0,
    balance: 0,
    color: "#F5AC37",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260...c599",
    decimals: 8,
    price: 96420.5,
    balance: 0.0231,
    color: "#F09242",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    address: "0x912C...A4B1",
    decimals: 18,
    price: 0.42,
    balance: 1820.0,
    color: "#28A0F0",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f98...984",
    decimals: 18,
    price: 8.92,
    balance: 145.7,
    color: "#FF007A",
  },
  {
    symbol: "OP",
    name: "Optimism",
    address: "0x4200...0042",
    decimals: 18,
    price: 1.71,
    balance: 540.0,
    color: "#FF0420",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x5149...A14a",
    decimals: 18,
    price: 22.34,
    balance: 88.4,
    color: "#2A5ADA",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x7D1A...e0c8",
    decimals: 18,
    price: 0.51,
    balance: 0,
    color: "#8247E5",
  },
];

export const NETWORKS = [
  { id: "ethereum", name: "Ethereum", gas: 18.4, color: "#627EEA" },
  { id: "arbitrum", name: "Arbitrum", gas: 0.12, color: "#28A0F0" },
  { id: "optimism", name: "Optimism", gas: 0.08, color: "#FF0420" },
  { id: "base", name: "Base", gas: 0.05, color: "#0052FF" },
  { id: "polygon", name: "Polygon", gas: 0.03, color: "#8247E5" },
];

export const DEXES = [
  { id: "uniswap_v3", name: "Uniswap V3", fee: 0.05 },
  { id: "sushiswap", name: "Sushiswap", fee: 0.3 },
  { id: "curve", name: "Curve", fee: 0.04 },
  { id: "balancer", name: "Balancer", fee: 0.1 },
  { id: "oneinch", name: "1inch Fusion", fee: 0.0 },
  { id: "zerox", name: "0x Protocol", fee: 0.15 },
  { id: "pancake", name: "PancakeSwap", fee: 0.25 },
];

// Deterministic pseudo-random based on a seed string
function seeded(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds a list of routes across DEXes given input/output token and amount.
export function buildRoutes({ tokenIn, tokenOut, amount, network }) {
  if (!tokenIn || !tokenOut || !amount || amount <= 0) return [];
  const ratio = tokenIn.price / tokenOut.price;
  const baseOut = amount * ratio;
  const rand = seeded(`${tokenIn.symbol}-${tokenOut.symbol}-${network.id}-${amount}`);

  const candidates = DEXES.map((dex, i) => {
    const slipFactor = 1 - (0.0005 + rand() * 0.012); // 0.05% - 1.25%
    const out = baseOut * slipFactor;
    const gas = network.gas * (0.6 + rand() * 1.6); // USD-ish gas
    const fee = (dex.fee / 100) * amount * tokenIn.price;
    const priceImpact = (1 - slipFactor) * 100;
    const hops = rand() > 0.55 ? 2 : 1;
    const path =
      hops === 2
        ? [tokenIn.symbol, "WETH", tokenOut.symbol]
        : [tokenIn.symbol, tokenOut.symbol];
    return {
      id: `${dex.id}-${i}`,
      dex,
      out,
      gas,
      fee,
      priceImpact,
      hops,
      path,
      timeMs: 1200 + Math.floor(rand() * 3800),
    };
  });

  // net output value in USD = out * tokenOut.price - gas
  candidates.forEach(
    (r) => (r.netUsd = r.out * tokenOut.price - r.gas - r.fee)
  );
  candidates.sort((a, b) => b.netUsd - a.netUsd);
  candidates[0].isBest = true;
  return candidates;
}

export const ACTIVITY = [
  {
    id: "tx-001",
    type: "SWAP",
    pair: "ETH → USDC",
    amount: "0.42 ETH",
    received: "1,614.11 USDC",
    status: "CONFIRMED",
    block: 19384021,
    ts: "12:42:18",
  },
  {
    id: "tx-002",
    type: "SWAP",
    pair: "USDC → ARB",
    amount: "2,400 USDC",
    received: "5,714.28 ARB",
    status: "CONFIRMED",
    block: 19384004,
    ts: "12:39:01",
  },
  {
    id: "tx-003",
    type: "SWAP",
    pair: "WBTC → ETH",
    amount: "0.01 WBTC",
    received: "0.2510 ETH",
    status: "REVERTED",
    block: 19383988,
    ts: "12:36:44",
  },
  {
    id: "tx-004",
    type: "APPROVE",
    pair: "DAI",
    amount: "∞",
    received: "—",
    status: "CONFIRMED",
    block: 19383921,
    ts: "12:24:09",
  },
];

export const TICKER = [
  { label: "GAS", value: "18 GWEI", positive: false },
  { label: "ETH", value: "$3,842.17", positive: true, delta: "+1.24%" },
  { label: "BTC", value: "$96,420", positive: true, delta: "+0.42%" },
  { label: "ARB", value: "$0.42", positive: false, delta: "-0.18%" },
  { label: "BLOCK", value: "#19,384,022" },
  { label: "TPS", value: "12.4" },
  { label: "MEV", value: "LOW" },
  { label: "L1 BASEFEE", value: "17.8 GWEI" },
  { label: "L2 ARB", value: "0.12 GWEI" },
  { label: "L2 OP", value: "0.08 GWEI" },
  { label: "BLOB", value: "1 WEI" },
  { label: "QUOTES", value: "42 SOURCES" },
];

// Builds a "why this route" rationale by comparing the winning route to the
// next two best alternatives.
export function buildRationale(routes) {
  if (!routes || routes.length < 2) return [];
  const best = routes[0];
  const second = routes[1];
  const third = routes[2];
  const savedVsSecond = best.netUsd - second.netUsd;
  const gasDiff = second.gas - best.gas;
  const outDiff = ((best.out - second.out) / second.out) * 100;

  const out = [];
  out.push({
    icon: "TrendUp",
    label: "Better output",
    body: `${outDiff >= 0 ? "+" : ""}${outDiff.toFixed(2)}% more ${best.path.at(-1)} than via ${second.dex.name}.`,
  });
  if (gasDiff > 0) {
    out.push({
      icon: "GasPump",
      label: "Lower gas",
      body: `Saves $${gasDiff.toFixed(2)} in gas vs the next best route on the same network.`,
    });
  } else {
    out.push({
      icon: "GasPump",
      label: "Gas tradeoff",
      body: `Slightly higher gas (+$${Math.abs(gasDiff).toFixed(2)}) but offset by superior price.`,
    });
  }
  out.push({
    icon: "Path",
    label: best.hops === 1 ? "Direct path" : "Smart multi-hop",
    body:
      best.hops === 1
        ? `Single-pool swap on ${best.dex.name} avoids extra slippage from intermediate tokens.`
        : `Multi-hop through ${best.path[1]} unlocks deeper liquidity on ${best.dex.name}.`,
  });
  if (third) {
    out.push({
      icon: "ChartBar",
      label: "Net savings",
      body: `Net advantage of $${savedVsSecond.toFixed(2)} vs ${second.dex.name}, $${(best.netUsd - third.netUsd).toFixed(2)} vs ${third.dex.name} after fees + gas.`,
    });
  }
  return out;
}
