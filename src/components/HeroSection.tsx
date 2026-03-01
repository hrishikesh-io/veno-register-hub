import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import newlogo from "@/assets/newlogo.png";
import newveno from "@/assets/newveno.png";

const HeroSection = () => {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative">
      <div className="circuit-lines" />

      <div className="absolute top-4 left-4 z-20">
        <img src={logo} alt="Ven-O-vation" className="h-10 md:h-14 opacity-70" />
      </div>

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary-foreground/70 font-body text-sm md:text-base uppercase tracking-[0.3em]">
              MVGM GPC Vennikulam presents
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <img src={newlogo} alt="MVGM GPC Logo" className="h-20 md:h-28" />
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={newveno}
              alt="Ven-O-vation"
              className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 object-contain"
            />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2 opacity-80">
            State Level Tech Fest 2026
          </h2>
          <p className="text-secondary font-display text-xl md:text-2xl font-bold mb-6">
            19, 20 Feb
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto text-primary-foreground/75 text-base md:text-lg leading-relaxed mb-10 font-body"
        >
          Ven-O-vation State Tech Fest is a multidisciplinary technical festival by MVGM GPC
          Vennikulam under the Department of Technical Education, in association with
          SITTTR, bringing together Computer, Civil, Automobile, and Electronics
          Engineering to promote innovation and collaboration.
        </motion.p>

        {/* Event Concluded Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl px-10 py-8 max-w-xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Event Successfully Concluded 🎉
            </h3>
            <p className="text-primary-foreground/70 font-body text-base md:text-lg">
              Ven-O-vation 2026 has officially come to an end.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
