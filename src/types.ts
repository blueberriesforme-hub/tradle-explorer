export interface CountryData {
  name: string;
  total: number; // millions USD
  products: ProductExport[];
}

export interface ProductExport {
  code: string;  // HS4
  name: string;
  value: number; // millions USD
}

export interface ProductData {
  name: string;
  exporters: Record<string, number>; // iso → millions USD
}

export interface TradeData {
  year: number;
  countries: Record<string, CountryData>;
  products: Record<string, ProductData>;
}
