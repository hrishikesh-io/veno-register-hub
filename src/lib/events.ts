import { Monitor, Car, Zap, Building2, Wrench, Gamepad2 } from "lucide-react";

export interface TechEvent {
  id: string;
  name: string;
  description: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: typeof Monitor;
  events: TechEvent[];
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "computer",
    name: "Computer Engineering Events",
    icon: Monitor,
    events: [
      { id: "fast_fingers", name: "Fast Fingers", description: "Typing Speed" },
      { id: "page_masters", name: "Page Masters", description: "Poster Making" },
      { id: "idea_pitching", name: "Idea Pitching", description: "Innovation Presentation Round" },
      { id: "brain_quest", name: "Brain Quest", description: "Code Debugging" },
      { id: "tech_treasure_hunt", name: "Tech Treasure Hunt", description: "Clue-Based Search Game" },
    ],
  },
  {
    id: "automobile",
    name: "Automobile Engineering Events",
    icon: Car,
    events: [
      { id: "auto_quiz", name: "Auto Quiz", description: "Automobile Knowledge Quiz" },
      { id: "strip_rebuild", name: "Strip & Rebuild", description: "Gear Box Dismantling and Assembling" },
      { id: "pit_stop", name: "Pit Stop", description: "Remove and Refit Wheel" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics Engineering Events",
    icon: Zap,
    events: [
      { id: "circuit_debugging", name: "Circuit Debugging", description: "Find and fix circuit faults" },
      { id: "spark_off_soldering", name: "Spark Off Soldering", description: "Soldering & circuit assembly challenge" },
      { id: "technical_quiz", name: "Technical Quiz", description: "Electronics-based quiz competition" },
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering Events",
    icon: Building2,
    events: [
      { id: "civi_q", name: "Civi Q", description: "Civil Engineering Quiz" },
      { id: "cadd_master", name: "CADD Master", description: "Auto CAD Design Challenge" },
      { id: "benchmark_chase", name: "Benchmark Chase", description: "Treasure Hunt" },
      { id: "one_day_seminar", name: "One Day Seminar", description: "Technical Knowledge Session" },
    ],
  },
  {
    id: "general_workshop",
    name: "General Workshop",
    icon: Wrench,
    events: [
      { id: "lathe_craft", name: "Lathe Craft", description: "Lathe Machine Operation" },
      { id: "tool_master", name: "Tool Master", description: "Tool Memorizing Challenge" },
    ],
  },
  {
    id: "fun_games",
    name: "Fun Games",
    icon: Gamepad2,
    events: [
      { id: "spell_a_word", name: "Spell a Word", description: "Spelling Competition" },
      { id: "puzzle", name: "Puzzle", description: "Puzzle Solving" },
      { id: "periodic_table", name: "Periodic Table", description: "Periodic Table Challenge" },
    ],
  },
];

export const getAllEvents = () => EVENT_CATEGORIES.flatMap((c) => c.events);
export const getEventById = (id: string) => getAllEvents().find((e) => e.id === id);
export const getEventNameById = (id: string) => getEventById(id)?.name ?? id;
export const getCategoryForEvent = (eventId: string) =>
  EVENT_CATEGORIES.find((c) => c.events.some((e) => e.id === eventId));
