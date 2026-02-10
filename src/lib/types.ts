export interface Registration {
  id: string;
  reg_id: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  selected_events: string[];
  payment_status: string;
  payment_id: string | null;
  amount: number;
  created_at: string;
}
