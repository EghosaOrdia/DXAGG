import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

export default function MultiHopVisualizer({ route, tokenIn, tokenOut }) {
  if (!route) return null;
  const nodes = route.path;

  return (
    <div
      className="bg-white brut-border"
      data-testid="multi-hop-graph"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            03 /
          </span>
          <span className="font-display text-[16px] tracking-tighter">
            ROUTE TOPOLOGY
          </span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">
          {route.hops} HOP{route.hops > 1 ? "S" : ""} · {route.dex.name.toUpperCase()}
        </span>
      </div>
      <div className="p-6 relative overflow-x-auto">
        <div className="flex items-center justify-between min-w-[480px] gap-2">
          {nodes.map((sym, i) => (
            <div key={i} className="flex items-center flex-1">
              <Node sym={sym} active={i === 0 || i === nodes.length - 1} />
              {i < nodes.length - 1 && (
                <div className="flex-1 relative h-10 mx-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-[2px] bg-black" />
                  </div>
                  <motion.div
                    initial={{ left: "0%" }}
                    animate={{ left: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#002FA7]"
                    style={{ marginLeft: "-6px" }}
                  />
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 brut-border bg-white px-2 py-0.5 font-mono text-[9px]">
                    {route.dex.name.split(" ")[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-neutral-500">
                    {(route.dex.fee).toFixed(2)}% FEE
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 mt-6 brut-border">
          <Detail label="INPUT" value={`${tokenIn.symbol}`} />
          <Detail label="OUTPUT" value={`${tokenOut.symbol}`} border />
          <Detail
            label="ETA"
            value={`${(route.timeMs / 1000).toFixed(1)}s`}
            border
          />
          <Detail
            label="POOL FEE"
            value={`${(route.dex.fee).toFixed(2)}%`}
            border
          />
        </div>
      </div>
    </div>
  );
}

function Node({ sym, active }) {
  return (
    <div
      className={`brut-border w-16 h-16 grid place-items-center font-display text-[14px] tracking-tighter ${
        active ? "bg-[#FAFF00]" : "bg-white"
      }`}
    >
      {sym}
    </div>
  );
}

function Detail({ label, value, border }) {
  return (
    <div className={`p-3 ${border ? "border-l border-black" : ""}`}>
      <div className="font-mono text-[9px] tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="font-mono text-[13px] mt-1">{value}</div>
    </div>
  );
}
