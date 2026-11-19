/** Published 2026 rate list supplied by Yaqoob Enterprises. Prices in Pakistani rupees. */
export type RateItem = {
  label: string;
  price: string;
  featured?: boolean;
  previewLabel?: string;
};

export type RateGroup = {
  id: string;
  title: string;
  items: RateItem[];
};

export const rateGroups: RateGroup[] = [
  {
    id: "black-and-white",
    title: "Black & white",
    items: [
      { label: "A4 Photocopy", price: "10", featured: true },
      { label: "A4 Print", price: "15", featured: true },
      { label: "A3 Print / Photocopy", price: "50" },
      { label: "CNIC Photocopy (4 copies)", price: "20" },
      { label: "CNIC Photocopy (8 copies)", price: "30" },
    ],
  },
  {
    id: "colour-printing",
    title: "Colour printing",
    items: [
      { label: "A4 · 70 GSM · Text", price: "30", featured: true, previewLabel: "A4 Colour Text" },
      { label: "A4 · 70 GSM · Full Colour", price: "40–50" },
      { label: "A4 · 130 GSM Photo Paper", price: "60–100*" },
      { label: "A4 · 200+ GSM Photo Paper", price: "80–200*" },
      { label: "A4 Glossy Sticker Print", price: "100–200*" },
      { label: "A3 Colour Print", price: "150–300*" },
    ],
  },
  {
    id: "photos",
    title: "Photos",
    items: [
      { label: "Passport Size Photos (Set of 8)", price: "200", featured: true, previewLabel: "Passport Photos · 8" },
      { label: "4R Glossy Photo (200 GSM)", price: "80–120*" },
    ],
  },
  {
    id: "lamination-and-binding",
    title: "Lamination & binding",
    items: [
      { label: "A4 Soft Lamination", price: "70", featured: true },
      { label: "A4 Hard Lamination", price: "100" },
      { label: "Tape Binding", price: "100" },
      { label: "Spiral Binding", price: "200" },
    ],
  },
  {
    id: "other-services",
    title: "Other services",
    items: [
      { label: "PVC Card Printing", price: "200" },
      { label: "Letterhead Print", price: "20" },
      { label: "Scanning (Per Page)", price: "20", featured: true },
    ],
  },
];

export const featuredRates = rateGroups.flatMap((group) =>
  group.items.filter((item) => item.featured),
);
