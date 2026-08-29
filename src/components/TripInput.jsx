import { useState } from 'react';
import { Map, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export function TripInput({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-6">
          <Map className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Where to next?
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Describe your dream trip. We'll use AI to generate a detailed, customizable day-by-day itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500",
          isLoading && "animate-pulse opacity-60"
        )}></div>
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A 3-day weekend in Kyoto focused on food and hidden temples. I have a medium budget and love walking."
            className="w-full min-h-[120px] p-6 text-lg text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
          <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-t border-slate-100">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Powered by AI
            </div>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={!prompt.trim()}
              className="rounded-xl px-6"
            >
              Generate Itinerary
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
