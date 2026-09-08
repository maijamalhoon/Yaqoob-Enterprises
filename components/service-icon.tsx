import {
  BriefcaseBusiness,
  FileText,
  Fingerprint,
  Laptop,
  Printer,
  ScrollText,
  ShoppingBag,
  Ticket,
  WalletCards,
} from "lucide-react";

const icons = {
  printer: Printer,
  "file-text": FileText,
  fingerprint: Fingerprint,
  "scroll-text": ScrollText,
  "wallet-cards": WalletCards,
  ticket: Ticket,
  "shopping-bag": ShoppingBag,
  laptop: Laptop,
  briefcase: BriefcaseBusiness,
};

export function ServiceIcon({ iconKey, size = 24 }: { iconKey: string; size?: number }) {
  const Icon = icons[iconKey as keyof typeof icons] || BriefcaseBusiness;
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}
