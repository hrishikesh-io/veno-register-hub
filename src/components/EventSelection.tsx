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
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/YOUR_CHANNEL_LINK";

const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              bounce: 0.25,
            }}
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

      {/* Logo watermark */}
      <div className="absolute top-4 left-4 z-20">
        <img src={logo} alt="Ven-O-vation" className="h-10 md:h-14 opacity-70" />
      </div>

      <div className="container relative z-10 text-center px-4 py-20">
        {/* Logos & Title */}
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

        <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
          State Level Tech Fest 2026
        </h2>

        {/* Countdown */}
        <div className="mb-12">
          {phase === "all_open" ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-secondary" />
                <span className="text-primary-foreground/70 text-sm uppercase tracking-widest">
                  Event starts in
                </span>
              </div>

              <div className="flex justify-center gap-4">
                <FlipUnit value={countdown.days} label="Days" />
                <FlipUnit value={countdown.hours} label="Hours" />
                <FlipUnit value={countdown.minutes} label="Minutes" />
                <FlipUnit value={countdown.seconds} label="Seconds" />
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 shadow-md rounded-lg px-8 py-5 inline-block">
              <span className="font-bold text-gray-800 uppercase">
                Event Started
              </span>
            </div>
          )}
        </div>

        {/* BUTTON SECTION */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Register Button */}
          <Button
            size="lg"
            onClick={onRegisterClick}
            className="btn-glow text-primary-foreground text-lg px-10 py-6 rounded-full font-display font-semibold animate-pulse-glow"
          >
            Register Now
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>

          {/* WhatsApp Button with GREEN Glow */}
          <Button
            size="lg"
            onClick={() => window.open(WHATSAPP_CHANNEL, "_blank")}
            className="
              text-white
              text-lg
              px-10
              py-6
              rounded-full
              font-display
              font-semibold
              bg-[#25D366]
              hover:bg-[#1ebe5d]
              transition-all
              duration-300
              shadow-[0_0_20px_rgba(37,211,102,0.6)]
              hover:shadow-[0_0_30px_rgba(37,211,102,0.9)]
              hover:scale-105
            "
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Join WhatsApp Channel
          </Button>

        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_CHANNEL}
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 left-6 z-50
          bg-[#25D366]
          hover:bg-[#1ebe5d]
          text-white
          rounded-full
          h-14 w-14
          flex items-center justify-center
          shadow-[0_0_20px_rgba(37,211,102,0.7)]
          hover:shadow-[0_0_35px_rgba(37,211,102,1)]
          transition
          hover:scale-110
        "
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </section>
  );
};

export default HeroSection;
