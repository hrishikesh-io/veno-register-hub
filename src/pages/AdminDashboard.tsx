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
  Users, IndianRupee, AlertCircle, CalendarDays, LogOut, Download, Search, Filter,
} from "lucide-react";
import { EVENT_CATEGORIES, getEventNameById } from "@/lib/events";
import type { Registration } from "@/lib/types";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchRegistrations();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) {
      await supabase.auth.signOut();
      navigate("/admin/login");
    }
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map((r: any) => ({
        ...r,
        selected_events: Array.isArray(r.selected_events) ? r.selected_events : [],
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
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.college.toLowerCase().includes(search.toLowerCase()) ||
      r.reg_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = registrations.filter((r) => r.payment_status === "paid").length;
  const totalFailed = registrations.filter((r) => r.payment_status === "failed").length;
  const todayCount = registrations.filter(
    (r) => new Date(r.created_at).toDateString() === new Date().toDateString()
  ).length;

  const exportData = (data: Registration[], filename: string, format: "xlsx" | "csv") => {
    const rows = data.map((r) => ({
      "Reg ID": r.reg_id,
      Name: r.name,
      Gender: r.gender,
      Email: r.email,
      Phone: r.phone,
      College: r.college,
      Department: r.department,
      Events: r.selected_events.map(getEventNameById).join(", "),
      "Payment Status": r.payment_status,
      "Payment ID": r.payment_id || "",
      Amount: r.amount,
      "Date & Time": new Date(r.created_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    }
  };

  const getEventRegistrations = (eventId: string) =>
    registrations.filter(
      (r) => r.selected_events.includes(eventId) && r.payment_status === "paid"
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            Ven-O-vation Admin
          </h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container py-8 px-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Registrations" value={registrations.length} />
          <StatCard icon={IndianRupee} label="Total Paid" value={totalPaid} color="text-green-600" />
          <StatCard icon={AlertCircle} label="Failed Payments" value={totalFailed} color="text-destructive" />
          <StatCard icon={CalendarDays} label="Today" value={todayCount} color="text-primary" />
        </div>

        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-grid">
            <TabsTrigger value="participants">All Participants</TabsTrigger>
            <TabsTrigger value="programs">Program-wise</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          {/* All Participants */}
          <TabsContent value="participants" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, college, or reg ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "paid", "failed", "pending"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="card-elevated overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-sm font-medium">{r.reg_id}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell className="text-sm">{r.email}</TableCell>
                        <TableCell className="text-sm">{r.college}</TableCell>
                        <TableCell>
                          <Badge
                            variant={r.payment_status === "paid" ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {r.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Program-wise */}
          <TabsContent value="programs" className="space-y-6">
            {EVENT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="card-elevated p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {category.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.events.map((event) => {
                      const eventRegs = getEventRegistrations(event.id);
                      return (
                        <div key={event.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{event.name}</h4>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                            </div>
                            <Badge variant="outline">{eventRegs.length} participants</Badge>
                          </div>
                          {eventRegs.length > 0 ? (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Reg ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>College</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {eventRegs.map((r) => (
                                    <TableRow key={r.id}>
                                      <TableCell className="font-mono text-sm">{r.reg_id}</TableCell>
                                      <TableCell>{r.name}</TableCell>
                                      <TableCell>{r.phone}</TableCell>
                                      <TableCell className="text-sm">{r.email}</TableCell>
                                      <TableCell className="text-sm">{r.college}</TableCell>
                                      <TableCell>
                                        <Badge variant="default" className="capitalize">
                                          {r.payment_status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">
                              No registrations yet
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Downloads */}
          <TabsContent value="downloads" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                All Registrations
              </h3>
              <div className="flex gap-3">
                <Button onClick={() => exportData(registrations, "all_registrations", "xlsx")} className="gap-2">
                  <Download className="h-4 w-4" /> Download Excel
                </Button>
                <Button variant="outline" onClick={() => exportData(registrations, "all_registrations", "csv")} className="gap-2">
                  <Download className="h-4 w-4" /> Download CSV
                </Button>
              </div>
            </div>

            {EVENT_CATEGORIES.map((category) => (
              <div key={category.id} className="card-elevated p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.events.map((event) => {
                    const eventRegs = getEventRegistrations(event.id);
                    const safeName = event.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
                    return (
                      <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50">
                        <div>
                          <span className="font-medium text-foreground text-sm">{event.name}</span>
                          <span className="text-muted-foreground text-xs ml-2">
                            ({eventRegs.length} participants)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={eventRegs.length === 0}
                            onClick={() => exportData(eventRegs, safeName + "_registrations", "xlsx")}
                          >
                            Excel
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={eventRegs.length === 0}
                            onClick={() => exportData(eventRegs, safeName + "_registrations", "csv")}
                          >
                            CSV
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color?: string;
}) => (
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
