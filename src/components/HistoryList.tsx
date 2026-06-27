import React from 'react';
import { motion } from 'motion/react';
import { Order } from '@/types';
import { formatCurrency, playSound } from '@/lib/utils';
import { Trash2, Clock, Calendar } from 'lucide-react';

interface HistoryListProps {
  orders: Order[];
  onReset: () => void;
  onSelectOrder: (order: Order) => void;
}

export function HistoryList({ orders, onReset, onSelectOrder }: HistoryListProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Transaction History</h2>
        {orders.length > 0 && (
          <button
            onClick={() => { playSound('click'); onReset(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Reset History
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <p className="text-zinc-500 text-xl">No transactions yet.</p>
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
              className="group cursor-pointer"
            >
              <div className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-900/10 hover:-translate-y-1">
                {/* Image Section */}
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                  <img 
                    src={order.imageUrl} 
                    alt={order.carName} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 z-20 px-2 py-1 rounded bg-black/50 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                    {order.transactionNumber}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {order.carName}
                      </h3>
                      <p className="text-zinc-500 text-sm">{order.yearModel} • {order.color}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Base Price</span>
                      <span className="text-zinc-300 font-mono">{formatCurrency(order.carPrice)}</span>
                    </div>
                    {order.discountPercent > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Discount ({order.discountPercent}%)</span>
                        <span className="text-red-400 font-mono">
                          -{formatCurrency(order.carPrice * (order.discountPercent / 100))}
                        </span>
                      </div>
                    )}
                    {order.addOns.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Add-ons ({order.addOns.length})</span>
                        <span className="text-emerald-400 font-mono">
                          +{formatCurrency(order.addOns.reduce((acc, curr) => {
                            const discount = curr.discountPercent || 0;
                            return acc + (curr.price * (1 - discount / 100));
                          }, 0))}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-zinc-400 font-semibold">Total</span>
                      <span className="text-xl font-bold text-white font-mono">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    {order.pickupDate && (
                      <div className="flex items-center gap-1 text-orange-500/70">
                        <Calendar className="w-3 h-3" />
                        Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
