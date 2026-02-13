import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FlipCardProps {
  value: number;
  label: string;
}

export function FlipCard({ value, label }: FlipCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [value, displayValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-28 perspective-1000">
        
        {/* Top Half */}
        <div className="absolute top-0 w-full h-1/2 bg-white border border-gray-300 rounded-t-lg flex items-end justify-center overflow-hidden shadow-inner">
          <span className="text-4xl font-bold text-black">
            {displayValue}
          </span>
        </div>

        {/* Bottom Half */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gray-100 border border-gray-300 rounded-b-lg flex items-start justify-center overflow-hidden">
          <span className="text-4xl font-bold text-black">
            {displayValue}
          </span>
        </div>

        {/* Flip Animation */}
        <AnimatePresence>
          {isFlipping && (
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -90 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="absolute top-0 w-full h-1/2 bg-white border border-gray-300 rounded-t-lg flex items-end justify-center origin-bottom"
              style={{ transformOrigin: "bottom" }}
            >
              <span className="text-4xl font-bold text-black">
                {displayValue}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="mt-3 text-xs font-semibold tracking-widest text-gray-600">
        {label}
      </span>
    </div>
  );
}
