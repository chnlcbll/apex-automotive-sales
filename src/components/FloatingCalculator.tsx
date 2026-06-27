import React, { useState, useEffect } from 'react';
import { Calculator, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function FloatingCalculator() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const t = parseFloat(total);
    const p = parseFloat(percentage);
    if (!isNaN(t) && !isNaN(p)) setResult(t * (p / 100));
    else setResult(null);
  }, [total, percentage]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-auto' : 'w-80'}`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        <div 
          className="flex items-center justify-between p-4 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors border-b border-zinc-200"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center"><Calculator className="w-4 h-4" /></div>
            <span className="font-bold text-xs text-zinc-900 uppercase tracking-widest">
              {isMinimized ? 'Calc' : 'Percentage Calc'}
            </span>
          </div>
          {isMinimized ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </div>

        {!isMinimized && (
          <div className="p-5 space-y-4 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 text-sm font-bold">₱</span>
                <input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="0.00" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 pl-8 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 font-mono transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Percentage (%)</label>
              <div className="relative">
                <input type="number" value={percentage} onChange={e => setPercentage(e.target.value)} placeholder="30" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 pr-8 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 font-mono transition-colors" />
                <span className="absolute right-3 top-2.5 text-zinc-400 text-sm font-bold">%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <span className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">Result</span>
                <span className="text-lg font-black text-zinc-900 font-mono">
                  {result !== null ? formatCurrency(result) : '₱0.00'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
