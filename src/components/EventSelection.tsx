import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EVENT_CATEGORIES } from "@/lib/events";

interface EventSelectionProps {
  selectedEvents: string[];
  onToggle: (eventId: string) => void;
}

const EventSelection = ({ selectedEvents, onToggle }: EventSelectionProps) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Choose Your Events
        </h2>
        <p className="text-muted-foreground font-body">
          Select one or more events to participate in
        </p>
      </motion.div>

      <div className="space-y-8">
        {EVENT_CATEGORIES.map((category, catIdx) => {
          const Icon = category.icon;
          const selectedInCategory = category.events.filter((e) =>
            selectedEvents.includes(e.id)
          ).length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1, duration: 0.5 }}
            >
              {/* Department heading */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-lg">
                    {category.name}
                  </h3>
                  {selectedInCategory > 0 && (
                    <span className="text-xs text-primary font-medium">
                      {selectedInCategory} selected
                    </span>
                  )}
                </div>
              </div>

              {/* Event cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.events.map((event, evIdx) => {
                  const isSelected = selectedEvents.includes(event.id);
                  return (
                    <motion.label
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIdx * 0.1 + evIdx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4, boxShadow: "0 8px 30px -10px hsl(var(--primary) / 0.3)" }}
                      className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggle(event.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground text-sm">
                              {event.name}
                            </span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs mt-1">
                            {event.description}
                          </p>
                          <p className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider">
                            Day {event.day}
                          </p>
                        </div>
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventSelection;
