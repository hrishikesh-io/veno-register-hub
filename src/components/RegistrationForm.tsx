import { forwardRef } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="section-gradient py-16 md:py-24 px-4"
      id="register"
    >
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="card-elevated p-10 md:p-14 text-center relative overflow-hidden"
        >
          {/* Decorative sparkles */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mb-6"
          >
            <Sparkles className="h-5 w-5 text-secondary" />
            <PartyPopper className="h-5 w-5 text-primary" />
            <Sparkles className="h-5 w-5 text-secondary" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display text-2xl md:text-4xl font-bold gradient-text mb-6"
          >
            Program Successfully Completed 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground font-body text-base md:text-lg leading-relaxed"
          >
            Thank you to everyone who participated in the Tech Treasure Hunt.
            Your enthusiasm, creativity, and energy made the event a grand success.
            We truly appreciate your support and participation.
            Stay tuned for more exciting events in the future!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
