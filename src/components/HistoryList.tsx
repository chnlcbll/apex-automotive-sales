import React from 'react';
import { motion } from 'motion/react';
import { Order } from '@/types';
import { formatCurrency, playSound } from '@/lib/utils';
import { Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryListProps {
  orders: Order[];
  onReset: () => void;
  onSelectOrder: (order: Order) => void;
}

export function HistoryList({ orders, onReset, onSelectOrder }: HistoryListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight mb-2">Order History</h2>
          <p className="text-zinc-500 font-medium">Review past transactions and vehicle configurations.</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => { playSound('click'); onReset(); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[2rem] border border-zinc-200 border-dashed">
          <p className="text-zinc-400 font-bold tracking-widest uppercase text-sm">No recorded transactions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => { playSound('click'); onSelectOrder(order); }}
              className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="h-48 relative bg-zinc-100 overflow-hidden">
                <img 
                  src={order.imageUrl} 
                  alt={order.carName} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 relative">
                <div className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-zinc-400 group-hover:text-zinc-900 group-hover:bg-zinc-50 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{order.transactionNumber}</span>
                <h3 className="text-xl font-black text-zinc-900 mt-1 mb-4 truncate tracking-tight">{order.carName}</h3>
                
                <div className="flex justify-between items-end pt-4 border-t border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
