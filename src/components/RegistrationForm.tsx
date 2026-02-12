import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, GraduationCap, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EventSelection from "./EventSelection";
import { supabase } from "@/integrations/supabase/client";
import { EVENT_CATEGORIES } from "@/lib/events";

const formSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  college_school: z.string().trim().min(2, "College/School name is required").max(200),
  gender: z.enum(["Male", "Female"], { required_error: "Please select your gender" }),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
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
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const genderValue = watch("gender");

  // Derive departments from selected events
  const getDepartmentsFromEvents = (events: string[]) => {
    const depts = new Set<string>();
    for (const eventId of events) {
      const cat = EVENT_CATEGORIES.find((c) => c.events.some((e) => e.id === eventId));
      if (cat) depts.add(cat.id);
    }
    return Array.from(depts);
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
    const departmentsSelected = getDepartmentsFromEvents(selectedEvents);

    try {
      const { error } = await supabase
        .from("registrations")
        .insert({
          name: data.name,
          gender: data.gender,
          email: data.email.toLowerCase(),
          phone: data.phone,
          college_school: data.college_school,
          department: departmentsSelected.join(", "),
          departments_selected: departmentsSelected,
          selected_events: selectedEvents,
          total_events: selectedEvents.length,
          status: "Registered",
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

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        reset();
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
                Registration Successful!
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
          {/* Personal Details */}
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
                <Label htmlFor="gender" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Gender *
                </Label>
                <Select value={genderValue} onValueChange={(val) => setValue("gender", val as "Male" | "Female", { shouldValidate: true })}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="college_school" className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" /> College/School Name *
                </Label>
                <Input id="college_school" placeholder="Your college or school name" {...register("college_school")} />
                {errors.college_school && <p className="text-destructive text-xs">{errors.college_school.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Event Selection - All events shown as cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-elevated p-6 md:p-8"
          >
            <EventSelection
              selectedEvents={selectedEvents}
              onToggle={toggleEvent}
            />
          </motion.div>

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
            <p className="text-muted-foreground text-xs mt-4 font-body">
              Registration will be completed only after payment is successfully received at the venue.
            </p>
          </motion.div>
        </form>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
