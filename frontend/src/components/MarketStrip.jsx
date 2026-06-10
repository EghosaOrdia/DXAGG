import { TICKER } from "@/data/mock";
console.log(typeof Marquee);

const MarketStrip = () => {
  return (
    <div
      className="w-full bg-[#0a0a0a] text-white border-b border-black overflow-clip"
      data-testid="market-strip"
    >
      <div className="marquee">
        <div className="flex items-center py-2 font-mono text-[12px] tracking-tight">
          {TICKER.concat(TICKER).map((t, i) => (
            <span key={i} className="flex items-center gap-2 px-6">
              <span className="text-white/50">{t.label}</span>
              <span className="text-white">{t.value}</span>
              {t.delta && (
                <span
                  style={{
                    color: t.positive ? "#00e65b" : "#ff3b30",
                  }}
                >
                  {t.delta}
                </span>
              )}
              <span className="text-white/20 pl-6">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketStrip;
