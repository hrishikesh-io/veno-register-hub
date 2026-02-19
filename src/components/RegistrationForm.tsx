import { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {

  return (
    <section
      ref={ref}
      className="section-gradient py-16 md:py-24 px-4"
      id="register"
    >
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-3">
            Registration Closed
          </h2>
          <p className="text-muted-foreground font-body">
            Online registration is no longer available.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-10 text-center"
        >
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />

          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Online Registration Closed
          </h3>

          <p className="text-muted-foreground font-body mb-4 text-lg">
            Spot Registration is available at the venue.
          </p>

          <p className="text-muted-foreground font-body">
            Please visit the event desk for registration and complete event details.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
