import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, MessageCircle } from "lucide-react";
import { getEventPhase } from "@/lib/eventDates";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import newlogo from "@/assets/newlogo.png";
import newveno from "@/assets/newveno.png";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

const TARGET_DATE = new Date("2026-02-19T10:00:00+05:30").getTime();

const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET_DATE - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
};

const FlipUnit = ({ value, label }: { value: number; label: string }) => {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-22 md:h-26 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-md">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -30, opacity: 0, rotateZ: -3 }}
            animate={{ y: 0, opacity: 1, rotateZ: 0 }}
            exit={{ y: 25, opacity: 0, rotateZ: 3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], type: "spring", bounce: 0.25 }}
            className="absolute inset-0 flex items-center justify-center font-display text-3xl md:text-4xl font-bold text-gray-800"
          >
            {display}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100" />
      </div>
      <span className="text-primary-foreground/70 text-[10px] md:text-xs font-body mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  const countdown = useCountdown();
  const [phase, setPhase] = useState(getEventPhase());

  useEffect(() => {
    const id = setInterval(() => setPhase(getEventPhase()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative">
      <div className="circuit-lines" />

      {/* Header logo watermark */}
      <div className="absolute top-4 left-4 z-20">
        <img src={logo} alt="Ven-O-vation" className="h-10 md:h-14 opacity-70" />
      </div>

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary-foreground/70 font-body text-sm md:text-base uppercase tracking-[0.3em]">
              MVGM GPC Vennikulam presents
            </span>
          </div>

          {/* New college logo */}
          <div className="flex justify-center mb-6">
            <img src={newlogo} alt="MVGM GPC Logo" className="h-20 md:h-28" />
          </div>

          {/* Centered Ven-O-vation logo image */}
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

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          {phase === "all_open" ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-secondary" />
                <span className="text-primary-foreground/70 font-body text-sm uppercase tracking-widest">
                  Event starts in
                </span>
              </div>
              <div className="flex justify-center gap-3 md:gap-5">
                <FlipUnit value={countdown.days} label="Days" />
                <FlipUnit value={countdown.hours} label="Hours" />
                <FlipUnit value={countdown.minutes} label="Minutes" />
                <FlipUnit value={countdown.seconds} label="Seconds" />
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="bg-white border border-gray-200 shadow-md rounded-lg px-8 py-5">
                <span className="font-display text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wider">
                  {phase === "day2_only" ? "Event Started" : "Event Has Ended"}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
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


        {/* Floating Stats */}
        <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.8 }}
  className="flex flex-wrap justify-center gap-4 md:gap-6"
>
  {/* Individual Program Card */}
  <div
    className="
      rounded-xl
      px-6 py-4
      bg-white/10
      backdrop-blur-md
      border border-white/20
      shadow-lg
      hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300 ease-in-out
    "
  >
    <div className="flex items-center justify-center text-white">
      <span className="font-display font-semibold text-base md:text-lg">
        ₹30 for Individual Program
      </span>
    </div>
  </div>

  {/* Group Program Card */}
  <div
    className="
      rounded-xl
      px-6 py-4
      bg-white/10
      backdrop-blur-md
      border border-white/20
      shadow-lg
      hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300 ease-in-out
    "
  >
    <div className="flex items-center justify-center text-white">
      <span className="font-display font-semibold text-base md:text-lg">
        ₹50 for Group Program
      </span>
    </div>
  </div>
</motion.div>



      </div>

      {/* Floating Register Button (mobile) */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={onRegisterClick}
          className="btn-glow text-primary-foreground rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
