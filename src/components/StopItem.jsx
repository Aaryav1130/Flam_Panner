import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MapPin, Utensils, Train, Bed, X } from "lucide-react";
import { cn } from "../lib/utils";

const ICONS = {
  attraction: MapPin,
  food: Utensils,
  transport: Train,
  hotel: Bed,
};

const COLORS = {
  attraction: "bg-blue-100 text-blue-700",
  food: "bg-orange-100 text-orange-700",
  transport: "bg-slate-100 text-slate-700",
  hotel: "bg-purple-100 text-purple-700",
};

export function StopItem({ stop, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = ICONS[stop.type] || MapPin;
  const colorClass = COLORS[stop.type] || COLORS.attraction;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-4 p-4 mb-3 bg-white border border-slate-200 rounded-xl transition-all",
        isDragging && "opacity-50 shadow-lg scale-[1.02] z-10 border-indigo-300",
        !isDragging && "hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 -ml-2 rounded-md hover:bg-slate-100 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className={cn("p-2.5 rounded-lg shrink-0 mt-0.5", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-slate-900 truncate">{stop.name}</h4>
          {stop.duration && (
            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full shrink-0">
              {stop.duration}
            </span>
          )}
        </div>
        
        {stop.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            {stop.description}
          </p>
        )}
        
        {stop.tips && (
          <div className="text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100">
            <span className="font-semibold mr-1">Tip:</span> 
            {stop.tips}
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(stop.id)}
        className="absolute top-4 right-4 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
        aria-label="Remove stop"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
