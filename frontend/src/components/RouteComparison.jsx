import { CheckCircle, Trophy } from "@phosphor-icons/react";

export default function RouteComparison({ routes, tokenOut, selectedId, onSelect }) {
  if (!routes || routes.length === 0) {
    return (
      <div className="bg-white brut-border p-10 text-center font-mono text-[12px] text-neutral-500">
        ENTER AN AMOUNT TO SCAN ROUTES
      </div>
    );
  }

  return (
    <section
      className="bg-white brut-border"
      data-testid="route-comparison-table"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            02 /
          </span>
          <span className="font-display text-[16px] tracking-tighter">
            ROUTE COMPARISON
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">
          {routes.length} ROUTES · SORTED BY NET RECEIVED
        </span>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-12 px-5 py-2 border-b border-black bg-[#FAFAFA] font-mono text-[10px] tracking-widest text-neutral-500">
        <div className="col-span-3">DEX</div>
        <div className="col-span-3 text-right">OUTPUT</div>
        <div className="col-span-2 text-right">GAS</div>
        <div className="col-span-2 text-right">IMPACT</div>
        <div className="col-span-2 text-right">NET USD</div>
      </div>

      {routes.map((r) => {
        const isSelected = selectedId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect && onSelect(r.id)}
            className={`grid grid-cols-12 items-center px-5 py-3 border-b border-black last:border-b-0 w-full text-left transition-colors ${
              r.isBest
                ? "bg-[#FAFF00]"
                : isSelected
                  ? "bg-[#F0F4FF]"
                  : "bg-white hover:bg-[#F0F4FF]"
            }`}
            data-testid={`route-row-${r.dex.id}`}
          >
            <div className="col-span-3 flex items-center gap-2">
              {r.isBest ? (
                <Trophy size={14} weight="fill" className="text-black" />
              ) : isSelected ? (
                <CheckCircle size={14} weight="fill" className="text-[#002FA7]" />
              ) : (
                <span className="w-3 h-3 border border-black" />
              )}
              <div>
                <div className="font-display text-[14px] tracking-tighter">
                  {r.dex.name}
                </div>
                <div className="font-mono text-[10px] text-neutral-600">
                  {r.path.join(" → ")} · {r.hops} hop
                </div>
              </div>
            </div>
            <div className="col-span-3 text-right font-mono text-[13px]">
              {r.out.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              <span className="text-neutral-500 ml-1">{tokenOut.symbol}</span>
            </div>
            <div className="col-span-2 text-right font-mono text-[13px]">
              ${r.gas.toFixed(2)}
            </div>
            <div
              className={`col-span-2 text-right font-mono text-[13px] ${
                r.priceImpact > 1 ? "text-[#FF3B30]" : ""
              }`}
            >
              {r.priceImpact.toFixed(2)}%
            </div>
            <div className="col-span-2 text-right font-mono text-[13px] font-bold">
              ${r.netUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </button>
        );
      })}
    </section>
  );
}
