export interface Country {
  id: number;
  name: string;
  remarks: string | null;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}