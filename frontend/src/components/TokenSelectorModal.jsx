import { useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { TOKENS } from "@/data/mock";

export default function TokenSelectorModal({ open, onClose, onSelect, exclude }) {
  const [q, setQ] = useState("");

  if (!open) return null;

  const filtered = TOKENS.filter(
    (t) =>
      t.symbol !== exclude &&
      (t.symbol.toLowerCase().includes(q.toLowerCase()) ||
        t.name.toLowerCase().includes(q.toLowerCase()))
  );

  const popular = ["ETH", "USDC", "USDT", "WBTC", "DAI", "ARB"];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
      data-testid="token-selector-backdrop"
    >
      <div
        className="bg-white brut-border brut-shadow-lg w-full max-w-[520px]"
        onClick={(e) => e.stopPropagation()}
        data-testid="token-selector-modal"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black">
          <div className="font-display text-[22px] tracking-tighter">
            SELECT TOKEN
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center invert-hover brut-border"
            data-testid="token-selector-close-btn"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
        <div className="border-b border-black p-4">
          <div className="flex items-center gap-2 brut-border px-3 py-2">
            <MagnifyingGlass size={14} weight="bold" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or paste address"
              className="flex-1 bg-transparent outline-none font-mono text-[13px]"
              data-testid="token-search-input"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {popular.map((sym) => {
              const t = TOKENS.find((x) => x.symbol === sym);
              if (!t || t.symbol === exclude) return null;
              return (
                <button
                  key={sym}
                  onClick={() => {
                    onSelect(t);
                    onClose();
                  }}
                  className="brut-border px-3 py-1 font-mono text-[12px] invert-hover flex items-center gap-2"
                  data-testid={`token-popular-${sym}`}
                >
                  <span
                    className="w-3 h-3"
                    style={{ background: t.color }}
                  />
                  {sym}
                </button>
              );
            })}
          </div>
        </div>
        <div className="max-h-[44vh] overflow-y-auto">
          {filtered.map((t) => (
            <button
              key={t.symbol}
              onClick={() => {
                onSelect(t);
                onClose();
              }}
              className="w-full px-5 py-3 flex items-center gap-3 border-b border-black last:border-b-0 invert-hover text-left"
              data-testid={`token-row-${t.symbol}`}
            >
              <span
                className="w-9 h-9 grid place-items-center font-display text-[13px] text-white"
                style={{ background: t.color }}
              >
                {t.symbol.slice(0, 3)}
              </span>
              <div className="flex-1">
                <div className="font-display text-[15px] tracking-tighter">
                  {t.symbol}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  {t.name} · {t.address}
                </div>
              </div>
              <div className="text-right font-mono text-[12px]">
                <div>{t.balance.toLocaleString()} </div>
                <div className="text-neutral-500">
                  ${(t.balance * t.price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center font-mono text-[12px] text-neutral-500">
              NO TOKEN FOUND
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
