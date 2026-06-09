import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { X, ArrowSquareOut, CheckCircle, Warning } from "@phosphor-icons/react";

const STATES = {
  IDLE: { label: "AWAITING", color: "#525252", bg: "#FFFFFF" },
  SIGN: { label: "AWAITING SIGNATURE", color: "#0A0A0A", bg: "#FAFF00" },
  BROADCAST: { label: "BROADCASTING", color: "#FFFFFF", bg: "#002FA7" },
  PENDING: { label: "PENDING ON-CHAIN", color: "#FFFFFF", bg: "#002FA7" },
  CONFIRMED: { label: "CONFIRMED", color: "#0A0A0A", bg: "#00E65B" },
  FAILED: { label: "REVERTED", color: "#FFFFFF", bg: "#FF3B30" },
};

export default function TransactionStateModal({
  open,
  onClose,
  state,
  route,
  tokenIn,
  tokenOut,
  amountIn,
  txHash,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const fakeHash = useMemo(() => {
    const key = `${open ? 1 : 0}-${state}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h.toString(16).padStart(8, "0").toUpperCase();
  }, [open, state]);

  if (!open) return null;
  const s = STATES[state] || STATES.IDLE;

  const steps = ["SIGN", "BROADCAST", "PENDING", "CONFIRMED"];
  const stepIndex =
    state === "FAILED"
      ? -1
      : steps.indexOf(state) === -1
        ? 0
        : steps.indexOf(state);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4"
      onClick={onClose}
      data-testid="transaction-state-backdrop"
    >
      <div
        className="bg-white brut-border brut-shadow-lg w-full max-w-[640px]"
        onClick={(e) => e.stopPropagation()}
        data-testid="transaction-state-modal"
      >
        <div className="flex items-center justify-between border-b border-black px-5 py-3">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500">
            TX / 0x{fakeHash}…
          </span>
          <button
            onClick={onClose}
            className="brut-border w-8 h-8 grid place-items-center invert-hover"
            data-testid="tx-modal-close-btn"
          >
            <X size={12} weight="bold" />
          </button>
        </div>

        {/* Big state */}
        <div
          className="px-6 py-10 border-b border-black text-center"
          style={{ background: s.bg, color: s.color }}
        >
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="font-display text-[42px] md:text-[58px] leading-none tracking-tighter"
          >
            {s.label}
          </motion.div>
          <div className="font-mono text-[12px] mt-3 opacity-80">
            {amountIn} {tokenIn.symbol} → {route?.out.toFixed(4)} {tokenOut.symbol}
            {" · "}
            {route?.dex.name}
          </div>
        </div>

        {/* Step blocks */}
        <div className="grid grid-cols-4 border-b border-black">
          {steps.map((step, i) => {
            const active = i <= stepIndex;
            const current = i === stepIndex;
            return (
              <div
                key={step}
                className={`p-4 ${i > 0 ? "border-l border-black" : ""} ${
                  active ? "bg-[#0a0a0a] text-white" : "bg-white"
                }`}
                data-testid={`tx-step-${step.toLowerCase()}`}
              >
                <div className="font-mono text-[9px] tracking-widest opacity-60">
                  0{i + 1}
                </div>
                <div className="font-display text-[12px] tracking-tighter mt-1">
                  {step}
                </div>
                {current && state !== "FAILED" && (
                  <motion.div
                    className="h-[3px] bg-[#FAFF00] mt-2"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
                {active && state === "CONFIRMED" && i === 3 && (
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="text-[#00e65b] mt-2"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-600">
            {state === "FAILED" ? (
              <>
                <Warning size={14} weight="fill" className="text-[#FF3B30]" />
                Transaction reverted — slippage tolerance exceeded.
              </>
            ) : state === "CONFIRMED" ? (
              <>
                <CheckCircle size={14} weight="fill" className="text-[#00e65b]" />
                Settled in block #19,384,022
              </>
            ) : (
              <span>Hold tight. Do not refresh the page.</span>
            )}
          </div>
          {txHash && (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="brut-border px-3 py-2 font-mono text-[11px] invert-hover flex items-center gap-2"
              data-testid="explorer-link"
            >
              VIEW ON EXPLORER <ArrowSquareOut size={12} weight="bold" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
