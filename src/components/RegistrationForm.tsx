import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, BookOpen, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import EventSelection from "./EventSelection";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  gender: z.enum(["Male", "Female"], { required_error: "Please select your gender" }),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  college: z.string().trim().min(2, "College name is required").max(200),
  department: z.string().trim().min(2, "Department/Class is required").max(200),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventError, setEventError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
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

      // Insert registration
      const { data: registration, error } = await supabase
        .from("registrations")
        .insert({
          name: data.name,
          gender: data.gender,
          email: data.email.toLowerCase(),
          phone: data.phone,
          college: data.college,
          department: data.department,
          selected_events: selectedEvents,
          payment_status: "paid",
          payment_id: "DEMO-" + Date.now(),
          amount: 30,
          reg_id: "",
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes("duplicate")) {
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

      navigate(`/registration-success?id=${registration.reg_id}&events=${selectedEvents.join(",")}`);
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
          {/* Personal Details Card */}
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
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Name *
                </Label>
                <Input id="name" placeholder="Your full name" {...register("name")} />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-foreground">Gender *</Label>
                <RadioGroup
                  onValueChange={(v) => {
                    const event = { target: { name: "gender", value: v } };
                    register("gender").onChange(event as any);
                  }}
                  className="flex gap-6 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer text-foreground">Male</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer text-foreground">Female</Label>
                  </div>
                </RadioGroup>
                {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-primary" /> Email *
                </Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-primary" /> Phone *
                </Label>
                <Input id="phone" placeholder="10-digit number" {...register("phone")} />
                {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
              </div>

              {/* College */}
              <div className="space-y-2">
                <Label htmlFor="college" className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" /> College/Institution *
                </Label>
                <Input id="college" placeholder="Your college name" {...register("college")} />
                {errors.college && <p className="text-destructive text-xs">{errors.college.message}</p>}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> Department/Class *
                </Label>
                <Input id="department" placeholder="Your department" {...register("department")} />
                {errors.department && <p className="text-destructive text-xs">{errors.department.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Event Selection */}
          <EventSelection selectedEvents={selectedEvents} onToggle={toggleEvent} />
          {eventError && (
            <p className="text-destructive text-sm text-center font-medium">{eventError}</p>
          )}

          {/* Payment Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-4"
          >
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="btn-glow text-primary-foreground text-lg px-12 py-7 rounded-full font-display font-semibold w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IndianRupee className="mr-2 h-5 w-5" />
                  Pay ₹30 & Complete Registration
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-xs mt-3">
              Secure UPI payment · No card details stored
            </p>
          </motion.div>
        </form>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
