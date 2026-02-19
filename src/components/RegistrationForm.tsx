import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

const RegistrationForm = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700"
      id="register"
    >
      <div className="container max-w-4xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/30 mb-4">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-purple-200 text-sm uppercase tracking-wider">
              Registration Update
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Registration Closed
          </h2>

          <p className="text-purple-200">
            Online registration is no longer available.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 text-center"
        >
          
          {/* Animated Icon Circle */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg"
            >
              <Info className="h-10 w-10 text-white" />
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            Online Registration Closed
          </h3>

          <p className="text-purple-100 text-lg mb-4">
            Spot Registration is available at the venue.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mt-6">
            <p className="text-purple-200">
              Please visit the event desk for registration and complete event details.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
});

RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
