import { Country } from "./country.interface";

export interface State {
  id: number;
  name: string;
  country_id: number;
  remarks: string | null;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
  country_details?: Country;
}
