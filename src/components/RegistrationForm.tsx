import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, GraduationCap, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import EventSelection from "./EventSelection";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTMENTS, EVENT_CATEGORIES } from "@/lib/events";

const formSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  college: z.string().trim().min(2, "College name is required").max(200),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventError, setEventError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { college: "MVGM GPC Vennikulam" },
  });

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments((prev) => {
      const next = prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId];
      // Remove events from deselected departments
      if (!next.includes(deptId)) {
        const cat = EVENT_CATEGORIES.find((c) => c.id === deptId);
        if (cat) {
          const eventIds = cat.events.map((e) => e.id);
          setSelectedEvents((prev) => prev.filter((id) => !eventIds.includes(id)));
        }
      }
      return next;
    });
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
    setEventError("");
  };

  const onSubmit = async (data: FormValues) => {
    if (selectedEvents.length === 0) {
      setEventError("Please select at least one event");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate email
      const { data: existing } = await supabase
        .from("registrations")
        .select("email")
        .eq("email", data.email.toLowerCase())
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already Registered",
          description: "This email is already registered. Please use a different email.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("registrations")
        .insert({
          name: data.name,
          gender: "Not specified",
          email: data.email.toLowerCase(),
          phone: data.phone,
          college: data.college,
          department: selectedDepartments.join(", "),
          departments_selected: selectedDepartments,
          selected_events: selectedEvents,
          total_events: selectedEvents.length,
          payment_status: "registered",
          amount: 0,
          reg_id: "",
        } as any);

      if (error) {
        if (error.message.includes("duplicate") || error.message.includes("idx_registrations_email_unique")) {
          toast({
            title: "Already Registered",
            description: "This email is already registered.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setIsSubmitting(false);
        return;
      }

      // Show success popup
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        setSelectedDepartments([]);
        setSelectedEvents([]);
      }, 3000);
    } catch (err: any) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="section-gradient py-16 md:py-24 px-4" id="register">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-2xl p-10 text-center shadow-2xl max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Registration Successful.
              </h2>
              <p className="text-muted-foreground text-sm">Auto-closing in 3 seconds...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-3">
            Register Now
          </h2>
          <p className="text-muted-foreground font-body">
            Fill in your details and choose your events
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Step 1: Personal Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-elevated p-6 md:p-8"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
             Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Full Name *
                </Label>
                <Input id="name" placeholder="Your full name" {...register("name")} />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-primary" /> Email *
                </Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-primary" /> Phone *
                </Label>
                <Input id="phone" placeholder="10-digit number" {...register("phone")} />
                {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="college" className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" /> College/Institution *
                </Label>
                <Input id="college" placeholder="Your college name" {...register("college")} />
                {errors.college && <p className="text-destructive text-xs">{errors.college.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Step 2: Department Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-elevated p-6 md:p-8"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Select Departments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DEPARTMENTS.map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedDepartments.includes(dept.id)}
                    onCheckedChange={() => toggleDepartment(dept.id)}
                  />
                  <span className="font-medium text-foreground text-sm">{dept.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Step 3: Event Selection */}
          <EventSelection
            selectedEvents={selectedEvents}
            selectedDepartments={selectedDepartments}
            onToggle={toggleEvent}
          />
          {eventError && (
            <p className="text-destructive text-sm text-center font-medium">{eventError}</p>
          )}

          {/* Selected count + Register button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-4"
          >
            {selectedEvents.length > 0 && (
              <p className="text-muted-foreground text-sm mb-4 font-body">
                {selectedEvents.length} event{selectedEvents.length > 1 ? "s" : ""} selected
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="btn-glow text-primary-foreground text-lg px-12 py-7 rounded-full font-display font-semibold w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
