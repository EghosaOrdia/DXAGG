export default function Footer() {
  return (
    <footer
      className="border-t border-black bg-white"
      data-testid="app-footer"
    >
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4">
        <Cell title="DXAGG / 01">
          A swiss-brutalist mini DEX aggregator. Built for demos & UX studies.
          Mock data — no funds at risk.
        </Cell>
        <Cell title="STATUS" border>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 bg-[#00e65b] inline-block" />
            ALL SYSTEMS NOMINAL
          </div>
          <div className="font-mono text-[10px] text-neutral-500 mt-2">
            42 SOURCES · 7 DEXS · 5 CHAINS
          </div>
        </Cell>
        <Cell title="DOCS" border>
          <ul className="font-mono text-[11px] space-y-1">
            <li>
              <a className="invert-hover px-1" href="#">
                → ROUTING ALGORITHM
              </a>
            </li>
            <li>
              <a className="invert-hover px-1" href="#">
                → MEV PROTECTION
              </a>
            </li>
            <li>
              <a className="invert-hover px-1" href="#">
                → API REFERENCE
              </a>
            </li>
          </ul>
        </Cell>
        <Cell title="LEGAL" border>
          <div className="font-mono text-[10px] text-neutral-500 leading-relaxed">
            Demo interface only. Not investment advice. Smart contracts un-audited.
            <br />
            © 2026 DXAGG LABS
          </div>
        </Cell>
      </div>
    </footer>
  );
}

function Cell({ title, children, border }) {
  return (
    <div
      className={`p-6 ${border ? "md:border-l border-black" : ""}`}
    >
      <div className="font-mono text-[10px] tracking-widest text-neutral-500 mb-3">
        {title}
      </div>
      <div className="text-[12px] leading-relaxed">{children}</div>
    </div>
  );
}
