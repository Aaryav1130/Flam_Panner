import { useState } from 'react';
import { Toaster } from 'sonner';
import { TripInput } from './components/TripInput';
import { ItineraryView } from './components/ItineraryView';
import { useAIQuery } from './hooks/useAIQuery';

function App() {
  const { generate, data, setData, isLoading } = useAIQuery();

  const handleReset = () => {
    setData(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Toaster position="top-center" richColors />
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Flam<span className="text-indigo-600">Planner</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-slate-50/50">
        {!data ? (
          <div className="pt-10 pb-20">
            <TripInput onGenerate={generate} isLoading={isLoading} />
          </div>
        ) : (
          <ItineraryView initialData={data} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
