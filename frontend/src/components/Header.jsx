import { useState } from "react";
import { CaretDown, Wallet, Lightning, Plugs } from "@phosphor-icons/react";
import { NETWORKS } from "@/data/mock";

export default function Header({ network, setNetwork, wallet, setWallet }) {
  const [openNet, setOpenNet] = useState(false);

  const connect = () => {
    if (wallet) {
      setWallet(null);
      return;
    }
    setWallet({
      address: "0x7A2c4F9b1E3D8a6c5B2F1e9D4a7C8b3E5F6A0d1B",
      ens: "trader.eth",
      balance: 2.4173,
    });
  };

  return (
    <header
      className="w-full border-b border-black bg-white"
      data-testid="app-header"
    >
      <div className="mx-auto max-w-[1440px] flex items-stretch">
        {/* Logo */}
        <div className="border-r border-black flex items-center px-6 py-4 gap-3">
          <div className="w-9 h-9 bg-black text-white grid place-items-center font-display text-[18px]">
            DX
          </div>
          <div className="leading-none">
            <div className="font-display text-[20px] tracking-tighter">
              DXAGG /<span className="text-[#002FA7]">01</span>
            </div>
            <div className="font-mono text-[10px] text-neutral-500">
              MINI ROUTING TERMINAL
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex border-r border-black">
          {["SWAP", "POOLS", "PORTFOLIO", "ANALYTICS"].map((n, i) => (
            <button
              key={n}
              className={`px-5 py-4 font-mono text-[11px] tracking-widest border-r border-black invert-hover ${
                i === 0 ? "bg-[#FAFF00]" : "bg-white"
              }`}
              data-testid={`nav-${n.toLowerCase()}-btn`}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Network selector */}
        <div className="relative border-l border-black">
          <button
            onClick={() => setOpenNet((o) => !o)}
            className="h-full px-5 flex items-center gap-2 invert-hover font-mono text-[12px]"
            data-testid="network-selector-btn"
          >
            <span
              className="w-2 h-2"
              style={{ background: network.color }}
            />
            {network.name.toUpperCase()}
            <CaretDown size={12} weight="bold" />
          </button>
          {openNet && (
            <div
              className="absolute right-0 top-full bg-white brut-border brut-shadow w-[220px] z-50"
              data-testid="network-dropdown"
            >
              {NETWORKS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setNetwork(n);
                    setOpenNet(false);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between border-b border-black last:border-b-0 invert-hover font-mono text-[12px]"
                  data-testid={`network-option-${n.id}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2"
                      style={{ background: n.color }}
                    />
                    {n.name.toUpperCase()}
                  </span>
                  <span className="text-neutral-500">
                    {n.gas.toFixed(2)} GWEI
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet connect */}
        <button
          onClick={connect}
          className={`border-l border-black px-5 flex items-center gap-2 font-mono text-[12px] ${
            wallet ? "bg-[#0a0a0a] text-white" : "bg-white invert-hover"
          }`}
          data-testid="wallet-connect-btn"
        >
          {wallet ? (
            <>
              <span
                className="w-2 h-2 bg-[#00e65b] inline-block"
                style={{ boxShadow: "0 0 6px #00e65b" }}
              />
              {wallet.ens}
              <span className="text-white/50">
                {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
              </span>
              <Plugs size={14} weight="bold" className="ml-2" />
            </>
          ) : (
            <>
              <Wallet size={14} weight="bold" />
              CONNECT WALLET
              <Lightning size={12} weight="fill" className="text-[#FAFF00]" />
            </>
          )}
        </button>
      </div>
    </header>
  );
}
