import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="section-gradient py-16 md:py-24 px-4"
      id="thankyou"
    >
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="card-elevated p-10 md:p-14 text-center relative overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center gap-3 mb-6"
          >
            <Sparkles className="h-6 w-6 text-secondary" />
            <Trophy className="h-6 w-6 text-primary" />
            <Sparkles className="h-6 w-6 text-secondary" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-display text-2xl md:text-3xl font-bold gradient-text mb-6"
          >
            Thank You for Being Part of the Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-muted-foreground font-body text-base md:text-lg leading-relaxed"
          >
            We extend our heartfelt gratitude to all participants, coordinators,
            volunteers, and supporters who made Ven-O-vation 2026 a grand success.
            Your enthusiasm, innovation, and teamwork truly brought the event to life.
            We look forward to welcoming you to even bigger and better experiences
            in the future.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
