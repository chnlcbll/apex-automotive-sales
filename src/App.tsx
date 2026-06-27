import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Vehicle } from '@/types';
import { OrderForm } from '@/components/OrderForm';
import { HistoryList } from '@/components/HistoryList';
import { VehicleSearch } from '@/components/VehicleSearch';
import { StatsView } from '@/components/StatsView';
import { formatCurrency, playSound } from '@/lib/utils';
import { Car, History, ShoppingBag, X, Search, Menu, Printer, Trash } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'buy' | 'history' | 'search' | 'stats'>('home');
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('apex_auto_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [draftVehicle, setDraftVehicle] = useState<Partial<Order> | null>(null);

  useEffect(() => {
    localStorage.setItem('apex_auto_orders', JSON.stringify(orders));
  }, [orders]);

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

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-zinc-900 font-sans selection:bg-zinc-200 print:bg-white">
      {/* Sleek Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 transition-all print:hidden">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { playSound('click'); setView('home'); }}
        >
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-zinc-900/10 group-hover:shadow-zinc-900/20 transition-all">
            <img src="/logo.svg" alt="Apex Auto Logo" className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-zinc-900">APEX<span className="text-zinc-400 font-medium">AUTO</span></span>
        </div>

        <div className="hidden md:flex items-center gap-2 p-1.5 bg-zinc-100/80 rounded-2xl border border-zinc-200/50">
          <button
            onClick={() => { playSound('hover'); setView('search'); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              view === 'search' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <Search className="w-4 h-4" />
            Discover
          </button>
          <button
            onClick={() => { playSound('hover'); setView('buy'); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              view === 'buy' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Configure
          </button>
          <button
            onClick={() => { playSound('hover'); setView('history'); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              view === 'history' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => { playSound('hover'); setView('stats'); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              view === 'stats' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Stats
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative pt-32 pb-24 min-h-screen flex flex-col print:pt-0 print:pb-0 print:min-h-0 print:block">
        <div className={selectedOrder ? "print:hidden" : ""}>
          <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8 inline-block">
                  Next-Gen Dealership
                </span>
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
                  Design your <br/><span className="font-bold">perfect drive.</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                  Experience the future of automotive retail. Search global inventory or configure your custom vehicle with precision.
                </p>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => { playSound('click'); setView('buy'); }}
                  className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-semibold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 hover:shadow-2xl hover:shadow-zinc-900/30 hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  Start Configuration <ShoppingBag className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { playSound('click'); setView('search'); }}
                  className="px-10 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-semibold text-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-3"
                >
                  Search Inventory <Search className="w-5 h-5" />
                </button>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="mt-20 w-full relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 bg-white"
              >
                 <img 
                   src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop" 
                   alt="Luxury Car Concept" 
                   className="w-full h-[500px] object-cover"
                 />
              </motion.div>
            </motion.div>
          )}

          {view === 'buy' && (
            <motion.div key="buy" className="w-full">
              <OrderForm 
                key={draftVehicle?.carName || 'new'}
                initialData={draftVehicle}
                onFinish={handleFinishOrder} 
                onCancel={() => { setView('home'); setDraftVehicle(null); }} 
              />
            </motion.div>
          )}

          {view === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <VehicleSearch onSelect={handleSelectVehicle} />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <HistoryList 
                orders={orders} 
                onReset={handleResetHistory} 
                onSelectOrder={setSelectedOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            </motion.div>
          )}

          {view === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <StatsView orders={orders} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* Modern Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md print:static print:inset-auto print:p-0 print:bg-transparent print:backdrop-blur-none"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col print:shadow-none print:w-full print:max-h-none print:max-w-none print:rounded-none"
            >
              <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl border-b border-zinc-100 print:relative print:border-b-2 print:border-zinc-900">
                <div>
                  <span className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase">Transaction Receipt</span>
                  <p className="font-mono text-sm font-semibold text-zinc-900">#{selectedOrder.transactionNumber}</p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => { playSound('click'); window.print(); }}
                    className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full transition-colors flex items-center justify-center gap-2 px-4"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-sm font-bold">Print</span>
                  </button>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      playSound('click'); 
                      handleDeleteOrder(selectedOrder.id); 
                    }}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors flex items-center justify-center gap-2 px-4"
                  >
                    <Trash className="w-4 h-4" />
                    <span className="text-sm font-bold">Delete</span>
                  </button>
                  <button
                    onClick={() => { playSound('click'); setSelectedOrder(null); }}
                    className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 print:p-0 print:pt-8">
                <div className="w-full h-64 rounded-2xl overflow-hidden mb-8 bg-zinc-100 border border-zinc-200 print:border-none print:h-80">
                  <img 
                    src={selectedOrder.imageUrl} 
                    alt={selectedOrder.carName} 
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900">{selectedOrder.carName}</h2>
                  <p className="text-zinc-500 font-medium mt-2 flex gap-3 text-sm">
                    <span className="px-3 py-1 bg-zinc-100 rounded-lg">{selectedOrder.yearModel}</span>
                    <span className="px-3 py-1 bg-zinc-100 rounded-lg">{selectedOrder.color}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-1">Created At</p>
                    <p className="text-zinc-900 font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedOrder.pickupDate && (
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-1">Pickup/Delivery</p>
                      <p className="text-zinc-900 font-medium">{new Date(selectedOrder.pickupDate).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedOrder.note && (
                    <div className="col-span-2 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-1">Client Notes</p>
                      <p className="text-zinc-900 italic">"{selectedOrder.note}"</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-zinc-900 border-b border-zinc-100 pb-2">Financial Breakdown</h4>
                  
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>Base Vehicle Price</span>
                    <span className="font-mono text-zinc-900">{formatCurrency(selectedOrder.carPrice)}</span>
                  </div>
                  
                  {selectedOrder.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-red-500 bg-red-50 p-2 rounded-lg -mx-2">
                      <span>Discount ({selectedOrder.discountPercent}%)</span>
                      <span className="font-mono">-{formatCurrency(selectedOrder.carPrice * (selectedOrder.discountPercent / 100))}</span>
                    </div>
                  )}

                  {selectedOrder.addOns.map(addon => (
                    <div key={addon.id} className="flex justify-between text-sm text-zinc-600 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full">
                      <span>{addon.name} {addon.discountPercent ? `(-${addon.discountPercent}%)` : ''}</span>
                      <span className="font-mono text-zinc-900">
                        +{formatCurrency(addon.price * (1 - (addon.discountPercent || 0) / 100))}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-dashed border-zinc-200">
                    <span className="text-lg font-bold text-zinc-900 uppercase tracking-widest">Total Paid</span>
                    <span className="text-3xl font-black text-zinc-900 font-mono tracking-tighter">{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
