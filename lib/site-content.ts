import {
  capitalRequirement,
  commercialScenarios,
  fullySubscribedUnits,
  formatGbp,
  totalGrossBoxOfficePotential,
  totalPerformanceWeeks,
  weeklyRunningCosts,
  worldPremiereVenues,
} from "@/lib/commercial-model";

export const homepageLines = [
  "Good teachers don't just teach, they change lives.",
  "A true story rooted in social change, education, and emotional transformation.",
  "A recognizable title with built-in audience awareness and intergenerational reach.",
  "Investment opportunity in the 2027 World Premiere and commercial launch of the property.",
];

export const storyThemes = [
  {
    eyebrow: "True Story",
    title: "Based on E. R. Braithwaite's autobiography",
    body: "Rick Braithwaite is more than a Cambridge-educated engineer and former RAF fighter pilot. He is a man battling societal prejudices at every turn and refusing to bow to adversity.",
  },
  {
    eyebrow: "Transformation",
    title: "He engages his students as emerging adults",
    body: "Rather than treating them as troublesome youths, he prepares them to navigate a world where they will stand or fall on their own merits. Through grit and grace, he prepares them for life.",
  },
  {
    eyebrow: "Relevance",
    title: "Every bit as relevant today as it was then",
    body: "At its heart, To Sir, With Love is an uplifting coming-of-age story about young people searching for identity, belonging and hope in a world that keeps testing them.",
  },
];

export const legacyStats = [
  {
    value: "$42m",
    label: "Grossed on a $1m budget",
  },
  {
    value: "#1",
    label: "Song in both the US and UK",
  },
  {
    value: "1967",
    label: "Release of James Clavell's film adaptation",
  },
  {
    value: "Today",
    label: "Still used in education contexts",
  },
];

export const legacyItems = [
  "Released in 1967 and directed by James Clavell, adapted from E. R. Braithwaite's 1959 novel.",
  "Sidney Poitier's performance further cemented his reputation as one of cinema's most respected figures.",
  "Poitier had already made history as the first Black man to win the Academy Award for Best Actor.",
  "The soundtrack introduced Lulu in her acting debut and created an enduring pop-cultural association with the title.",
];

export const whyNowPoints = [
  "Audiences are increasingly responding to true stories, social history, and emotionally grounded musicals that combine entertainment with meaning.",
  "To Sir, With Love is not a typical period piece. It is a mirror reflecting the world we are living in today.",
  "The title sits at the intersection of proven trends: a recognizable property, social change, education, and nostalgia-driven energy.",
  "The 2027 World Premiere aligns directly with the 60th anniversary of the 1967 film.",
];

export const marketExamples = [
  "Come From Away - A true story about ordinary people in an extraordinary time.",
  "Kinky Boots - A story of acceptance and transformation.",
  "Billy Elliot - A working-class story about education and opportunity.",
];

export const audienceCards = [
  "Intergenerational audience",
  "Film fans (50+)",
  "Theatre audiences (40+)",
  "Schools and education groups",
  "Black theatre audiences",
  "Family audiences",
];

export const teamMembers = [
  {
    name: "Sheldon Epps",
    role: "Director",
    note: "One of the most acclaimed directors in American theatre, the visionary behind the Tony Award-nominated Blues in the Night and the Broadway musical Play On!, celebrated for blending powerful storytelling with unforgettable music.",
  },
  {
    name: "Joseph Joubert",
    role: "Orchestrator",
    note: "An acclaimed Broadway composer, arranger, conductor, and musical director whose credits include Caroline, or Change, The Color Purple, Dreamgirls, Chicago, and Ain't Misbehavin'.",
  },
  {
    name: "John Farrar",
    role: "Music & Lyrics",
    note: "The Grammy Award-winning songwriter and producer behind iconic songs from Grease and Xanadu, bringing legendary musical pedigree and timeless commercial appeal.",
  },
  {
    name: "Kara DioGuardi",
    role: "Music & Lyrics",
    note: "A Grammy-nominated hitmaker whose songs have sold more than 160 million records worldwide, bringing contemporary edge and undeniable commercial instincts.",
  },
  {
    name: "Andy Walmsley",
    role: "Set & Costume Designer",
    note: "The original set designer of Blood Brothers and a world-class designer across Broadway, the West End, Las Vegas, and global touring markets.",
  },
  {
    name: "Kristopher Lythgoe",
    role: "Book",
    note: "Stage adaptation by Kris Lythgoe, shaping Braithwaite's autobiographical story into a new musical presentation with commercial theatrical scope.",
  },
  {
    name: "Sean Greene",
    role: "Musical Director",
    note: "Named in the investor deck as part of the core music team supporting the production's theatrical execution.",
  },
  {
    name: "Kieran Donovan",
    role: "Choreographer",
    note: "Named in the investor deck as part of the production's movement and staging team.",
  },
  {
    name: "Shereen Phillips",
    role: "Dramaturg",
    note: "Supporting the story's historical, emotional and structural integrity.",
  },
  {
    name: "Debbie O'Brien",
    role: "Casting Director",
    note: "Bringing major industry credibility to the casting process.",
  },
];

export const braithwaiteStory = [
  "A descendant of enslaved people, E. R. Braithwaite was born and raised in colonial British Guiana.",
  "During the Second World War he joined the Royal Air Force, flying Spitfires in the fight against fascism.",
  "After the war he completed his degree at Cambridge University and set out to work as an engineer.",
  "Despite his education and wartime service, he was unable to secure a single position in his field.",
  "Instead, he accepted a teaching post in London's East End, facing a classroom of traumatised working-class students who had grown up in the shadow of war.",
  "From that experience came To Sir, With Love, written to capture the challenges and unexpected humanity he discovered in a London classroom.",
];

export const venues = worldPremiereVenues.map(
  (venue) =>
    `${venue.timing}: ${venue.venue} — ${formatGbp(venue.grossBoxOfficePotential)} gross box office potential`,
);

export const producerProfiles = [
  {
    name: "QUBE Theatrical",
    body: "A general management company at the forefront of live entertainment, specialising in concerts, musicals in concert, and theatre productions across the West End, national and international tours, and one-night-only events.",
  },
  {
    name: "Magic Pictures International",
    body: "A Los Angeles-based production company specialising in theatre and television. Recent theatre credits include Grease, Rodgers and Hammerstein's Cinderella, Mary Poppins, Wizard of Oz, Beauty and the Beast and Aladdin.",
  },
];

export const investmentSteps = [
  {
    step: "1",
    title: "Required Capital Raise",
    body: `The 2027 World Premiere Required Capital Raise is ${formatGbp(capitalRequirement)}, with weekly running costs of ${formatGbp(weeklyRunningCosts)}.`,
  },
  {
    step: "2",
    title: "Pre-recoupment",
    body: "Prior to recoupment, remaining Net Profits are applied pro rata among holders of new Investor Participation Units until accepted new Investor Capital has been returned. The 175 Historic Development Participation Units held by historical development investors are excluded from this tier.",
  },
  {
    step: "3",
    title: "World Premiere schedule",
    body: `${totalPerformanceWeeks} weeks across Leeds, Hull and London provide total gross box office potential of ${formatGbp(totalGrossBoxOfficePotential)}.`,
  },
  {
    step: "4",
    title: "Post-recoupment split",
    body: "Following Recoupment, Net Profits are split 60/40 between the Investors' Profit Pool and Producer Participation Pool; the investor pool is shared across all Units then outstanding.",
  },
  {
    step: "5",
    title: "Foundational participation",
    body: "Foundational Investors have the opportunity to maintain their proportional Participation Interest in qualifying future Transfer Productions by investing their corresponding share of the new capitalization. They are under no obligation to reinvest, and future productions are not guaranteed.",
  },
];

export const recoupmentRows = commercialScenarios.map((scenario) => ({
  capacity: scenario.label,
  gross: formatGbp(scenario.grossBoxOffice),
  net: formatGbp(scenario.netBoxOffice),
  surplus: formatGbp(scenario.productionSurplus),
  operatingProfit: formatGbp(scenario.operatingProfit),
  investorReturn: formatGbp(scenario.investorReturnPool),
}));

export const investmentTerms = [
  "Co-Producer credit guideline, subject to Producer approval and discretion.",
  "Associate Producer credit guideline, subject to Producer approval and discretion.",
  "Standard terms for investments below £99,999 with no title billing.",
  "Investors are entitled pro rata to repayment of subscriptions from 100% of net surplus prior to recoupment.",
  "Investors receive their percentage share of net profit following recoupment.",
  "Two pairs of tickets to the official opening performance in Leeds and a pair in Hull and London during the World Premiere, subject to availability.",
  "Foundational Investors have the opportunity to maintain their proportional Participation Interest in qualifying future Transfer Productions by investing their corresponding share of the new capitalization. They are under no obligation to reinvest, and future productions are not guaranteed.",
];

export const exampleInvestment = {
  investor: "Pamela Dare",
  investment: "£100,000",
  body: [
    "Pamela Dare invests £100,000.",
    `The World Premiere has total gross box office potential of ${formatGbp(totalGrossBoxOfficePotential)}.`,
    `The capital requirement is ${formatGbp(capitalRequirement)} and weekly running costs are ${formatGbp(weeklyRunningCosts)}.`,
    "At the 100% capacity scenario, investor capital is recouped before the 60/40 post-recoupment profit split.",
    `Pamela's investment represents ${((100_000 / capitalRequirement) * 100).toFixed(3)}% of accepted new Investor Capital for recoupment, but 100 of ${fullySubscribedUnits} Units (${((100 / fullySubscribedUnits) * 100).toFixed(4)}%) for post-recoupment participation if fully subscribed.`,
    "Foundational Investors have the opportunity to maintain their proportional Participation Interest in qualifying future Transfer Productions by investing their corresponding share of the new capitalization; they are under no obligation to reinvest, and future productions are not guaranteed.",
  ],
};

export const disclaimerParagraphs = [
  "Financial projections, estimates, illustrations and forward-looking statements are based on assumptions considered reasonable at the time they are made, but actual results may differ materially. No representation or warranty is made that any projected or illustrative result will be achieved.",
  "Nothing in this presentation constitutes a profit forecast or a guarantee of future performance.",
  "Theatrical production is an inherently risky business. Contributions to the Production involve a higher level of risk than most other financial transactions and there is no probability, but only a possibility, that investors will get back the amount which they invest.",
  "A contribution to the Production is not transferable without the Producer's prior written consent. Once an investment is committed and cleared funds are received, it is final and cannot be withdrawn, redeemed, or cancelled at the investor's discretion.",
  "The opportunity described may not be suitable for all recipients. Prospective investors are strongly advised to seek independent advice from a financial adviser authorised under the Financial Services and Markets Act 2000 and experienced in theatre and entertainment investments.",
  "This presentation is intended only for persons to whom it may lawfully be communicated under the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005. Applicability of any exemption depends on the recipient, the investment and the circumstances of communication.",
];

export const foreignExchangeCopy = [
  "USD equivalents displayed in this presentation are illustrative.",
  "The applicable exchange rate for a USD-denominated subscription will be specified in the relevant Subscription Agreement or investment records.",
  "Exchange-rate movements may affect the GBP value of non-GBP subscriptions and distributions unless the applicable investment documents expressly provide otherwise.",
];

export const resourceLinks = {
  trailer: "https://youtu.be/oMAjca-pgr4",
  soundtrack: "https://on.soundcloud.com/oA0vsPmD8cO1KgXZm1",
  concert: "https://vimeo.com/1153007249/46d6e7bcca?fl=ip&fe=ec",
  contact: "mailto:krislythgoe@me.com",
};

export const creativeTeam = teamMembers;
export const tourStops = venues;
