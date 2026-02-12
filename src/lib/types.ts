export interface Registration {
  id: string;
  reg_id: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  college_school: string;
  department: string;
  departments_selected: string[];
  selected_events: string[];
  total_events: number;
  status: string;
  created_at: string;
}
