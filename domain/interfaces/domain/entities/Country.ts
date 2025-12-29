export interface Country {
  code: number; // Primary key from the database
  name: string;
  code_iso_alpha_2: string;
  code_iso_alpha_3: string;
  code_iso_numeric: number;
}

export interface CreateCountryData {
  name: string;
  code_iso_alpha_2: string;
  code_iso_alpha_3: string;
  code_iso_numeric: number;
}

export interface UpdateCountryData {
  name?: string;
  code_iso_alpha_2?: string;
  code_iso_alpha_3?: string;
  code_iso_numeric?: number;
}