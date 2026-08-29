import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StopItem } from './StopItem';
import { cn } from '../lib/utils';

export function DayCard({ day, onRemoveStop }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Create a droppable container for this specific day
  const { setNodeRef } = useDroppable({
    id: `day-${day.dayNumber}`,
  });

  const stopIds = day.stops.map(stop => stop.id);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
            D{day.dayNumber}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 text-lg">{day.title}</h3>
            <div className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {day.stops.length} {day.stops.length === 1 ? 'stop' : 'stops'}
            </div>
          </div>
        </div>
        <div className={cn(
          "p-2 rounded-full hover:bg-slate-200 transition-transform duration-200 text-slate-500",
          isExpanded && "rotate-180"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div 
              ref={setNodeRef}
              className="p-4 sm:p-6 min-h-[100px]"
            >
              <SortableContext items={stopIds} strategy={verticalListSortingStrategy}>
                {day.stops.length > 0 ? (
                  day.stops.map(stop => (
                    <StopItem 
                      key={stop.id} 
                      stop={stop} 
                      onRemove={onRemoveStop} 
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium">
                    Drag stops here
                  </div>
                )}
              </SortableContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
