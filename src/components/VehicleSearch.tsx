import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Car, Loader2, Check, Sparkles, X } from 'lucide-react';
import { searchVehicles, getExpertAdvice } from '@/lib/gemini';
import { Vehicle } from '@/types';
import { formatCurrency, playSound } from '@/lib/utils';
import Markdown from 'react-markdown';

interface VehicleSearchProps {
  onSelect: (vehicle: Vehicle) => void;
}

export function VehicleSearch({ onSelect }: VehicleSearchProps) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [seats, setSeats] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const years = Array.from({ length: 2025 - 2013 + 1 }, (_, i) => (2025 - i).toString());
  const commonColors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Yellow', 'Green'];
  const seatOptions = ['2', '4', '5', '7', '8'];
  const vehicleTypes = ['SUV', 'Sedan', 'Sports', 'Hatchback', 'Pickup', 'Van', 'Coupe'];
  const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'DCT'];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Query is now optional, but we should have at least one filter
    if (!query.trim() && !year && !color && !seats && !vehicleType && !transmission) return;
    
    setLoading(true);
    setAdvice(null);
    playSound('click');
    const vehicles = await searchVehicles(query, year, color, seats, vehicleType, transmission);
    setResults(vehicles);
    setLoading(false);
  };

  const handleGetAdvice = async () => {
    if (results.length === 0) return;
    setLoadingAdvice(true);
    playSound('click');
    const expertAdvice = await getExpertAdvice(results);
    setAdvice(expertAdvice);
    setLoadingAdvice(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Vehicle Discovery</h2>
        <p className="text-zinc-400">Search our global database for price references and specifications.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="md:col-span-1 lg:col-span-1 space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Model Name</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Toyota Supra (Optional)"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Model Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Any Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Any Type</option>
              {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Seaters</label>
            <select
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Any</option>
              {seatOptions.map(s => <option key={s} value={s}>{s} Seater</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Any</option>
              {transmissionTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Preferred Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Any Color</option>
              {commonColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching Database...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Find Vehicles
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <button
              onClick={handleGetAdvice}
              disabled={loadingAdvice}
              className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-full font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loadingAdvice ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Expert Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Expert Comparison Advice
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {advice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <button 
              onClick={() => setAdvice(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Expert Insight</h3>
            </div>
            <div className="prose prose-invert max-w-none text-zinc-300">
              <Markdown>{advice}</Markdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {results.map((vehicle, idx) => (
            <motion.div
              key={vehicle.name + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-900/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl h-fit">
                    <Car className="w-6 h-6 text-cyan-400" />
                  </div>
                  {vehicle.imageUrl && (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/5">
                      <img 
                        src={vehicle.imageUrl} 
                        alt={vehicle.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white font-mono">{formatCurrency(vehicle.price)}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Reference Price</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{vehicle.name}</h3>
                <p className="text-zinc-400 text-sm">
                  {vehicle.year} • {vehicle.type} • {vehicle.seats} Seater • {vehicle.transmission} • {vehicle.colors.join(', ')}
                </p>
                {vehicle.description && (
                  <p className="mt-3 text-sm text-zinc-500 italic">"{vehicle.description}"</p>
                )}
              </div>

              <button
                onClick={() => { playSound('success'); onSelect(vehicle); }}
                className="w-full py-3 bg-white/5 hover:bg-cyan-500 text-zinc-300 hover:text-white border border-white/10 hover:border-cyan-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Select & Configure
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && !loading && query && (
        <div className="text-center py-12 text-zinc-500">
          No matches found for your criteria. Try a broader search.
        </div>
      )}
    </div>
  );
}
