export interface HsSectionDef {
  id: string;
  name: string;
  emoji: string;
  chapters: string[];
  color: string;
}

export const HS_SECTIONS: HsSectionDef[] = [
  { id: "I",    name: "Live Animals & Products", emoji: "🐄", chapters: ["01","02","03","04","05"], color: "#a3be8c" },
  { id: "II",   name: "Vegetable Products",      emoji: "🌾", chapters: ["06","07","08","09","10","11","12","13","14"], color: "#8fbf6a" },
  { id: "III",  name: "Fats & Oils",             emoji: "🫒", chapters: ["15"], color: "#f0a830" },
  { id: "IV",   name: "Food & Beverages",        emoji: "🍫", chapters: ["16","17","18","19","20","21","22","23","24"], color: "#d08770" },
  { id: "V",    name: "Mineral Products",        emoji: "🛢️", chapters: ["25","26","27"], color: "#4a4a5a" },
  { id: "VI",   name: "Chemicals",               emoji: "⚗️", chapters: ["28","29","30","31","32","33","34","35","36","37","38"], color: "#5e81ac" },
  { id: "VII",  name: "Plastics & Rubber",       emoji: "🧪", chapters: ["39","40"], color: "#8090a8" },
  { id: "VIII", name: "Leather & Hides",         emoji: "👜", chapters: ["41","42","43"], color: "#a07848" },
  { id: "IX",   name: "Wood & Paper",            emoji: "🪵", chapters: ["44","45","46","47","48","49"], color: "#8d6e4e" },
  { id: "X",    name: "Textiles & Clothing",     emoji: "👗", chapters: ["50","51","52","53","54","55","56","57","58","59","60","61","62","63"], color: "#c0a0b8" },
  { id: "XI",   name: "Footwear",                emoji: "👟", chapters: ["64","65","66","67"], color: "#a07860" },
  { id: "XII",  name: "Stone, Glass & Ceramics", emoji: "🪨", chapters: ["68","69","70"], color: "#909090" },
  { id: "XIII", name: "Precious Metals & Gems",  emoji: "💎", chapters: ["71"], color: "#d4a017" },
  { id: "XIV",  name: "Base Metals",             emoji: "⚙️", chapters: ["72","73","74","75","76","77","78","79","80","81","82","83"], color: "#708090" },
  { id: "XV",   name: "Machinery & Electronics", emoji: "🖥️", chapters: ["84","85"], color: "#2e7d32" },
  { id: "XVI",  name: "Transport Equipment",     emoji: "🚗", chapters: ["86","87","88","89"], color: "#c0392b" },
  { id: "XVII", name: "Instruments & Optics",    emoji: "🔬", chapters: ["90","91","92"], color: "#6b46c1" },
  { id: "XVIII",name: "Arms & Ammunition",       emoji: "🛡️", chapters: ["93"], color: "#8b0000" },
  { id: "XIX",  name: "Misc. Manufactures",      emoji: "🪑", chapters: ["94","95","96"], color: "#a0aec0" },
  { id: "XX",   name: "Art & Antiques",          emoji: "🎨", chapters: ["97"], color: "#f6ad55" },
];

// Map HS4 code → section
export function getSectionForHs4(hs4: string): HsSectionDef | undefined {
  const chapter = hs4.substring(0, 2);
  return HS_SECTIONS.find((s) => s.chapters.includes(chapter));
}
