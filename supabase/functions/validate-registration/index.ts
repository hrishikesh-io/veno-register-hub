import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Event dates (IST)
const DAY1_START = new Date("2026-02-19T10:00:00+05:30").getTime();
const DAY2_END = new Date("2026-02-20T10:00:00+05:30").getTime();

// All valid event IDs mapped to their day
const EVENT_DAY_MAP: Record<string, number> = {
  fast_fingers: 1, page_masters: 1, tech_treasure_hunt: 2, idea_pitching: 2, brain_quest: 2,
  auto_quiz: 1, strip_rebuild: 2, pit_stop: 2,
  circuit_debugging: 1, spark_off_soldering: 2, technical_quiz: 2,
  one_day_seminar: 1, cadd_master: 1, civi_q: 2, benchmark_chase: 2,
  lathe_craft: 1, tool_master: 1,
  spell_a_word: 1, puzzle: 1, periodic_table: 2,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selected_events } = await req.json();
    const now = Date.now();

    // After Day 2 ends - reject all
    if (now >= DAY2_END) {
      return new Response(
        JSON.stringify({ valid: false, error: "All registrations are closed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each event
    if (!Array.isArray(selected_events) || selected_events.length === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "No events selected." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const eventId of selected_events) {
      const day = EVENT_DAY_MAP[eventId];
      if (!day) {
        return new Response(
          JSON.stringify({ valid: false, error: `Invalid event: ${eventId}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // After Day 1 starts, Day 1 events are closed
      if (day === 1 && now >= DAY1_START) {
        return new Response(
          JSON.stringify({ valid: false, error: `Day 1 registration is closed. Cannot register for "${eventId}".` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: "Invalid request." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
