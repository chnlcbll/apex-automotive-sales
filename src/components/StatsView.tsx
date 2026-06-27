import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, CarFront } from 'lucide-react';

interface StatsViewProps {
  orders: Order[];
}

const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8'];

export function StatsView({ orders }: StatsViewProps) {
  const { revenueData, configData, totalRevenue, totalOrders } = useMemo(() => {
    let totalRevenue = 0;
    
    // Process Revenue Over Time
    const revenueByDate: Record<string, number> = {};
    
    // Process Popular Configs
    const configCount: Record<string, number> = {};

    orders.forEach(order => {
      totalRevenue += order.totalPrice;
      
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!revenueByDate[date]) revenueByDate[date] = 0;
      revenueByDate[date] += order.totalPrice;
      
      const configName = `${order.carName} - ${order.color}`;
      if (!configCount[configName]) configCount[configName] = 0;
      configCount[configName] += 1;
    });

    const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    }));

    const configData = Object.entries(configCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    return { revenueData, configData, totalRevenue, totalOrders: orders.length };
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">No Data Available</h3>
        <p className="text-zinc-500">Complete some orders to see your statistics.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Dealership Analytics</h2>
        <p className="text-zinc-500">Track your performance and popular models.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200/50 flex items-center gap-6"
        >
          <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-black font-mono text-zinc-900 tracking-tighter">{formatCurrency(totalRevenue)}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200/50 flex items-center gap-6"
        >
          <div className="w-14 h-14 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-200">
            <CarFront className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-1">Vehicles Sold</p>
            <p className="text-3xl font-black font-mono text-zinc-900 tracking-tighter">{totalOrders}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200/50"
        >
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Revenue Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickFormatter={(val) => `₱${(val / 1000000).toFixed(1)}M`}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200/50"
        >
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Popular Configurations</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={configData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  width={150}
                  tick={{ fill: '#3f3f46', fontSize: 12, fontWeight: 500 }}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#18181b" radius={[0, 4, 4, 0]}>
                  {configData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
