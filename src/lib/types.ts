export interface Registration {
  id: string;
  reg_id: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  departments_selected: string[];
  selected_events: string[];
  total_events: number;
  payment_status: string;
  payment_id: string | null;
  amount: number;
  created_at: string;
}
