// OEC-matching color palette: every chapter within a section shares a color family.
// Base hues match what OEC/Tradle actually show in their treemaps.

export interface HsSection {
  name: string;
  color: string;
}

// Section color families (hue anchors):
// Animals/Fish      → teal-green  #1a9e74 family
// Vegetables        → green       #3d9970 family
// Fats              → olive-green #7fba00 family
// Food & Beverages  → orange      #e67e22 family
// Mineral Products  → gold/amber  #c8960c family  (oil = dark amber, ores = mid)
// Chemicals/Pharma  → magenta-pink #c0286a family
// Plastics/Rubber   → steel-rose  #a0647a family
// Leather           → sienna      #9c5221 family
// Wood & Paper      → brown-green #6b8c3e family
// Textiles          → lilac-purple #7c5cbf family
// Footwear          → rust        #b04a2a family
// Stone/Glass       → slate-gray  #607080 family
// Precious Metals   → gold        #c8960c family (shared with minerals, lighter)
// Base Metals       → steel-tan   #8b7355 family
// Machinery         → sky-blue    #1a6fa8 family
// Transport         → vivid blue  #1255a0 family  (OEC uses similar blue family)
// Instruments       → indigo      #5c3d99 family
// Arms              → crimson     #8b0000 family
// Misc              → slate-blue  #546e7a family
// Art               → amber       #c49a1a family

const SECTIONS: Record<string, HsSection> = {
  // Section I — Live Animals & Animal Products (teal-green)
  "01": { name: "Live Animals",      color: "#1a9e74" },
  "02": { name: "Meat",              color: "#16896a" },
  "03": { name: "Fish & Seafood",    color: "#13756a" },
  "04": { name: "Dairy & Eggs",      color: "#1ab88a" },
  "05": { name: "Animal Products",   color: "#23c495" },

  // Section II — Vegetable Products (green)
  "06": { name: "Live Plants",       color: "#3d9970" },
  "07": { name: "Vegetables",        color: "#2e8b57" },
  "08": { name: "Fruit",             color: "#27ae60" },
  "09": { name: "Coffee & Spices",   color: "#1e8449" },
  "10": { name: "Cereals",           color: "#229954" },
  "11": { name: "Milling Products",  color: "#58a87a" },
  "12": { name: "Oil Seeds",         color: "#45a066" },
  "13": { name: "Plant Extracts",    color: "#52b077" },
  "14": { name: "Vegetable Materials", color: "#5bba7d" },

  // Section III — Fats & Oils (olive)
  "15": { name: "Fats & Oils",       color: "#7fba00" },

  // Section IV — Food, Beverages & Tobacco (orange)
  "16": { name: "Prepared Meat",     color: "#e67e22" },
  "17": { name: "Sugar",             color: "#d68910" },
  "18": { name: "Cocoa & Chocolate", color: "#b8680c" },
  "19": { name: "Baked Goods",       color: "#ca720e" },
  "20": { name: "Preserved Food",    color: "#e8820a" },
  "21": { name: "Misc. Food",        color: "#f39c12" },
  "22": { name: "Beverages",         color: "#eb9206" },
  "23": { name: "Food Residues",     color: "#d5861a" },
  "24": { name: "Tobacco",           color: "#b07320" },

  // Section V — Mineral Products (dark amber / near-black for coal/oil)
  "25": { name: "Salt & Stone",      color: "#9e8060" },
  "26": { name: "Ores & Slag",       color: "#8b7044" },
  "27": { name: "Mineral Fuels",     color: "#c8960c" },  // oil/gas — OEC gold

  // Section VI — Chemicals & Pharmaceuticals (magenta-pink)
  "28": { name: "Inorganic Chemicals", color: "#c0286a" },
  "29": { name: "Organic Chemicals",  color: "#b02060" },
  "30": { name: "Pharmaceuticals",    color: "#d4327a" },
  "31": { name: "Fertilizers",        color: "#a81e5a" },
  "32": { name: "Dyes & Pigments",    color: "#bc2572" },
  "33": { name: "Cosmetics",          color: "#cc3080" },
  "34": { name: "Soaps",              color: "#c82e78" },
  "35": { name: "Proteins & Starches",color: "#b52868" },
  "36": { name: "Explosives",         color: "#a82060" },
  "37": { name: "Photo Materials",    color: "#c02875" },
  "38": { name: "Misc. Chemicals",    color: "#b0245c" },

  // Section VII — Plastics & Rubber (muted rose)
  "39": { name: "Plastics",           color: "#a0647a" },
  "40": { name: "Rubber",             color: "#8c5266" },

  // Section VIII — Leather (sienna)
  "41": { name: "Leather",            color: "#9c5221" },
  "42": { name: "Leather Goods",      color: "#8a4818" },
  "43": { name: "Furskins",           color: "#ae5e28" },

  // Section IX–X — Wood & Paper (olive-brown)
  "44": { name: "Timber",             color: "#6b8c3e" },
  "45": { name: "Cork",               color: "#5e7c35" },
  "46": { name: "Basketware",         color: "#526e2e" },
  "47": { name: "Pulp",               color: "#7a9e48" },
  "48": { name: "Paper",              color: "#8aae50" },
  "49": { name: "Printed Matter",     color: "#7a9c44" },

  // Section XI — Textiles & Clothing (lilac-purple)
  "50": { name: "Silk",               color: "#7c5cbf" },
  "51": { name: "Wool",               color: "#7255b0" },
  "52": { name: "Cotton",             color: "#8462c8" },
  "53": { name: "Plant Fibers",       color: "#6a4eaa" },
  "54": { name: "Man-made Filaments", color: "#9070d0" },
  "55": { name: "Synthetic Fibers",   color: "#7c60ba" },
  "56": { name: "Wadding & Felt",     color: "#7058b0" },
  "57": { name: "Carpets",            color: "#6650a0" },
  "58": { name: "Special Fabrics",    color: "#8066c0" },
  "59": { name: "Coated Fabrics",     color: "#7460b8" },
  "60": { name: "Knitted Fabric",     color: "#886ac5" },
  "61": { name: "Knitted Clothing",   color: "#9474cc" },
  "62": { name: "Woven Clothing",     color: "#8a6ec8" },
  "63": { name: "Other Textiles",     color: "#7c62bc" },

  // Section XII — Footwear (rust)
  "64": { name: "Footwear",           color: "#b04a2a" },
  "65": { name: "Headgear",           color: "#9e3e20" },
  "66": { name: "Umbrellas",          color: "#a44224" },
  "67": { name: "Feathers",           color: "#bc5230" },

  // Section XIII — Stone, Glass & Ceramics (slate)
  "68": { name: "Stone & Cement",     color: "#607080" },
  "69": { name: "Ceramics",           color: "#546878" },
  "70": { name: "Glass",              color: "#6c7e8e" },

  // Section XIV — Precious Metals & Gems (gold)
  "71": { name: "Precious Metals",    color: "#c8960c" },

  // Section XV — Base Metals (warm steel-tan)
  "72": { name: "Iron & Steel",       color: "#8b7355" },
  "73": { name: "Steel Articles",     color: "#957e60" },
  "74": { name: "Copper",             color: "#a08060" },
  "75": { name: "Nickel",             color: "#8a7050" },
  "76": { name: "Aluminum",           color: "#9e8a6a" },
  "77": { name: "Reserved",           color: "#907a55" },
  "78": { name: "Lead",               color: "#806a45" },
  "79": { name: "Zinc",               color: "#8c7558" },
  "80": { name: "Tin",                color: "#998068" },
  "81": { name: "Other Metals",       color: "#887060" },
  "82": { name: "Tools",              color: "#806858" },
  "83": { name: "Metal Articles",     color: "#8a7260" },

  // Section XVI — Machinery & Electronics (sky-blue)
  "84": { name: "Machinery",          color: "#1a6fa8" },
  "85": { name: "Electronics",        color: "#1580c0" },

  // Section XVII — Transport Equipment (vivid blue, slightly darker than machinery)
  "86": { name: "Railways",           color: "#1255a0" },
  "87": { name: "Vehicles",           color: "#1060b8" },
  "88": { name: "Aircraft",           color: "#0e50a0" },
  "89": { name: "Ships",              color: "#1468b0" },

  // Section XVIII — Instruments & Optics (indigo)
  "90": { name: "Instruments",        color: "#5c3d99" },
  "91": { name: "Clocks & Watches",   color: "#523588" },
  "92": { name: "Musical Instruments",color: "#6644aa" },

  // Section XIX — Arms (crimson)
  "93": { name: "Arms",               color: "#8b0000" },

  // Section XX — Misc. Manufactures (slate-blue)
  "94": { name: "Furniture",          color: "#546e7a" },
  "95": { name: "Toys & Games",       color: "#607d8b" },
  "96": { name: "Misc. Manufactures", color: "#5c7280" },

  // Section XXI — Art & Antiques (amber)
  "97": { name: "Art & Antiques",     color: "#c49a1a" },
};

export function getSection(hs4: string): HsSection {
  const chapter = hs4.substring(0, 2);
  return SECTIONS[chapter] ?? { name: "Other", color: "#607080" };
}
