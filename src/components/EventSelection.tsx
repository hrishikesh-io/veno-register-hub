import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EVENT_CATEGORIES } from "@/lib/events";

interface EventSelectionProps {
  selectedEvents: string[];
  onToggle: (eventId: string) => void;
}

const EventSelection = ({ selectedEvents, onToggle }: EventSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Choose Your Events
        </h2>
        <p className="text-muted-foreground font-body">
          Select one or more events to participate in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENT_CATEGORIES.map((category, catIdx) => {
          const Icon = category.icon;
          const selectedInCategory = category.events.filter((e) =>
            selectedEvents.includes(e.id)
          ).length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1, duration: 0.5 }}
              className="category-card"
            >
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

              <div className="space-y-3">
                {category.events.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => onToggle(event.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-foreground text-sm">
                        {event.name}
                      </span>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {event.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventSelection;
