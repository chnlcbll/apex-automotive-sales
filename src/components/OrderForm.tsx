import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Order, AddOn } from '@/types';
import { formatCurrency, playSound, getFallbackCarImage } from '@/lib/utils';
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
  const [transactionNum] = useState(() => `TRX-${uuidv4().slice(0, 8).toUpperCase()}`);
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
      else if (!finalImageUrl) finalImageUrl = getFallbackCarImage(carName);
    } catch (error) {
      if (!finalImageUrl) finalImageUrl = getFallbackCarImage(carName);
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
                <input required type="number" min="0" value={carPrice} onChange={e => setCarPrice(e.target.value)} className={`${inputClass} font-mono`} placeholder="0.00" />
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
                 <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} className={`${inputClass} font-mono`} placeholder="0" />
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
                <input type="text" value={newAddOnName} onChange={e => setNewAddOnName(e.target.value)} placeholder="Custom add-on name" className={`${inputClass} flex-1`} />
                <input type="number" value={newAddOnPrice} onChange={e => setNewAddOnPrice(e.target.value)} placeholder="Price (₱)" className={`${inputClass} md:w-40 font-mono`} />
                <input type="number" value={newAddOnDiscount} onChange={e => setNewAddOnDiscount(e.target.value)} placeholder="Disc %" className={`${inputClass} md:w-28 font-mono`} />
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
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Any special requests..." />
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
