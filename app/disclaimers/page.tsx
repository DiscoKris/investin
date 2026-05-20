import { ContinueButton } from "@/components/continue-button";

const numberedPoints = [
  "Theatrical production is an inherently risky business. Contributions to the Production will involve a higher level of risk than most other financial transactions and there is no probability, but only a possibility, that investors will get back the amount which they invest.",
  "Most production costs are incurred prior to opening and will be paid from contributed funds. If the Production does not open or fails to proceed, the Producer shall return to contributors, on a pro rata and pari passu basis, any remaining net assets of the Production, if any, as determined by the Production’s certified accountant. Each contributor’s share of such return shall be calculated as the proportion of their individual contribution relative to the total capitalisation. Contributors shall have no claim against any other assets of the Producer beyond the Production’s net assets.",
  "A contribution to the Production is not transferable without the Producer’s prior written consent. As there is no established market for such contributions, it may be difficult for contributors to assess their value or fully understand the risks involved. Once an investment is committed and cleared funds are received, it is final and cannot be withdrawn, redeemed, or cancelled at the Investor’s discretion. Funds remain at risk for the life of the project, and repayment occurs only under the agreed recoupment terms, except where proven negligence, willful misconduct, or fraud applies.",
  "This document is for private distribution only and the only person who may enter or offer to enter into any agreement for or with a view to contributing on the basis contained in this document is the person to whom it is addressed and to whom it has been sent by the Producer.",
  "Limited Recourse - Investors have no rights against the Producer's assets other than those connected to the Production itself. Investments are not protected by any compensation scheme.",
  "Fluctuating Income - Income from an investment in the Production will vary depending on box office performance.",
  "The opportunity described in this document may not be suitable for all recipients. Prospective investors are strongly advised to seek independent advice from a financial adviser authorised under the Financial Services and Markets Act 2000 (FSMA) and experienced in theatre and entertainment investments. Where appropriate, specialist tax advice should also be obtained.",
  "If for any reason the production fails to open, is cancelled, or, if having opened, fails to attract sufficient audiences, investors may not receive back their contributions and the Producers shall only return to investors pro rata and pari passu with their respective contributions a proportion of such net assets of the production as are determined to be available.",
  "The Producers will not obtain insurance for the production that includes cover in respect of the impact on the production of Covid-19, any variant or any similar virus and as such if, e.g., performances are lost as a result of cast illness or a local or national lockdown or if restrictions are imposed to address Covid-19, any variant or any similar virus, which impact on rehearsing and/or presenting the production, the production will suffer uninsured losses.",
];

const fsmaQualificationPoints = {
  highNetWorth: [
    "Annual income of at least £170,000 in the immediately preceding financial year; or",
    "Net assets throughout the immediately preceding financial year of at least £430,000, excluding the person’s primary residence, any loan secured on that residence, rights under a qualifying contract of insurance, and pension or retirement benefits.",
  ],
  sophisticated: [
    "They are a member of a network or syndicate of business angels for at least six months; or",
    "They are or have been in the preceding two years working in a professional capacity in the private-equity sector or in the provision of finance for small and medium-sized enterprises; or",
    "They are currently, or have been in the preceding two years, a director of a company with an annual turnover of at least £1.6 million.",
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
                DISCLAIMER: Neither the Producer nor any of its affiliates,
                subsidiaries, officers, employees, agents, advisers, or
                representatives (together referred to as the &quot;Affiliates&quot;) make
                any representation, warranty, indemnity, or undertaking,
                express or implied, regarding the truth, accuracy, or
                completeness of the information contained in this document or
                any other document or communication (whether written or oral)
                supplied to any recipient at any time. No responsibility or
                liability of any kind is accepted by the Producer or any of its
                Affiliates for any information, statement, opinion, or omission
                contained herein, or for any loss or damage arising from or in
                connection with this document or reliance upon it. Nothing in
                this document, including any illustrative financial projections
                (the &quot;Projections&quot;), constitutes a profit forecast or a
                guarantee of future performance. The Projections are provided
                for illustrative purposes only and merely indicate potential
                outcomes based on certain assumptions. No representation or
                assurance is given by the Producer or its Affiliates as to the
                future performance or success of the matters described herein,
                and no such inference should be drawn from this document. This
                document and any dispute arising from it are governed by the
                laws of England and Wales.
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
                Exemption under Section 21 of FSMA
              </h2>
              <p className="text-[1rem] leading-[1.9] text-[var(--color-cream)] sm:text-[1.05rem]">
                This communication is made in reliance on Articles 48, 49, 50
                and 50A of the Financial Services and Markets Act 2000
                (Financial Promotion) Order 2005, as amended. The Company and
                Producers are entitled to rely on investor self-certification
                and are not required to verify eligibility beyond receipt of a
                valid signed declaration. This document is exempt from the
                general restriction in Section 21 of FSMA on the communication
                of invitations or inducements to engage in investment activity,
                on the grounds that the Recipient is, and will be treated as,
                person described below. The investment or investment activity to
                which this document relates is available only to, and will be
                engaged in only with, such persons.
              </p>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-[1.15rem] font-semibold text-[var(--color-ivory)] sm:text-[1.22rem]">
                    (a) High Net Worth Individuals (Article 48 of the FPO)
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
                    (b) Self-Certified Sophisticated Investors (Article 50A of
                    the FPO)
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
                          {index === 0 ? "i)" : index === 1 ? "ii)" : "iii)"}
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
                  Foreign exchange exposure is mitigated by locking investor
                  returns to the agreed exchange rate at the time of
                  investment.
                </p>
                <p>
                  For example, if $50,000 is invested, the exchange rate at
                  which the funds are received is 1.35. This is mutually
                  agreed.
                </p>
                <p>
                  When calculating the payout, the same exchange rate is used,
                  1.35, regardless of current rates. This is intended to
                  reduce foreign exchange uncertainty for the investor.
                </p>
              </div>
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
