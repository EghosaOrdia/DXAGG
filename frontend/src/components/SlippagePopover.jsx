import { useState } from "react";
import { Gear, X } from "@phosphor-icons/react";

const PRESETS = [0.1, 0.5, 1.0];

export default function SlippagePopover({ slippage, setSlippage, deadline, setDeadline }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="brut-border w-9 h-9 grid place-items-center invert-hover"
        data-testid="slippage-settings-btn"
        aria-label="Settings"
      >
        <Gear size={14} weight="bold" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-40 bg-white brut-border brut-shadow w-[300px]"
          data-testid="slippage-popover"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-black">
            <span className="font-mono text-[11px] tracking-widest">
              EXECUTION SETTINGS
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 grid place-items-center invert-hover brut-border"
              data-testid="slippage-close-btn"
            >
              <X size={10} weight="bold" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 mb-2">
                MAX SLIPPAGE
              </div>
              <div className="flex gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSlippage(p);
                      setCustom("");
                    }}
                    className={`flex-1 brut-border py-2 font-mono text-[12px] invert-hover ${
                      slippage === p && !custom
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                    data-testid={`slippage-preset-${p}`}
                  >
                    {p}%
                  </button>
                ))}
                <input
                  type="number"
                  step="0.1"
                  placeholder="CUSTOM"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setSlippage(v);
                  }}
                  className="w-[80px] brut-border px-2 py-2 font-mono text-[12px] outline-none"
                  data-testid="slippage-custom-input"
                />
              </div>
              {slippage > 3 && (
                <div className="mt-2 bg-[#FFEBEA] brut-border px-2 py-1 font-mono text-[10px] text-[#FF3B30]">
                  ⚠ HIGH SLIPPAGE — POSSIBLE FRONTRUN RISK
                </div>
              )}
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 mb-2">
                TX DEADLINE (MIN)
              </div>
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(parseInt(e.target.value) || 0)}
                className="w-full brut-border px-3 py-2 font-mono text-[12px] outline-none"
                data-testid="deadline-input"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-black">
              <span className="font-mono text-[10px] tracking-widest text-neutral-500">
                MEV PROTECTION
              </span>
              <button
                className="brut-border px-2 py-1 font-mono text-[10px] bg-[#FAFF00]"
                data-testid="mev-toggle-btn"
              >
                ON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
