import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DayCard } from './DayCard';
import { StopItem } from './StopItem';
import { Button } from './ui/Button';
import { RefreshCcw, Map } from 'lucide-react';

export function ItineraryView({ initialData, onReset }) {
  const [data, setData] = useState(initialData);
  const [activeStop, setActiveStop] = useState(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const id = active.id;
    
    // Find the dragged stop
    let stop = null;
    for (const day of data.days) {
      const found = day.stops.find(s => s.id === id);
      if (found) {
        stop = found;
        break;
      }
    }
    setActiveStop(stop);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveDay = activeId.toString().startsWith('day-');
    const isOverDay = overId.toString().startsWith('day-');

    if (isActiveDay || isOverDay) return; // Only handle stop reordering here

    setData((prev) => {
      const activeDayIndex = prev.days.findIndex(d => d.stops.some(s => s.id === activeId));
      const overDayIndex = prev.days.findIndex(d => 
        d.stops.some(s => s.id === overId) || `day-${d.dayNumber}` === overId
      );

      if (activeDayIndex === -1 || overDayIndex === -1) return prev;

      const activeDay = prev.days[activeDayIndex];
      const overDay = prev.days[overDayIndex];
      const activeStopIndex = activeDay.stops.findIndex(s => s.id === activeId);
      let overStopIndex = overDay.stops.findIndex(s => s.id === overId);
      
      // If dropping on an empty day container
      if (overStopIndex === -1) {
        overStopIndex = overDay.stops.length;
      }

      const activeStop = activeDay.stops[activeStopIndex];

      const newDays = [...prev.days];
      
      // Remove from source
      const newSourceStops = [...newDays[activeDayIndex].stops];
      newSourceStops.splice(activeStopIndex, 1);
      newDays[activeDayIndex] = { ...activeDay, stops: newSourceStops };

      // Add to destination
      const newDestStops = activeDayIndex === overDayIndex 
        ? newSourceStops 
        : [...newDays[overDayIndex].stops];
        
      newDestStops.splice(overStopIndex, 0, activeStop);
      newDays[overDayIndex] = { ...newDays[overDayIndex], stops: newDestStops };

      return { ...prev, days: newDays };
    });
  };

  const handleDragEnd = (event) => {
    setActiveStop(null);
  };

  const handleRemoveStop = (stopId) => {
    setData(prev => {
      const newDays = prev.days.map(day => ({
        ...day,
        stops: day.stops.filter(s => s.id !== stopId)
      }));
      return { ...prev, days: newDays };
    });
  };

  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-8 h-8 text-indigo-500" />
            {data.title}
          </h2>
          <p className="text-slate-600 mt-2 text-lg max-w-2xl">{data.summary}</p>
        </div>
        <Button variant="secondary" onClick={onReset} className="shrink-0 gap-2 font-semibold">
          <RefreshCcw className="w-4 h-4" />
          Plan Another
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6 relative">
          {data.days.map((day) => (
            <DayCard 
              key={day.dayNumber} 
              day={day} 
              onRemoveStop={handleRemoveStop} 
            />
          ))}
        </div>

        <DragOverlay>
          {activeStop ? <StopItem stop={activeStop} onRemove={() => {}} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
