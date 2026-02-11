import { motion } from "framer-motion";
import { ChevronDown, IndianRupee, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative">
      <div className="circuit-lines" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-primary-foreground/70 font-body text-sm md:text-base uppercase tracking-[0.3em] mb-4">
            MVGM GPC Vennikulam presents
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
            Ven-O-vation
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl opacity-80">
              Tech Fest 2026
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto text-primary-foreground/75 text-base md:text-lg leading-relaxed mb-10 font-body"
        >
          Ven-O-vation Tech Fest is a multidisciplinary technical festival by MVGM GPC
          Vennikulam under the Department of Technical Education, in association with
          SITTR, bringing together Computer, Civil, Automobile, and Electronics
          Engineering to promote innovation and collaboration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <Button
            size="lg"
            onClick={onRegisterClick}
            className="btn-glow text-primary-foreground text-lg px-10 py-6 rounded-full font-display font-semibold animate-pulse-glow"
          >
            Register Now
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          <div className="stats-card animate-float" style={{ animationDelay: "0s" }}>
            <div className="flex items-center gap-2 text-primary-foreground">
              <IndianRupee className="h-5 w-5 text-secondary" />
              <span className="font-display font-semibold">₹30 Registration</span>
            </div>
          </div>
         <div className="stats-card animate-float" style={{ animationDelay: "0s" }}>
            <div className="flex items-center gap-2 text-primary-foreground">
              <IndianRupee className="h-5 w-5 text-secondary" />
              <span className="font-display font-semibold">₹30 Registration</span>
            </div>
          </div>
          <div className="stats-card animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2 text-primary-foreground">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span className="font-display font-semibold">Instant Confirmation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
