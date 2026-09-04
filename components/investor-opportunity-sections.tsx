const destinations = [
  ["London", "West End"],
  ["New York", "Broadway"],
  ["Los Angeles", "North American Production"],
  ["Tokyo", "Japanese Production"],
  ["Sydney", "Australian Production"],
  ["Dubai", "Middle East Production"],
];

const budget = [
  ["Rehearsals & Salaries", 164273],
  ["Physical Production", 134500],
  ["Admin, Legal & Insurance", 120300],
  ["Creative Fees", 94000],
  ["Travel & Accommodation", 70550],
  ["Advertising, Marketing & PR", 57500],
  ["Production Staff", 48100],
  ["Tech Charges", 46494],
  ["Casting & Auditions", 13425],
] as const;

const format = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

export function LargerInvestmentThesis() {
  return (
    <div className="mt-8 space-y-8 sm:mt-10">
      <section className="card-panel rounded-[2rem] px-6 py-9 sm:px-10 sm:py-11">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">The larger proposition</p>
        <h2 className="mt-3 text-[clamp(2.1rem,7vw,4.1rem)] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-[var(--color-ivory)]">Buying Into the Birth of IP</h2>
        <p className="mt-6 max-w-4xl text-[1.18rem] font-semibold leading-[1.6] text-[var(--color-ivory)]">Foundational Investors enter at the creation stage of the theatrical property.</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {["West End", "Broadway", "UK touring", "North America", "Australia", "Japan", "Middle East", "Europe", "International licensing", "Regional productions", "Subsidiary rights"].map((item) => <span key={item} className="rounded-full border border-[rgba(200,168,110,0.26)] bg-[rgba(200,168,110,0.07)] px-4 py-2 text-sm text-[var(--color-cream)]">{item}</span>)}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(200,168,110,0.34)] bg-[radial-gradient(circle_at_center,rgba(200,168,110,0.15),transparent_35%),linear-gradient(145deg,rgba(9,19,13,0.96),rgba(32,55,40,0.88))] px-6 py-10 text-center sm:px-10">
        <h2 className="text-[clamp(2rem,7vw,4rem)] font-bold uppercase leading-[0.98] tracking-[-0.04em] text-[var(--color-ivory)]">One Show. One World.</h2>
        <div className="relative mx-auto mt-9 max-w-5xl">
          <div className="mx-auto flex aspect-square w-44 items-center justify-center rounded-full border border-[rgba(200,168,110,0.65)] bg-[rgba(200,168,110,0.1)] px-5 text-center text-lg font-bold uppercase leading-tight text-[var(--color-gold)] shadow-[0_0_70px_rgba(200,168,110,0.15)] sm:w-52">To Sir, With Love</div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map(([city, life]) => <article key={city} className="rounded-[1.2rem] border border-[rgba(232,222,203,0.12)] bg-[rgba(255,255,255,0.035)] px-4 py-4"><p className="font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">{city}</p><p className="mt-1 text-sm text-[var(--color-cream)]">{life}</p></article>)}
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-4xl text-base leading-7 text-[var(--color-cream)]">A successful theatrical property can be produced independently and simultaneously across multiple territories, creating new commercial entities and potential revenue streams around the same underlying IP.</p>
        <div className="mx-auto mt-7 max-w-4xl border-t border-[rgba(200,168,110,0.25)] pt-6">
          <h3 className="font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Foundational Investor Continuation Rights</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-cream)]">Foundational Investors have the guaranteed first opportunity to maintain their proportional Participation Interest in qualifying future Transfer Productions by investing their corresponding share of the new capitalization. Reinvestment is optional, and future productions are not guaranteed.</p>
        </div>
      </section>

      <section className="card-panel rounded-[2rem] px-6 py-9 sm:px-10 sm:py-11">
        <h2 className="text-[clamp(1.9rem,6vw,3.6rem)] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)]">An Alternative Investment</h2>
        <p className="mt-5 max-w-4xl text-[1.12rem] font-semibold text-[var(--color-gold)]">This isn&apos;t about replacing traditional investments. It&apos;s about adding something different.</p>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[var(--color-cream)]">A theatrical investment has a different risk and reward profile. It is higher risk and illiquid, and investors may lose all of their capital.</p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{["Equities", "Property", "Private investments", "Cash / fixed income", "Funds", "Entertainment IP"].map((asset, index) => <div key={asset} className={`rounded-[1rem] border px-3 py-4 text-center text-sm ${index === 5 ? "border-[rgba(200,168,110,0.7)] bg-[rgba(200,168,110,0.14)] text-[var(--color-gold)]" : "border-[rgba(232,222,203,0.1)] text-[var(--color-mist)]"}`}>{asset}</div>)}</div>
        <p className="mt-5 text-sm leading-6 text-[var(--color-mist)]">This is not personalised financial advice and no particular portfolio allocation is suggested.</p>
      </section>

    </div>
  );
}

export function CapitalTransparency() {
  return (
    <div className="mt-8 space-y-8 sm:mt-10">
      <section className="card-panel rounded-[2rem] px-6 py-9 sm:px-10 sm:py-11">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">Capital transparency</p>
        <h2 className="mt-3 text-[clamp(2rem,7vw,3.8rem)] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)]">Where Does My Investment Go?</h2>
        <p className="mt-4 text-xl font-semibold text-[var(--color-gold)]">£750,000 Capitalization</p>
        <div className="mt-8 space-y-4">{budget.map(([label, value]) => <div key={label}><div className="flex justify-between gap-4 text-sm"><span className="text-[var(--color-cream)]">{label}</span><span className="font-semibold text-[var(--color-ivory)]">{format(value)}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]"><div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold-soft),var(--color-gold))]" style={{ width: `${(value / 164273) * 100}%` }} /></div></div>)}</div>
        <p className="mt-6 text-sm leading-6 text-[var(--color-mist)]">Current budget subtotal: {format(749142)}. Figures shown are based on the current production budget and may move between departments as the production develops. Total investor capitalization remains governed by the offering documents. A 3% contingency is built into the approved capitalization; the departmental allocation of that contingency requires reconciliation against the current budget subtotal.</p>
      </section>
    </div>
  );
}
