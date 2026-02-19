import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import newlogo from "@/assets/newlogo.png";
import newveno from "@/assets/newveno.png";

const TARGET_DATE = new Date("2026-02-19T10:00:00+05:30").getTime();

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
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

const FlipUnit = ({ value, label }: { value: number; label: string }) => {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-md">
        <AnimatePresence mode="wait">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-800"
          >
            {display}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100" />
      </div>
      <span className="text-xs mt-2 uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
};

const HeroSection = () => {
  const countdown = useCountdown();

  // Change manually:
  // "countdown" | "started" | "ended"
  const eventStatus = "started";

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white">

      <div className="container text-center px-4 py-20">

        <div className="absolute top-4 left-4">
          <img src={logo} alt="Ven-O-vation" className="h-10 md:h-14 opacity-70" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm md:text-base uppercase tracking-[0.3em] opacity-70">
            MVGM GPC Vennikulam presents
          </span>

          <div className="flex justify-center my-6">
            <img src={newlogo} alt="MVGM GPC Logo" className="h-20 md:h-28" />
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={newveno}
              alt="Ven-O-vation"
              className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 object-contain"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-2 opacity-90">
            State Level Tech Fest 2026
          </h2>

          <p className="text-xl md:text-2xl font-bold mb-6">
            19, 20 Feb
          </p>
        </motion.div>

        {/* Countdown or Status */}
        <div className="mb-10">

          {eventStatus === "countdown" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                <span className="text-sm uppercase tracking-widest opacity-70">
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
          )}

          {eventStatus === "started" && (
            <div className="flex justify-center">
              <div className="px-10 py-5 rounded-lg bg-white border border-gray-200 shadow-md">
                <span className="text-xl md:text-2xl font-semibold text-blue-600 uppercase tracking-wide">
                  Event Started
                </span>
              </div>
            </div>
          )}

          {eventStatus === "ended" && (
            <div className="flex justify-center">
              <div className="px-10 py-5 rounded-lg bg-white border border-gray-200 shadow-md">
                <span className="text-xl md:text-2xl font-semibold text-blue-600 uppercase tracking-wide">
                  Event Has Ended
                </span>
              </div>
            </div>
          )}

        </div>

        {/* WhatsApp Button */}
        <div className="mb-12">
          <Button
            size="lg"
            onClick={() =>
              window.open(
                "https://whatsapp.com/channel/0029VbBq03lDDmFNWX0c3l03",
                "_blank"
              )
            }
            className="text-white text-lg px-10 py-6 rounded-full font-semibold bg-[#25D366] hover:bg-[#1ebe5d] transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Join WhatsApp Channel
          </Button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
