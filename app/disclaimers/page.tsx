import { ContinueButton } from "@/components/continue-button";

const numberedPoints = [
  "Capital is at risk. Theatrical investments are speculative and inherently risky. Investors may lose all of their investment; there is no assurance that any capital will be returned or profit distributed.",
  "Most production costs are incurred prior to opening and will be paid from contributed funds. If the Production does not open or fails to proceed, the Producer shall return to contributors, on a pro rata and pari passu basis, any remaining net assets of the Production, if any, as determined by the Production’s certified accountant. Each contributor’s share of such return shall be calculated as the proportion of their individual contribution relative to the total capitalisation. Contributors shall have no claim against any other assets of the Producer beyond the Production’s net assets.",
  "Investor Participation Units are illiquid and subject to transfer restrictions. A Unit is not transferable without the Producer’s prior written consent, and there is no established market for the Units. Once an investment is committed and cleared funds are received, it is final and cannot be withdrawn, redeemed, or cancelled at the Investor’s discretion. Funds remain at risk for the life of the project, and repayment occurs only under the agreed recoupment terms, except where proven negligence, willful misconduct, or fraud applies.",
  "This document is for private distribution only and the only person who may enter or offer to enter into any agreement for or with a view to contributing on the basis contained in this document is the person to whom it is addressed and to whom it has been sent by the Producer.",
  "Limited Recourse - Investors have no rights against the Producer's assets other than those connected to the Production itself. Investments are not protected by any compensation scheme.",
  "Fluctuating Income - Income from an investment in the Production will vary depending on box office performance.",
  "The opportunity described in this document may not be suitable for all recipients. Prospective investors are strongly advised to seek independent advice from a financial adviser authorised under the Financial Services and Markets Act 2000 (FSMA) and experienced in theatre and entertainment investments. Where appropriate, specialist tax advice should also be obtained.",
  "If for any reason the production fails to open, is cancelled, or, if having opened, fails to attract sufficient audiences, investors may not receive back their contributions and the Producers shall only return to investors pro rata and pari passu with their respective contributions a proportion of such net assets of the production as are determined to be available.",
  "The Production may be affected by force majeure, communicable disease, government restrictions, venue closure, cast illness, industrial action and other events outside the Producer’s reasonable control. Such events may delay, interrupt or prevent the Production and may cause uninsured losses.",
  "Investor Participation Units are contractual participation interests only. They are not shares, equity securities or ownership interests in Greenslade Productions Ltd.",
];

const fsmaQualificationPoints = {
  highNetWorth: [
    "Annual income of at least £100,000 in the immediately preceding financial year; or",
    "Net assets throughout the immediately preceding financial year of at least £250,000, subject to the applicable statutory definitions and exclusions, including exclusions relating to a primary residence, qualifying insurance contracts and pension or retirement benefits.",
  ],
  sophisticated: [
    "They have been a member of a network or syndicate of business angels for at least six months; or",
    "They have made two or more investments in unlisted companies during the previous two years; or",
    "They are working, or have worked in the previous two years, in a professional capacity in private equity or in the provision of finance for small and medium-sized enterprises; or",
    "They have been, within the previous two years, a director of a company with annual turnover of at least £1 million.",
  ],
};

export default function DisclaimersPage() {
  return (
    <section className="section-shell py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[66rem]">
        <div className="rounded-[2.2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="space-y-10">
            <div className="space-y-5">
              <h1 className="text-center text-[2.2rem] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-ivory)] sm:text-[2.8rem] lg:text-[3.8rem]">
                Disclaimer
              </h1>
              <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                Financial projections, estimates, illustrations and
                forward-looking statements are based on assumptions considered
                reasonable at the time they are made, but actual results may
                differ materially. No representation or warranty is made that
                any projected or illustrative result will be achieved. Nothing
                in this presentation constitutes a profit forecast, guarantee
                of future performance, financial advice or recommendation. This
                presentation and any dispute arising from it are governed by
                the laws of England and Wales.
              </p>
            </div>

            <div className="space-y-5">
              {numberedPoints.map((point, index) => (
                <div key={point} className="flex gap-4">
                  <p className="min-w-[1.75rem] pt-[0.08rem] text-[1rem] font-semibold text-[var(--color-gold)] sm:text-[1.05rem]">
                    {index + 1}.
                  </p>
                  <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-[1.55rem] font-semibold tracking-[-0.02em] text-[var(--color-gold)] sm:text-[1.75rem] lg:text-[2rem]">
                Lawful Communication under FSMA
              </h2>
              <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                This presentation is intended only for persons to whom it may
                lawfully be communicated under the Financial Services and
                Markets Act 2000 (Financial Promotion) Order 2005, including,
                where applicable, persons falling within relevant exemptions
                for investment professionals, high net worth companies,
                sophisticated investors, high net worth individuals or other
                persons to whom this communication may lawfully be made. The
                applicability of any exemption depends upon the status of the
                recipient, the nature of the investment and the circumstances
                in which the communication is made.
              </p>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-[1.15rem] font-semibold text-[var(--color-ivory)] sm:text-[1.22rem]">
                    (a) High Net Worth Individual criteria
                  </h3>
                  <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                    A person qualifies if at least one of the following
                    applies:
                  </p>
                  <div className="space-y-3 pl-4 sm:pl-6">
                    {fsmaQualificationPoints.highNetWorth.map((item, index) => (
                      <div key={item} className="flex gap-3">
                        <p className="min-w-[1.1rem] text-[var(--color-gold)]">
                          {index === 0 ? "i)" : "ii)"}
                        </p>
                        <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[1.15rem] font-semibold text-[var(--color-ivory)] sm:text-[1.22rem]">
                    (b) Self-Certified Sophisticated Investor criteria
                  </h3>
                  <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                    A person qualifies if they have signed the relevant
                    investor statement and at least one of the following
                    applies:
                  </p>
                  <div className="space-y-3 pl-4 sm:pl-6">
                    {fsmaQualificationPoints.sophisticated.map((item, index) => (
                      <div key={item} className="flex gap-3">
                        <p className="min-w-[1.1rem] text-[var(--color-gold)]">
                          {`${index + 1})`}
                        </p>
                        <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                This document and its contents are strictly private and
                confidential. They may not be copied, reproduced, published, or
                disclosed to any third party without prior written consent. No
                investment described herein is intended for, nor may it be
                offered to, any person other than the original recipient. Any
                person uncertain about the investment described in this document
                should seek independent advice from an authorised financial
                adviser under FSMA who specialises in investments of this
                nature.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="text-[1.55rem] font-semibold tracking-[-0.02em] text-[var(--color-gold)] sm:text-[1.75rem] lg:text-[2rem]">
                Foreign Exchange Risk
              </h2>
              <div className="space-y-4 text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                <p>
                  USD equivalents displayed in this presentation are
                  illustrative. The applicable exchange rate and treatment of
                  any USD-denominated subscription will be specified in the
                  relevant Subscription Agreement or investment records.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-center text-[0.9rem] leading-7 text-[var(--color-cream)]">
              <p className="font-semibold text-[var(--color-ivory)]">Greenslade Productions Ltd</p>
              <p>Company No. 16807424</p>
            </div>

            <ContinueButton
              href="/thank-you"
              label="I HAVE READ THE DISCLAIMERS"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
