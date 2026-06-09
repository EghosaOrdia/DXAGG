import { useMemo, useState } from "react";
import "@/App.css";

import MarketStrip from "./components/MarketStrip";
import Header from "@/components/Header";
import SwapPanel from "@/components/SwapPanel";
import RouteComparison from "@/components/RouteComparison";
import WhyThisRoute from "@/components/WhyThisRoute";
import MultiHopVisualizer from "@/components/MultiHopVisualizer";
import TransactionStateModal from "@/components/TransactionStateModal";
import TokenSelectorModal from "@/components/TokenSelectorModal";
import SidePanel from "@/components/SidePanel";
import Footer from "@/components/Footer";

import { TOKENS, NETWORKS, buildRoutes, buildRationale } from "@/data/mock";

function App() {
  const [network, setNetwork] = useState(NETWORKS[1]); // Arbitrum default
  const [wallet, setWallet] = useState(null);
  const [tokenIn, setTokenIn] = useState(TOKENS[0]); // ETH
  const [tokenOut, setTokenOut] = useState(TOKENS[1]); // USDC
  const [amountIn, setAmountIn] = useState("1");
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  const [tokenInOpen, setTokenInOpen] = useState(false);
  const [tokenOutOpen, setTokenOutOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const [txState, setTxState] = useState("CLOSED"); // CLOSED | SIGN | BROADCAST | PENDING | CONFIRMED | FAILED

  const routes = useMemo(
    () =>
      buildRoutes({
        tokenIn,
        tokenOut,
        amount: parseFloat(amountIn) || 0,
        network,
      }),
    [tokenIn, tokenOut, amountIn, network],
  );

  const selectedRoute = useMemo(() => {
    if (!routes.length) return null;
    if (selectedRouteId) {
      const r = routes.find((x) => x.id === selectedRouteId);
      if (r) return r;
    }
    return routes[0];
  }, [routes, selectedRouteId]);

  const rationale = useMemo(() => buildRationale(routes), [routes]);
  const savedUsd =
    routes.length >= 2
      ? routes[0].netUsd - routes[routes.length - 1].netUsd
      : 0;

  const swap = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  const onExecute = () => {
    if (!wallet) {
      setWallet({
        address: "0x7A2c4F9b1E3D8a6c5B2F1e9D4a7C8b3E5F6A0d1B",
        ens: "trader.eth",
        balance: 2.4173,
      });
      return;
    }
    runTxFlow();
  };

  const runTxFlow = () => {
    setTxState("SIGN");
    setTimeout(() => setTxState("BROADCAST"), 1100);
    setTimeout(() => setTxState("PENDING"), 2300);
    setTimeout(() => {
      const failed = Math.random() < 0.1;
      setTxState(failed ? "FAILED" : "CONFIRMED");
    }, 4200);
  };

  return (
    <div className="App min-h-screen blueprint">
      <MarketStrip />
      <Header
        network={network}
        setNetwork={setNetwork}
        wallet={wallet}
        setWallet={setWallet}
      />

      {/* Hero strip */}
      <section className="border-b border-black bg-white">
        <div className="mx-auto max-w-360 px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8">
            <div className="font-mono text-[10px] tracking-widest text-neutral-500 mb-3">
              [001] / SMART ORDER ROUTER · MOCK SOURCES
            </div>
            <h1 className="font-display text-[44px] md:text-[68px] leading-[0.92] tracking-tighter">
              ROUTE EVERY TRADE
              <br />
              LIKE A <span className="bg-[#FAFF00] px-2">QUANT DESK.</span>
            </h1>
            <p className="font-body text-[14px] text-neutral-700 max-w-140 mt-4">
              DXAGG scans 42 liquidity sources across 7 DEXs and 5 chains, then
              tells you{" "}
              <b className="underline decoration-[#002FA7] decoration-2 underline-offset-2">
                exactly why
              </b>{" "}
              the winning route wins. No black-box quotes. No surprise gas.
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-3 brut-border">
            <Kpi label="SOURCES" value="42" />
            <Kpi label="DEXS" value="7" border />
            <Kpi label="CHAINS" value="5" border />
            <Kpi label="AVG SAVE" value="0.84%" />
            <Kpi label="MED. GAS" value="$0.12" border />
            <Kpi label="UPTIME" value="99.98" border />
          </div>
        </div>
      </section>

      {/* Main grid */}
      <main className="mx-auto max-w-360 px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Swap */}
          <div className="lg:col-span-4 space-y-6">
            <SwapPanel
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              amountIn={amountIn}
              setAmountIn={setAmountIn}
              setTokenInOpen={() => setTokenInOpen(true)}
              setTokenOutOpen={() => setTokenOutOpen(true)}
              swap={swap}
              bestRoute={selectedRoute}
              slippage={slippage}
              setSlippage={setSlippage}
              deadline={deadline}
              setDeadline={setDeadline}
              wallet={wallet}
              onExecute={onExecute}
              network={network}
            />
          </div>

          {/* Middle: Routes + Why + Topology */}
          <div className="lg:col-span-5 space-y-6">
            <RouteComparison
              routes={routes}
              tokenOut={tokenOut}
              selectedId={selectedRoute?.id}
              onSelect={setSelectedRouteId}
            />
            <MultiHopVisualizer
              route={selectedRoute}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
            />
          </div>

          {/* Right: Why this route + Side panel */}
          <div className="lg:col-span-3 space-y-6">
            <WhyThisRoute
              rationale={rationale}
              route={selectedRoute}
              savedUsd={Math.max(savedUsd, 0)}
            />
            <SidePanel
              network={network}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
            />
          </div>
        </div>
      </main>

      <Footer />

      <TokenSelectorModal
        open={tokenInOpen}
        onClose={() => setTokenInOpen(false)}
        onSelect={setTokenIn}
        exclude={tokenOut.symbol}
      />
      <TokenSelectorModal
        open={tokenOutOpen}
        onClose={() => setTokenOutOpen(false)}
        onSelect={setTokenOut}
        exclude={tokenIn.symbol}
      />
      <TransactionStateModal
        open={txState !== "CLOSED"}
        onClose={() => setTxState("CLOSED")}
        state={txState}
        route={selectedRoute}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        txHash="0xabcdef0123456789"
      />
    </div>
  );
}

function Kpi({ label, value, border }) {
  return (
    <div className={`p-3 ${border ? "border-l border-black" : ""}`}>
      <div className="font-mono text-[9px] tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="font-display text-[20px] tracking-tighter leading-none mt-1">
        {value}
      </div>
    </div>
  );
}

export default App;
