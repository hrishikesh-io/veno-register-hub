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

        {/* WhatsApp Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Button
            size="lg"
            onClick={() => window.open("https://whatsapp.com/channel/0029VbBq03lDDmFNWX0c3l03", "_blank")}
            className="text-white text-lg px-10 py-6 rounded-full font-display font-semibold bg-[#25D366] hover:bg-[#1ebe5d] transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:shadow-[0_0_35px_rgba(37,211,102,1)] hover:scale-105"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Join WhatsApp Channel
          </Button>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          <div className="rounded-xl px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center text-white">
              <span className="font-display font-semibold text-base md:text-lg">
                ₹30 for Individual Program
              </span>
            </div>
          </div>
          <div className="rounded-xl px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center text-white">
              <span className="font-display font-semibold text-base md:text-lg">
                ₹50 for Group Program
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
