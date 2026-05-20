export type PresentationRoute = {
  href: string;
  aliases?: string[];
};

export const presentationFlow: PresentationRoute[] = [
  { href: "/" },
  { href: "/calculator" },
  { href: "/story" },
  { href: "/sizzle" },
  { href: "/legacy" },
  { href: "/why-now" },
  { href: "/target-audience" },
  { href: "/creative-team" },
  { href: "/er-braithwaite" },
  { href: "/music-lyrics-book" },
  { href: "/sets-costumes" },
  { href: "/60th-anniversary-tour", aliases: ["/tour"] },
  { href: "/producers" },
  { href: "/investment" },
  { href: "/titles-and-terms" },
  { href: "/opportunity" },
  { href: "/recoupment-chart" },
  { href: "/example-investment" },
  { href: "/disclaimer", aliases: ["/disclaimers"] },
];

export const totalPresentationPages = presentationFlow.length;

export function getPresentationStep(pathname: string) {
  const routeIndex = presentationFlow.findIndex((route) => {
    if (route.href === pathname) {
      return true;
    }

    return route.aliases?.includes(pathname) ?? false;
  });

  if (routeIndex === -1) {
    return null;
  }

  return {
    currentPage: routeIndex + 1,
    totalPages: totalPresentationPages,
    route: presentationFlow[routeIndex],
  };
}
