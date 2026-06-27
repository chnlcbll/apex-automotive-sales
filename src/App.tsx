import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Vehicle } from '@/types';
import { OrderForm } from '@/components/OrderForm';
import { HistoryList } from '@/components/HistoryList';
import { VehicleSearch } from '@/components/VehicleSearch';
import { formatCurrency, playSound } from '@/lib/utils';
import { Car, History, ShoppingBag, X, Search } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'buy' | 'history' | 'search'>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [draftVehicle, setDraftVehicle] = useState<Partial<Order> | null>(null);

  const handleFinishOrder = (order: Order) => {
    setOrders([order, ...orders]);
    setDraftVehicle(null);
    setView('history');
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setDraftVehicle({
      carName: vehicle.name,
      carPrice: vehicle.price,
      yearModel: vehicle.year,
      color: vehicle.colors[0] || '',
      imageUrl: vehicle.imageUrl,
    });
    setView('buy');
  };

  const handleResetHistory = () => {
    setOrders([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-black/50 border-b border-white/5">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => { playSound('click'); setView('home'); }}
        >
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">APEX<span className="text-cyan-500">AUTO</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { playSound('hover'); setView('search'); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              view === 'search' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => { playSound('hover'); setView('buy'); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'buy' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Buy Now
          </button>
          <button
            onClick={() => { playSound('hover'); setView('history'); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'history' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            History
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-12 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-6"
            >
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
              >
                DRIVE THE<br />EXTRAORDINARY
              </motion.h1>
              <p className="text-xl text-zinc-400 max-w-2xl mb-12">
                Experience the future of automotive retail. Configure your dream machine with our state-of-the-art inventory system.
              </p>
              
              <div className="flex gap-6">
                <button
                  onClick={() => { playSound('click'); setView('buy'); }}
                  className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Configuration <ShoppingBag className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </button>
              </div>

              {/* Decorative Car Image (Placeholder) */}
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="mt-16 w-full max-w-5xl relative"
              >
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                 <img 
                   src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop" 
                   alt="Luxury Car" 
                   className="w-full rounded-2xl shadow-2xl opacity-80 mask-image-gradient"
                 />
              </motion.div>
            </motion.div>
          )}

          {view === 'buy' && (
            <motion.div
              key="buy"
              className="w-full"
            >
              <OrderForm 
                key={draftVehicle?.carName || 'new'}
                initialData={draftVehicle}
                onFinish={handleFinishOrder} 
                onCancel={() => { setView('home'); setDraftVehicle(null); }} 
              />
            </motion.div>
          )}

          {view === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <VehicleSearch onSelect={handleSelectVehicle} />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <HistoryList 
                orders={orders} 
                onReset={handleResetHistory} 
                onSelectOrder={setSelectedOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="relative h-48 -mx-8 -mt-8 mb-8 overflow-hidden rounded-t-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                <img 
                  src={selectedOrder.imageUrl} 
                  alt={selectedOrder.carName} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-6">
                <span className="text-cyan-500 font-mono text-sm tracking-wider uppercase">Transaction Details</span>
                <h2 className="text-3xl font-bold text-white mt-1">{selectedOrder.carName}</h2>
                <p className="text-zinc-500">#{selectedOrder.transactionNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-zinc-500 uppercase font-bold">Specs</p>
                  <p className="text-white mt-1">{selectedOrder.yearModel} • {selectedOrder.color}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase font-bold">Date</p>
                  <p className="text-white mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                {selectedOrder.pickupDate && (
                  <div className="col-span-2">
                    <p className="text-sm text-zinc-500 uppercase font-bold">Pickup/Delivery</p>
                    <p className="text-orange-400 mt-1">{new Date(selectedOrder.pickupDate).toLocaleString()}</p>
                  </div>
                )}
                {selectedOrder.note && (
                  <div className="col-span-2 bg-white/5 p-4 rounded-xl">
                    <p className="text-sm text-zinc-500 uppercase font-bold mb-1">Notes</p>
                    <p className="text-zinc-300 italic">"{selectedOrder.note}"</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6">
                {selectedOrder.addOns.map(addon => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span className="text-zinc-400">+ {addon.name} {addon.discountPercent ? `(${addon.discountPercent}% off)` : ''}</span>
                    <span className="text-zinc-300 font-mono">
                      {formatCurrency(addon.price * (1 - (addon.discountPercent || 0) / 100))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                  <span className="text-xl font-bold text-white">Total Paid</span>
                  <span className="text-2xl font-bold text-cyan-400 font-mono">{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
