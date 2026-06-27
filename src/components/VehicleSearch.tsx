import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Vehicle } from '@/types';
import { searchVehicles } from '@/lib/gemini';
import { formatCurrency, playSound } from '@/lib/utils';
import { Search, Loader2, Sparkles, ChevronRight, Car } from 'lucide-react';
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

  const years = Array.from({ length: 2025 - 2013 + 1 }, (_, i) => (2025 - i).toString());
  const commonColors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Yellow', 'Green'];
  const seatOptions = ['2', '4', '5', '7', '8'];
  const vehicleTypes = ['SUV', 'Sedan', 'Sports', 'Hatchback', 'Pickup', 'Van', 'Coupe'];
  const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'DCT'];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !year && !color && !seats && !vehicleType && !transmission) return;
    setLoading(true); playSound('click');
    const vehicles = await searchVehicles(query, year, color, seats, vehicleType, transmission);
    setResults(vehicles); setLoading(false);
  };

  const inputClass = "w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium appearance-none";

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="mb-12 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-light text-zinc-900 mb-4 tracking-tight">Discover Vehicles</h2>
        <p className="text-zinc-500 font-medium text-lg">Search our global AI-powered database to find exact specifications and reference pricing.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by Make or Model..." className={`${inputClass} pl-11`} />
            <Search className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
          </div>
          <select value={year} onChange={e => setYear(e.target.value)} className={inputClass}>
            <option value="">Any Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className={inputClass}>
            <option value="">Any Type</option>{vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={seats} onChange={e => setSeats(e.target.value)} className={inputClass}>
            <option value="">Seats</option>{seatOptions.map(s => <option key={s} value={s}>{s} Seater</option>)}
          </select>
          <select value={transmission} onChange={e => setTransmission(e.target.value)} className={inputClass}>
            <option value="">Trans.</option>{transmissionTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <button type="submit" disabled={loading} className="lg:col-span-1 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center p-3 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-200 pb-2">Search Results ({results.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((vehicle, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-zinc-200 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all flex flex-col"
              >
                <div className="h-56 overflow-hidden relative bg-zinc-100">
                  {vehicle.imageUrl ? (
                    <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><Car className="w-12 h-12" /></div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-900 font-mono shadow-sm">
                    {formatCurrency(vehicle.price)}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">{vehicle.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[vehicle.year, vehicle.type, `${vehicle.seats} Seats`, vehicle.transmission].filter(Boolean).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                    {vehicle.description && <p className="text-sm text-zinc-500 mb-6 font-medium leading-relaxed">"{vehicle.description}"</p>}
                  </div>
                  
                  <button onClick={() => { playSound('success'); onSelect(vehicle); }} className="w-full mt-auto py-3.5 bg-zinc-50 hover:bg-zinc-900 text-zinc-900 hover:text-white border border-zinc-200 hover:border-zinc-900 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    Configure This Model <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
