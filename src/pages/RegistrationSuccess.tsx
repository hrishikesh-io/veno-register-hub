import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, PartyPopper, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventNameById } from "@/lib/events";

const RegistrationSuccess = () => {
  const [searchParams] = useSearchParams();
  const regId = searchParams.get("id") || "VEN2026-XXX";
  const eventsParam = searchParams.get("events");
  const events = eventsParam ? eventsParam.split(",") : [];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card-elevated p-8 md:p-12 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
        >
          <CheckCircle className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <PartyPopper className="h-6 w-6 text-secondary" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Registration Successful!
          </h1>
        </div>

        <div className="my-8 p-6 rounded-xl bg-muted/50 border border-border">
          <p className="text-muted-foreground text-sm mb-2 font-body">Your Registration ID</p>
          <p className="font-display text-3xl md:text-4xl font-bold gradient-text">{regId}</p>
        </div>

        {events.length > 0 && (
          <div className="text-left mb-8">
            <p className="font-display font-semibold text-foreground mb-3">Selected Events:</p>
            <ul className="space-y-2">
              {events.map((eventId) => (
                <li
                  key={eventId}
                  className="flex items-center gap-2 text-sm text-muted-foreground font-body"
                >
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {getEventNameById(eventId)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccess;
