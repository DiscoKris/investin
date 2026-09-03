import type { Investor } from "./types";

type AddressSource = Pick<
  Investor,
  "address" | "addressLine1" | "addressLine2" | "city" | "region" | "postalCode" | "country"
>;

export function getInvestorAddress(investor: AddressSource) {
  if (investor.address !== undefined) return investor.address;

  const locality = [investor.city, investor.region]
    .filter(Boolean)
    .join(", ");
  const localityAndPostcode = [locality, investor.postalCode]
    .filter(Boolean)
    .join(" ");

  return [
    investor.addressLine1,
    investor.addressLine2,
    localityAndPostcode,
    investor.country,
  ]
    .filter(Boolean)
    .join("\n");
}
