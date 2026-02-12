import { Monitor, Car, Zap, Building2, Wrench, Gamepad2 } from "lucide-react";

export interface TechEvent {
  id: string;
  name: string;
  description: string;
  day: 1 | 2;
  type: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: typeof Monitor;
  events: TechEvent[];
}

export const DEPARTMENTS = [
  { id: "computer", label: "Computer Engineering" },
  { id: "automobile", label: "Automobile Engineering" },
  { id: "electronics", label: "Electronics Engineering" },
  { id: "civil", label: "Civil Engineering" },
  { id: "general_workshop", label: "General Workshop" },
  { id: "fun_games", label: "Fun Games" },
] as const;

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "computer",
    name: "Computer Engineering",
    icon: Monitor,
    events: [
      { id: "fast_fingers", name: "Fast Fingers", description: "Typing Speed", day: 1, type: "Individual" },
      { id: "page_masters", name: "Page Masters", description: "Poster Making", day: 1, type: "Individual" },
      { id: "tech_treasure_hunt", name: "Tech Treasure Hunt", description: "Clue-Based Search Game", day: 2, type: "Group of 4" },
      { id: "idea_pitching", name: "Idea Pitching", description: "Innovation Presentation Round", day: 2, type: "Individual" },
      { id: "brain_quest", name: "Brain Quest", description: "Code Debugging", day: 2, type: "Individual" },
    ],
  },
  {
    id: "automobile",
    name: "Automobile Engineering",
    icon: Car,
    events: [
      { id: "auto_quiz", name: "Auto Quiz", description: "Automobile Knowledge Quiz", day: 1, type: "Group of 2" },
      { id: "strip_rebuild", name: "Strip & Rebuild", description: "Gear Box Dismantling and Assembling", day: 2, type: "Group of 2" },
      { id: "pit_stop", name: "Pit Stop", description: "Remove and Refit Wheel", day: 2, type: "Group of 4" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
    icon: Zap,
    events: [
      { id: "circuit_debugging", name: "Circuit Debugging", description: "Find and fix circuit faults", day: 1, type: "Group of 4" },
      { id: "spark_off_soldering", name: "Spark Off Soldering", description: "Soldering & circuit assembly challenge", day: 2, type: "Individual" },
      { id: "technical_quiz", name: "Technical Quiz", description: "Electronics-based quiz competition", day: 2, type: "Group of 2" },
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    icon: Building2,
    events: [
      { id: "one_day_seminar", name: "One Day Seminar", description: "Technical Knowledge Session", day: 1, type: "Individual" },
      { id: "cadd_master", name: "CADD Master", description: "Auto CAD Design Challenge", day: 1, type: "Individual" },
      { id: "civi_q", name: "Civi Q", description: "Civil Engineering Quiz", day: 2, type: "Group of 2" },
      { id: "benchmark_chase", name: "Benchmark Chase", description: "Treasure Hunt", day: 2, type: "Group of 3" },
    ],
  },
  {
    id: "general_workshop",
    name: "General Workshop",
    icon: Wrench,
    events: [
      { id: "lathe_craft", name: "Lathe Craft", description: "Lathe Machine Operation", day: 1, type: "Individual" },
      { id: "tool_master", name: "Tool Master", description: "Tool Memorizing Challenge", day: 1, type: "Individual" },
    ],
  },
  {
    id: "fun_games",
    name: "Fun Games",
    icon: Gamepad2,
    events: [
      { id: "spell_a_word", name: "Spell a Word", description: "Spelling Challenge", day: 1, type: "Individual" },
      { id: "puzzle", name: "Puzzle", description: "Puzzle Solving Challenge", day: 1, type: "Individual" },
      { id: "periodic_table", name: "Periodic Table", description: "Periodic Table Challenge", day: 2, type: "Individual" },
    ],
  },
];

export const getAllEvents = () => EVENT_CATEGORIES.flatMap((c) => c.events);
export const getEventById = (id: string) => getAllEvents().find((e) => e.id === id);
export const getEventNameById = (id: string) => getEventById(id)?.name ?? id;
export const getCategoryForEvent = (eventId: string) =>
  EVENT_CATEGORIES.find((c) => c.events.some((e) => e.id === eventId));
export const getCategoryById = (id: string) => EVENT_CATEGORIES.find((c) => c.id === id);
export const getDepartmentLabel = (id: string) => DEPARTMENTS.find((d) => d.id === id)?.label ?? id;
