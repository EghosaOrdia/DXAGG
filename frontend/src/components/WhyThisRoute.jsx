import {
  TrendUp,
  GasPump,
  Path,
  ChartBar,
  Sparkle,
} from "@phosphor-icons/react";

const ICONS = { TrendUp, GasPump, Path, ChartBar };

export default function WhyThisRoute({ rationale, route, savedUsd }) {
  if (!route || !rationale || rationale.length === 0) return null;
  return (
    <section
      className="bg-white brut-border relative"
      style={{ borderLeftWidth: 4, borderLeftColor: "#002FA7" }}
      data-testid="route-explainer-panel"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black">
        <div className="flex items-center gap-3">
          <Sparkle size={14} weight="fill" className="text-[#002FA7]" />
          <span className="font-display text-[16px] tracking-tighter">
            WHY THIS ROUTE?
          </span>
        </div>
        <div
          className="font-mono text-[10px] bg-black text-[#00e65b] px-2 py-1"
          data-testid="savings-badge"
        >
          YOU SAVE +${savedUsd.toFixed(2)}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-black bg-[#FAFAFA] font-body text-[13px] leading-snug">
        We scanned <b className="font-mono">42 liquidity sources</b> across{" "}
        <b className="font-mono">7 DEXs</b>. The optimal path runs through{" "}
        <b>{route.dex.name}</b> as a {route.hops === 1 ? "direct" : "multi-hop"}{" "}
        swap. Here&apos;s the breakdown:
      </div>

      <ul className="divide-y divide-black">
        {rationale.map((r, i) => {
          const Icon = ICONS[r.icon] || Sparkle;
          return (
            <li
              key={i}
              className="px-5 py-3 grid grid-cols-[24px_1fr] gap-3 items-start"
              data-testid={`rationale-item-${i}`}
            >
              <span className="mt-1">
                <Icon size={16} weight="bold" />
              </span>
              <div>
                <div className="font-display text-[14px] tracking-tighter">
                  {r.label}
                </div>
                <div className="text-[12px] text-neutral-600 mt-0.5">
                  {r.body}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
