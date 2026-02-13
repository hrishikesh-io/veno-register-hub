// Event date boundaries (IST = UTC+5:30)
export const DAY1_START = new Date("2026-02-19T10:00:00+05:30").getTime();
export const DAY2_END = new Date("2026-02-20T10:00:00+05:30").getTime();

export type EventPhase = "all_open" | "day2_only" | "all_closed";

export const getEventPhase = (now: number = Date.now()): EventPhase => {
  if (now < DAY1_START) return "all_open";
  if (now < DAY2_END) return "day2_only";
  return "all_closed";
};

export const isEventDayAllowed = (day: 1 | 2, now: number = Date.now()): boolean => {
  const phase = getEventPhase(now);
  if (phase === "all_closed") return false;
  if (phase === "day2_only" && day === 1) return false;
  return true;
};
