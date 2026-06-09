import { useMemo } from "react";
import { ArrowsDownUp, CaretDown, Lightning } from "@phosphor-icons/react";
import SlippagePopover from "./SlippagePopover";

export default function SwapPanel({
  tokenIn,
  tokenOut,
  amountIn,
  setAmountIn,
  setTokenInOpen,
  setTokenOutOpen,
  swap,
  bestRoute,
  slippage,
  setSlippage,
  deadline,
  setDeadline,
  wallet,
  onExecute,
  network,
}) {
  const amountOut = bestRoute ? bestRoute.out : 0;
  const inUsd = useMemo(
    () => (parseFloat(amountIn) || 0) * tokenIn.price,
    [amountIn, tokenIn],
  );
  const outUsd = amountOut * tokenOut.price;
  const minReceived = amountOut * (1 - slippage / 100);

  const insufficient = wallet && tokenIn.balance < (parseFloat(amountIn) || 0);

  return (
    <section
      className="bg-white brut-border"
      data-testid="swap-execution-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            01 /
          </span>
          <span className="font-display text-[16px] tracking-tighter">
            EXECUTE SWAP
          </span>
        </div>
        <SlippagePopover
          slippage={slippage}
          setSlippage={setSlippage}
          deadline={deadline}
          setDeadline={setDeadline}
        />
      </div>

      {/* You pay */}
      <div className="px-5 py-5 border-b border-black">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            YOU PAY
          </span>
          <span className="font-mono text-[10px] text-neutral-500">
            BAL{" "}
            <span className="text-black">
              {tokenIn.balance.toLocaleString()}
            </span>{" "}
            <button
              onClick={() => setAmountIn(String(tokenIn.balance))}
              className="ml-2 underline decoration-[#002FA7] decoration-2 underline-offset-2 invert-hover px-1"
              data-testid="max-btn-in"
            >
              MAX
            </button>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={setTokenInOpen}
            className="brut-border bg-white px-3 py-2 flex items-center gap-2 invert-hover shrink-0"
            data-testid="token-in-btn"
          >
            <span
              className="w-7 h-7 grid place-items-center text-white font-display text-[11px]"
              style={{ background: tokenIn.color }}
            >
              {tokenIn.symbol.slice(0, 3)}
            </span>
            <span className="font-display text-[18px] tracking-tighter">
              {tokenIn.symbol}
            </span>
            <CaretDown size={12} weight="bold" />
          </button>
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.00"
            className="w-full flex-1 bg-transparent outline-none font-mono text-right text-[36px] tracking-tight leading-none"
            data-testid="amount-in-input"
          />
        </div>
        <div className="flex items-center justify-between mt-3 font-mono text-[11px] text-neutral-500">
          <span>{tokenIn.name}</span>
          <span>
            ≈ ${inUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Swap direction button */}
      <div className="relative h-0">
        <button
          onClick={swap}
          className="absolute left-1/2 -translate-x-1/2 -top-5 w-10 h-10 bg-white brut-border invert-hover grid place-items-center"
          data-testid="swap-direction-btn"
          aria-label="Swap direction"
        >
          <ArrowsDownUp size={16} weight="bold" />
        </button>
      </div>

      {/* You receive */}
      <div className="px-5 py-5 border-b border-black bg-[#FAFAFA]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            YOU RECEIVE (EST)
          </span>
          {bestRoute && (
            <span className="font-mono text-[10px] text-neutral-500">
              VIA{" "}
              <span className="text-black">
                {bestRoute.dex.name.toUpperCase()}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={setTokenOutOpen}
            className="brut-border bg-white px-3 py-2 flex items-center gap-2 invert-hover shrink-0"
            data-testid="token-out-btn"
          >
            <span
              className="w-7 h-7 grid place-items-center text-white font-display text-[11px]"
              style={{ background: tokenOut.color }}
            >
              {tokenOut.symbol.slice(0, 3)}
            </span>
            <span className="font-display text-[18px] tracking-tighter">
              {tokenOut.symbol}
            </span>
            <CaretDown size={12} weight="bold" />
          </button>
          <div
            className="flex-1 font-mono text-right text-[36px] tracking-tight leading-none truncate"
            data-testid="amount-out-display"
          >
            {amountOut
              ? amountOut.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })
              : "0.00"}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 font-mono text-[11px] text-neutral-500">
          <span>{tokenOut.name}</span>
          <span>
            ≈ ${outUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 border-b border-black">
        <Stat
          label="RATE"
          value={
            bestRoute
              ? `1 ${tokenIn.symbol} = ${(amountOut / (parseFloat(amountIn) || 1)).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${tokenOut.symbol}`
              : "—"
          }
        />
        <Stat
          label="GAS"
          value={bestRoute ? `$${bestRoute.gas.toFixed(2)}` : "—"}
          border
        />
        <Stat
          label="PRICE IMPACT"
          value={bestRoute ? `${bestRoute.priceImpact.toFixed(2)}%` : "—"}
          warn={bestRoute && bestRoute.priceImpact > 1}
        />
      </div>

      <div className="grid grid-cols-2 border-b border-black">
        <Stat
          label="MIN RECEIVED"
          value={
            bestRoute
              ? `${minReceived.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${tokenOut.symbol}`
              : "—"
          }
        />
        <Stat label="NETWORK" value={network.name.toUpperCase()} border />
      </div>

      {/* Execute */}
      <div className="p-4">
        <button
          onClick={onExecute}
          disabled={!bestRoute || insufficient}
          className={`w-full brut-border py-4 font-display text-[18px] tracking-tighter flex items-center justify-center gap-2 ${
            !bestRoute || insufficient
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
              : "bg-[#0a0a0a] text-white hover:bg-[#FAFF00] hover:text-black brut-press"
          }`}
          data-testid="execute-swap-btn"
        >
          {insufficient ? (
            "INSUFFICIENT BALANCE"
          ) : !wallet ? (
            <>
              <Lightning size={16} weight="fill" />
              CONNECT WALLET TO SWAP
            </>
          ) : !bestRoute ? (
            "ENTER AMOUNT"
          ) : (
            <>
              <Lightning size={16} weight="fill" className="text-[#FAFF00]" />
              EXECUTE BEST ROUTE
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value, border, warn }) {
  return (
    <div className={`px-4 py-3 ${border ? "border-x border-black" : ""}`}>
      <div className="font-mono text-[9px] tracking-widest text-neutral-500">
        {label}
      </div>
      <div
        className={`font-mono text-[13px] mt-1 ${warn ? "text-[#FF3B30]" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
