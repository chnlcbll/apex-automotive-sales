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
    if (!isNaN(t) && !isNaN(p)) {
      setResult(t * (p / 100));
    } else {
      setResult(null);
    }
  }, [total, percentage]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-auto' : 'w-72'}`}>
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm text-white whitespace-nowrap">
              {isMinimized ? 'Calc' : 'Quick Percentage Calc'}
            </span>
          </div>
          {isMinimized ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4 space-y-4 bg-zinc-900/50">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Total Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-zinc-500 text-sm">₱</span>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 pl-7 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Percentage (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="30"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 pr-8 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                />
                <span className="absolute right-3 top-2 text-zinc-500 text-sm">%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Result</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">
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
