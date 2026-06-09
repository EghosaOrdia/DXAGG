import { ACTIVITY } from "@/data/mock";
import { GasPump, Pulse, ClockCounterClockwise } from "@phosphor-icons/react";

export default function SidePanel({ network, tokenIn, tokenOut }) {
  return (
    <div className="space-y-0">
      <GasCard network={network} />
      <PairCard tokenIn={tokenIn} tokenOut={tokenOut} />
      <ActivityCard />
    </div>
  );
}

function GasCard({ network }) {
  return (
    <section className="bg-white brut-border" data-testid="gas-tracker">
      <div className="flex items-center justify-between border-b border-black px-4 py-3">
        <div className="flex items-center gap-2">
          <GasPump size={14} weight="bold" />
          <span className="font-display text-[14px] tracking-tighter">
            GAS TRACKER
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">
          {network.name.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-3">
        <GasTile label="SAFE" value={(network.gas * 0.85).toFixed(1)} />
        <GasTile
          label="STD"
          value={network.gas.toFixed(1)}
          border
          highlight
        />
        <GasTile label="FAST" value={(network.gas * 1.25).toFixed(1)} border />
      </div>
      <div className="px-4 py-2 border-t border-black font-mono text-[10px] text-neutral-500 flex justify-between">
        <span>NEXT BLOCK</span>
        <span className="text-black">~ 12.0s</span>
      </div>
    </section>
  );
}

function GasTile({ label, value, border, highlight }) {
  return (
    <div
      className={`p-3 ${border ? "border-l border-black" : ""} ${
        highlight ? "bg-[#FAFF00]" : ""
      }`}
    >
      <div className="font-mono text-[9px] tracking-widest text-neutral-600">
        {label}
      </div>
      <div className="font-display text-[20px] tracking-tighter leading-none mt-1">
        {value}
      </div>
      <div className="font-mono text-[9px] text-neutral-500 mt-1">GWEI</div>
    </div>
  );
}

function PairCard({ tokenIn, tokenOut }) {
  const ratio = tokenIn.price / tokenOut.price;
  // mini sparkline (deterministic dummy points)
  const pts = Array.from({ length: 32 }, (_, i) => {
    const x = (i / 31) * 100;
    const y =
      30 +
      Math.sin(i * 0.6 + tokenIn.symbol.length) * 12 +
      Math.cos(i * 0.3) * 6;
    return `${x},${y}`;
  });
  return (
    <section
      className="bg-white brut-border border-t-0"
      data-testid="pair-mini-chart"
    >
      <div className="flex items-center justify-between border-b border-black px-4 py-3">
        <div className="flex items-center gap-2">
          <Pulse size={14} weight="bold" />
          <span className="font-display text-[14px] tracking-tighter">
            {tokenIn.symbol} / {tokenOut.symbol}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#00e65b]">+1.24%</span>
      </div>
      <div className="px-4 pt-3">
        <div className="font-display text-[22px] tracking-tighter leading-none">
          {ratio.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </div>
        <div className="font-mono text-[10px] text-neutral-500 mt-1">
          1 {tokenIn.symbol} ≈ {ratio.toFixed(2)} {tokenOut.symbol}
        </div>
      </div>
      <div className="px-2 pt-1 pb-3">
        <svg viewBox="0 0 100 60" className="w-full h-[60px]">
          <polyline
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="1"
            points={pts.join(" ")}
          />
          <polyline
            fill="none"
            stroke="#002FA7"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            points={pts.slice(20).join(" ")}
          />
        </svg>
      </div>
      <div className="grid grid-cols-3 border-t border-black">
        <Mini label="24H HIGH" value={(ratio * 1.06).toFixed(3)} />
        <Mini label="24H LOW" value={(ratio * 0.94).toFixed(3)} border />
        <Mini label="VOLUME" value="$2.4B" border />
      </div>
    </section>
  );
}

function Mini({ label, value, border }) {
  return (
    <div className={`p-2 ${border ? "border-l border-black" : ""}`}>
      <div className="font-mono text-[9px] tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="font-mono text-[11px] mt-0.5">{value}</div>
    </div>
  );
}

function ActivityCard() {
  return (
    <section
      className="bg-white brut-border border-t-0"
      data-testid="activity-feed"
    >
      <div className="flex items-center justify-between border-b border-black px-4 py-3">
        <div className="flex items-center gap-2">
          <ClockCounterClockwise size={14} weight="bold" />
          <span className="font-display text-[14px] tracking-tighter">
            RECENT ACTIVITY
          </span>
        </div>
        <button
          className="font-mono text-[10px] underline decoration-[#002FA7] decoration-2 underline-offset-2 invert-hover px-1"
          data-testid="view-all-activity"
        >
          ALL
        </button>
      </div>
      <ul>
        {ACTIVITY.map((tx) => (
          <li
            key={tx.id}
            className="px-4 py-3 border-b border-black last:border-b-0 flex items-center justify-between"
            data-testid={`activity-${tx.id}`}
          >
            <div>
              <div className="font-display text-[13px] tracking-tighter flex items-center gap-2">
                {tx.type}
                <span
                  className="font-mono text-[9px] px-1 py-0.5"
                  style={{
                    background:
                      tx.status === "CONFIRMED" ? "#E6FFED" : "#FFEBEA",
                    color: tx.status === "CONFIRMED" ? "#00803a" : "#FF3B30",
                  }}
                >
                  {tx.status}
                </span>
              </div>
              <div className="font-mono text-[10px] text-neutral-500 mt-0.5">
                {tx.pair} · {tx.ts}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[11px]">{tx.amount}</div>
              <div className="font-mono text-[10px] text-neutral-500">
                #{tx.block}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
