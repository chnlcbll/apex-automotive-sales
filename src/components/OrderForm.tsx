import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calculator, Calendar, Check, X, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Order, AddOn } from '@/types';
import { cn, formatCurrency, playSound, getRandomCarImage } from '@/lib/utils';
import { TiltCard } from './TiltCard';
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
  { name: 'Dashcam (Front & Rear)', price: 12000 },
  { name: 'Leather Seat Cover', price: 25000 },
  { name: 'Matting (Deep Dish)', price: 6500 },
  { name: 'Sound System Upgrade', price: 45000 },
  { name: 'GPS Tracker', price: 9500 },
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

  // Calculations
  const basePrice = parseFloat(carPrice) || 0;
  const discountVal = parseFloat(discount) || 0;
  const discountAmount = basePrice * (discountVal / 100);
  const addOnsTotal = addOns.reduce((acc, curr) => {
    const discount = curr.discountPercent || 0;
    const discountedPrice = curr.price * (1 - discount / 100);
    return acc + discountedPrice;
  }, 0);
  const finalTotal = Math.max(0, basePrice - discountAmount + addOnsTotal);

  const handleAddAddOn = () => {
    if (!newAddOnName || !newAddOnPrice) return;
    playSound('click');
    setAddOns([
      ...addOns,
      {
        id: uuidv4(),
        name: newAddOnName,
        price: parseFloat(newAddOnPrice) || 0,
        discountPercent: parseFloat(newAddOnDiscount) || 0,
      },
    ]);
    setNewAddOnName('');
    setNewAddOnPrice('');
    setNewAddOnDiscount('');
  };

  const handleSelectUpgrade = (upgrade: { name: string, price: number }) => {
    setNewAddOnName(upgrade.name);
    setNewAddOnPrice(upgrade.price.toString());
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

    // Generate accurate nano image
    let finalImageUrl = imageUrl;
    try {
      const generated = await generateCarImage(carName, color || 'Silver', yearModel || '2024');
      if (generated) {
        finalImageUrl = generated;
      } else if (!finalImageUrl) {
        finalImageUrl = getRandomCarImage();
      }
    } catch (error) {
      console.error("Failed to generate nano image:", error);
      if (!finalImageUrl) finalImageUrl = getRandomCarImage();
    }
    
    const order: Order = {
      id: uuidv4(),
      transactionNumber: transactionNum,
      carName,
      carPrice: basePrice,
      yearModel,
      color,
      discountPercent: discountVal,
      addOns,
      pickupDate,
      note,
      totalPrice: finalTotal,
      status: 'completed',
      createdAt: Date.now(),
      imageUrl: finalImageUrl,
    };
    
    onFinish(order);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                New Transaction
              </h2>
              <p className="text-zinc-400 font-mono text-sm mt-1">#{transactionNum}</p>
            </div>
            <button
              onClick={() => { playSound('click'); onCancel(); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Car Details Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Car Name</label>
                  <input
                    required
                    type="text"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Porsche 911 GT3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Year Model</label>
                  <input
                    required
                    type="text"
                    value={yearModel}
                    onChange={(e) => setYearModel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. 2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Color</label>
                  <input
                    required
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Shark Blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Base Price (₱)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full" />
                Pricing & Discounts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                      placeholder="0"
                    />
                    <Calculator className="absolute right-3 top-3 w-5 h-5 text-zinc-600" />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-zinc-400">Discount Amount</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                Upgrades & Accessories
              </h3>
              
              <div className="bg-black/20 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {DEFAULT_UPGRADES.map((upgrade) => (
                    <button
                      key={upgrade.name}
                      type="button"
                      onClick={() => handleSelectUpgrade(upgrade)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      {upgrade.name}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAddOnName}
                    onChange={(e) => setNewAddOnName(e.target.value)}
                    placeholder="Add-on name"
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    value={newAddOnPrice}
                    onChange={(e) => setNewAddOnPrice(e.target.value)}
                    placeholder="Price"
                    className="w-24 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <input
                    type="number"
                    value={newAddOnDiscount}
                    onChange={(e) => setNewAddOnDiscount(e.target.value)}
                    placeholder="Disc %"
                    className="w-20 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddAddOn}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg px-4 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mt-4">
                  <AnimatePresence>
                    {addOns.map((addon) => (
                      <motion.div
                        key={addon.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/5"
                      >
                        <span className="text-zinc-300">{addon.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-mono text-emerald-400 block">
                              +{formatCurrency(addon.price * (1 - (addon.discountPercent || 0) / 100))}
                            </span>
                            {addon.discountPercent && addon.discountPercent > 0 && (
                              <span className="text-[10px] text-zinc-500 line-through block">
                                {formatCurrency(addon.price)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAddOn(addon.id)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {addOns.length === 0 && (
                    <p className="text-zinc-600 text-sm text-center py-2 italic">No add-ons selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                Logistics & Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Pickup/Delivery Date</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors [color-scheme:dark]"
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-zinc-600 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Notes</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={1}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    placeholder="Any special requests..."
                  />
                </div>
              </div>
            </div>

            {/* Total & Actions */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-zinc-400 text-sm uppercase tracking-wider">Total Estimated Price</p>
                <p className="text-4xl font-bold text-white font-mono mt-1">{formatCurrency(finalTotal)}</p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => { playSound('click'); onCancel(); }}
                  className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Nano Image...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Finish Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <FloatingCalculator />
    </motion.div>
  );
}
