import fs from 'fs';

const appCode = `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Vehicle } from '@/types';
import { OrderForm } from '@/components/OrderForm';
import { HistoryList } from '@/components/HistoryList';
import { VehicleSearch } from '@/components/VehicleSearch';
import { formatCurrency, playSound } from '@/lib/utils';
import { Car, History, ShoppingBag, X, Search, Menu } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F7F7F8] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Sleek Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 transition-all">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { playSound('click'); setView('home'); }}
        >
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-zinc-900">APEX<span className="text-zinc-400 font-medium">AUTO</span></span>
        </div>

        <div className="hidden md:flex items-center gap-2 p-1.5 bg-zinc-100/80 rounded-2xl border border-zinc-200/50">
          <button
            onClick={() => { playSound('hover'); setView('search'); }}
            className={\`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 \${
              view === 'search' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }\`}
          >
            <Search className="w-4 h-4" />
            Discover
          </button>
          <button
            onClick={() => { playSound('hover'); setView('buy'); }}
            className={\`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all \${
              view === 'buy' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }\`}
          >
            Configure
          </button>
          <button
            onClick={() => { playSound('hover'); setView('history'); }}
            className={\`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all \${
              view === 'history' 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }\`}
          >
            Orders
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative pt-32 pb-24 min-h-screen flex flex-col">
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl border-b border-zinc-100">
                <div>
                  <span className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase">Transaction Receipt</span>
                  <p className="font-mono text-sm font-semibold text-zinc-900">#{selectedOrder.transactionNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="w-full h-64 rounded-2xl overflow-hidden mb-8 bg-zinc-100 border border-zinc-200">
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
                      <span>{addon.name} {addon.discountPercent ? \`(-\${addon.discountPercent}%)\` : ''}</span>
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
`;

const orderFormCode = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Order, AddOn } from '@/types';
import { formatCurrency, playSound, getRandomCarImage } from '@/lib/utils';
import { generateCarImage } from '@/lib/gemini';
import { FloatingCalculator } from './FloatingCalculator';

interface OrderFormProps {
  initialData?: Partial<Order> | null;
  onFinish: (order: Order) => void;
  onCancel: () => void;
}

const DEFAULT_UPGRADES = [
  { name: 'Ceramic Coating', price: 15000 },
  { name: 'Window Tint (3M)', price: 8500 },
  { name: 'Dashcam (F/R)', price: 12000 },
  { name: 'Leather Seats', price: 25000 },
  { name: 'Deep Dish Mats', price: 6500 },
  { name: 'Premium Audio', price: 45000 },
  { name: 'GPS System', price: 9500 },
];

export function OrderForm({ initialData, onFinish, onCancel }: OrderFormProps) {
  const [transactionNum] = useState(() => \`TRX-\${uuidv4().slice(0, 8).toUpperCase()}\`);
  const [carName, setCarName] = useState(initialData?.carName || '');
  const [carPrice, setCarPrice] = useState<string>(initialData?.carPrice?.toString() || '');
  const [yearModel, setYearModel] = useState(initialData?.yearModel || '');
  const [color, setColor] = useState(initialData?.color || '');
  const [discount, setDiscount] = useState<string>('');
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [newAddOnName, setNewAddOnName] = useState('');
  const [newAddOnPrice, setNewAddOnPrice] = useState('');
  const [newAddOnDiscount, setNewAddOnDiscount] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [note, setNote] = useState('');
  const [imageUrl, setImageUrl] = useState(() => initialData?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = parseFloat(carPrice) || 0;
  const discountVal = parseFloat(discount) || 0;
  const discountAmount = basePrice * (discountVal / 100);
  const addOnsTotal = addOns.reduce((acc, curr) => {
    const d = curr.discountPercent || 0;
    return acc + (curr.price * (1 - d / 100));
  }, 0);
  const finalTotal = Math.max(0, basePrice - discountAmount + addOnsTotal);

  const handleAddAddOn = () => {
    if (!newAddOnName || !newAddOnPrice) return;
    playSound('click');
    setAddOns([...addOns, {
      id: uuidv4(),
      name: newAddOnName,
      price: parseFloat(newAddOnPrice) || 0,
      discountPercent: parseFloat(newAddOnDiscount) || 0,
    }]);
    setNewAddOnName(''); setNewAddOnPrice(''); setNewAddOnDiscount('');
  };

  const handleSelectUpgrade = (u: { name: string, price: number }) => {
    setNewAddOnName(u.name);
    setNewAddOnPrice(u.price.toString());
    playSound('click');
  };

  const removeAddOn = (id: string) => {
    playSound('click');
    setAddOns(addOns.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !carPrice) return;
    setIsSubmitting(true);
    playSound('success');

    let finalImageUrl = imageUrl;
    try {
      const generated = await generateCarImage(carName, color || 'Silver', yearModel || '2024');
      if (generated) finalImageUrl = generated;
      else if (!finalImageUrl) finalImageUrl = getRandomCarImage();
    } catch (error) {
      if (!finalImageUrl) finalImageUrl = getRandomCarImage();
    }
    
    onFinish({
      id: uuidv4(), transactionNumber: transactionNum, carName, carPrice: basePrice,
      yearModel, color, discountPercent: discountVal, addOns, pickupDate, note,
      totalPrice: finalTotal, status: 'completed', createdAt: Date.now(), imageUrl: finalImageUrl,
    });
    setIsSubmitting(false);
  };

  const inputClass = "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-medium";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
      
      {/* Left Column - Form Editor */}
      <div className="lg:col-span-8 space-y-12 pb-24">
        <div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 mb-2">Configure Vehicle</h2>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Transaction Ref: #{transactionNum}</p>
        </div>

        <form onSubmit={handleSubmit} id="order-form" className="space-y-12">
          
          {/* Section 1: Specifications */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-4 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span> Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Car Model</label>
                <input required type="text" value={carName} onChange={e => setCarName(e.target.value)} className={inputClass} placeholder="e.g. Porsche 911 GT3" />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input required type="text" value={yearModel} onChange={e => setYearModel(e.target.value)} className={inputClass} placeholder="e.g. 2024" />
              </div>
              <div>
                <label className={labelClass}>Exterior Color</label>
                <input required type="text" value={color} onChange={e => setColor(e.target.value)} className={inputClass} placeholder="e.g. Shark Blue" />
              </div>
              <div>
                <label className={labelClass}>Base Price (₱)</label>
                <input required type="number" min="0" value={carPrice} onChange={e => setCarPrice(e.target.value)} className={\`\${inputClass} font-mono\`} placeholder="0.00" />
              </div>
            </div>
          </section>

          {/* Section 2: Financials & Add-ons */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-4 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span> Pricing & Upgrades
            </h3>
            
            <div className="mb-8">
              <label className={labelClass}>Overall Discount (%)</label>
              <div className="w-1/2">
                 <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} className={\`\${inputClass} font-mono\`} placeholder="0" />
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Available Upgrades</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {DEFAULT_UPGRADES.map((upgrade) => (
                  <button
                    key={upgrade.name} type="button" onClick={() => handleSelectUpgrade(upgrade)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-50 border border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
                  >
                    {upgrade.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <input type="text" value={newAddOnName} onChange={e => setNewAddOnName(e.target.value)} placeholder="Custom add-on name" className={\`\${inputClass} flex-1\`} />
                <input type="number" value={newAddOnPrice} onChange={e => setNewAddOnPrice(e.target.value)} placeholder="Price (₱)" className={\`\${inputClass} md:w-40 font-mono\`} />
                <input type="number" value={newAddOnDiscount} onChange={e => setNewAddOnDiscount(e.target.value)} placeholder="Disc %" className={\`\${inputClass} md:w-28 font-mono\`} />
                <button type="button" onClick={handleAddAddOn} className="bg-zinc-900 text-white rounded-xl px-6 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mt-6">
                <AnimatePresence>
                  {addOns.map((addon) => (
                    <motion.div key={addon.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between items-center bg-zinc-50 rounded-xl p-4 border border-zinc-100"
                    >
                      <span className="font-semibold text-zinc-700">{addon.name}</span>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="font-mono text-zinc-900 font-bold block">
                            +{formatCurrency(addon.price * (1 - (addon.discountPercent || 0) / 100))}
                          </span>
                          {addon.discountPercent && addon.discountPercent > 0 ? (
                            <span className="text-[10px] text-red-500 font-bold block">-{addon.discountPercent}% OFF</span>
                          ) : null}
                        </div>
                        <button type="button" onClick={() => removeAddOn(addon.id)} className="text-zinc-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {addOns.length === 0 && <p className="text-zinc-400 text-sm text-center py-4 font-medium italic">No upgrades added.</p>}
              </div>
            </div>
          </section>

          {/* Section 3: Logistics */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-4 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span> Logistics & Final Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Delivery / Pickup Date</label>
                <input type="datetime-local" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Special Instructions</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className={\`\${inputClass} resize-none\`} placeholder="Any special requests..." />
              </div>
            </div>
          </section>
        </form>
      </div>

      {/* Right Column - Sticky Receipt */}
      <div className="lg:col-span-4 relative">
        <div className="sticky top-32 bg-zinc-900 text-white rounded-[2rem] p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-light mb-8 flex justify-between items-center">
            Order Summary
            <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors p-2"><X className="w-5 h-5"/></button>
          </h3>
          
          <div className="flex-1 space-y-4 text-sm font-medium border-b border-white/10 pb-8 mb-8">
            <div className="flex justify-between items-start">
              <span className="text-zinc-400">Base Vehicle</span>
              <div className="text-right">
                <span className="block font-mono text-white">{formatCurrency(basePrice)}</span>
                {carName && <span className="block text-[10px] text-zinc-500 uppercase mt-1 max-w-[150px] truncate">{carName}</span>}
              </div>
            </div>
            
            {discountVal > 0 && (
              <div className="flex justify-between text-red-400 pt-2">
                <span>Discount ({discountVal}%)</span>
                <span className="font-mono">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            
            {addOns.length > 0 && (
              <div className="pt-4 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Upgrades</p>
                {addOns.map(a => (
                  <div key={a.id} className="flex justify-between text-zinc-300 pl-2 border-l border-white/10">
                    <span className="truncate pr-4">{a.name}</span>
                    <span className="font-mono flex-shrink-0">+{formatCurrency(a.price * (1 - (a.discountPercent||0)/100))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total Estimated Amount</p>
            <p className="text-4xl font-light tracking-tighter text-white font-mono">{formatCurrency(finalTotal)}</p>
          </div>

          <button
            form="order-form"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-zinc-900 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing...</>
            ) : (
              <>Confirm Order <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>

      <FloatingCalculator />
    </motion.div>
  );
}
`;

const vehicleSearchCode = `import React, { useState } from 'react';
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
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by Make or Model..." className={\`\${inputClass} pl-11\`} />
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
                      {[vehicle.year, vehicle.type, \`\${vehicle.seats} Seats\`, vehicle.transmission].filter(Boolean).map(tag => (
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
`;

const historyListCode = `import React from 'react';
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
`;

const floatingCalcCode = `import React, { useState, useEffect } from 'react';
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
    <div className={\`fixed bottom-6 right-6 z-50 transition-all duration-300 \${isMinimized ? 'w-auto' : 'w-80'}\`}>
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
`;

const indexCssCode = `@import "tailwindcss";

body {
  background-color: #F7F7F8;
  color: #09090b;
}

/* Base custom utilities to smooth out inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`;

fs.writeFileSync('src/App.tsx', appCode);
fs.writeFileSync('src/components/OrderForm.tsx', orderFormCode);
fs.writeFileSync('src/components/VehicleSearch.tsx', vehicleSearchCode);
fs.writeFileSync('src/components/HistoryList.tsx', historyListCode);
fs.writeFileSync('src/components/FloatingCalculator.tsx', floatingCalcCode);
fs.writeFileSync('src/index.css', indexCssCode);
console.log("Rewrite complete");
