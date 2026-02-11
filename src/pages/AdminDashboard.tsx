import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, CalendarDays, LogOut, Download, Search,
} from "lucide-react";
import { EVENT_CATEGORIES, DEPARTMENTS, getAllEvents, getEventNameById, getDepartmentLabel } from "@/lib/events";
import type { Registration } from "@/lib/types";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchRegistrations();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login"); return; }
    const { data: roleData } = await supabase
      .from("user_roles").select("role")
      .eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (!roleData) { await supabase.auth.signOut(); navigate("/admin/login"); }
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map((r: any) => ({
        ...r,
        selected_events: Array.isArray(r.selected_events) ? r.selected_events : [],
        departments_selected: Array.isArray(r.departments_selected) ? r.departments_selected : [],
        total_events: r.total_events || 0,
      }));
      setRegistrations(mapped as Registration[]);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filtered = registrations.filter((r) => {
    const matchesSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.college.toLowerCase().includes(search.toLowerCase()) ||
      r.reg_id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "all" ||
      (r.departments_selected && r.departments_selected.includes(deptFilter));
    const matchesEvent = eventFilter === "all" ||
      r.selected_events.includes(eventFilter);
    return matchesSearch && matchesDept && matchesEvent;
  });

  const todayCount = registrations.filter(
    (r) => new Date(r.created_at).toDateString() === new Date().toDateString()
  ).length;

  const exportRows = (data: Registration[]) =>
    data.map((r) => ({
      "Registration ID": r.reg_id,
      Name: r.name,
      Email: r.email,
      Phone: r.phone,
      College: r.college,
      Departments: (r.departments_selected || []).map(getDepartmentLabel).join(", "),
      "Events Selected": r.selected_events.map(getEventNameById).join(", "),
      "Total Events": r.total_events,
      "Date & Time": new Date(r.created_at).toLocaleString(),
    }));

  const downloadFile = (rows: any[], filename: string, format: "xlsx" | "csv") => {
    const ws = XLSX.utils.json_to_sheet(rows);
    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    }
  };

  const exportData = (data: Registration[], filename: string, format: "xlsx" | "csv") =>
    downloadFile(exportRows(data), filename, format);

  const getEventRegistrations = (eventId: string) =>
    registrations.filter((r) => r.selected_events.includes(eventId));

  const getDeptRegistrations = (deptId: string) =>
    registrations.filter((r) => r.departments_selected?.includes(deptId));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <h1 className="font-display text-xl font-bold text-foreground">Ven-O-vation Admin</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container py-8 px-4">
        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} label="Total Registrations" value={registrations.length} />
          <StatCard icon={CalendarDays} label="Today" value={todayCount} color="text-primary" />
          <StatCard icon={Users} label="Total Events Selected" value={registrations.reduce((s, r) => s + r.total_events, 0)} color="text-secondary" />
        </div>

        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full md:w-auto md:inline-grid">
            <TabsTrigger value="participants">All Participants</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          {/* All Participants */}
          <TabsContent value="participants" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, college, or reg ID..."
                  value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"
                />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Event" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {getAllEvents().map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="card-elevated overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-sm font-medium">{r.reg_id}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="text-sm">{r.email}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell className="text-sm">{r.college}</TableCell>
                        <TableCell className="text-sm">{(r.departments_selected || []).map(getDepartmentLabel).join(", ")}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{r.selected_events.map(getEventNameById).join(", ")}</TableCell>
                        <TableCell>{r.total_events}</TableCell>
                        <TableCell className="text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Downloads */}
          <TabsContent value="downloads" className="space-y-6">
            {/* Master CSV */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                Master List — All Registrations
              </h3>
              <div className="flex gap-3">
                <Button onClick={() => exportData(registrations, "State_TechFest_Registrations", "xlsx")} className="gap-2">
                  <Download className="h-4 w-4" /> Excel
                </Button>
                <Button variant="outline" onClick={() => exportData(registrations, "State_TechFest_Registrations", "csv")} className="gap-2">
                  <Download className="h-4 w-4" /> CSV
                </Button>
              </div>
            </div>

            {/* Department-wise */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">Department-wise Downloads</h3>
              <div className="space-y-3">
                {DEPARTMENTS.map((dept) => {
                  const deptRegs = getDeptRegistrations(dept.id);
                  const safeName = dept.label.replace(/\s+/g, "_") + "_Registrations";
                  return (
                    <div key={dept.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
                      <div>
                        <span className="font-medium text-foreground text-sm">{dept.label}</span>
                        <span className="text-muted-foreground text-xs ml-2">({deptRegs.length} participants)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={deptRegs.length === 0}
                          onClick={() => exportData(deptRegs, safeName, "xlsx")}>Excel</Button>
                        <Button size="sm" variant="outline" disabled={deptRegs.length === 0}
                          onClick={() => exportData(deptRegs, safeName, "csv")}>CSV</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event-wise */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">Event-wise Downloads</h3>
              <div className="space-y-3">
                {getAllEvents().map((event) => {
                  const eventRegs = getEventRegistrations(event.id);
                  const safeName = event.name.replace(/[^a-zA-Z0-9]+/g, "_") + "_Participants";
                  return (
                    <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
                      <div>
                        <span className="font-medium text-foreground text-sm">{event.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">({eventRegs.length} participants)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={eventRegs.length === 0}
                          onClick={() => exportData(eventRegs, safeName, "xlsx")}>Excel</Button>
                        <Button size="sm" variant="outline" disabled={eventRegs.length === 0}
                          onClick={() => exportData(eventRegs, safeName, "csv")}>CSV</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color?: string }) => (
  <div className="card-elevated p-5">
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${color || "text-muted-foreground"}`} />
      <div>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
