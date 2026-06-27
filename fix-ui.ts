import fs from 'fs';

const filesToFix = [
  'src/components/OrderForm.tsx',
  'src/components/VehicleSearch.tsx',
  'src/components/HistoryList.tsx',
  'src/components/FloatingCalculator.tsx',
  'src/App.tsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Replace panel-3d
  content = content.replace(/panel-3d/g, "bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl");
  
  // Replace input-3d
  content = content.replace(/input-3d/g, "bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all");
  
  // Replace btn-3d-primary
  content = content.replace(/btn-3d-primary/g, "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2");
  
  // Replace btn-3d-danger
  content = content.replace(/btn-3d-danger/g, "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl px-6 py-3 font-bold transition-all flex items-center justify-center gap-2");
  
  // Replace btn-3d
  content = content.replace(/btn-3d/g, "bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl px-4 py-2 transition-all flex items-center justify-center gap-2");

  // Replace metallic text
  content = content.replace(/text-metallic/g, "bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent");

  // Fix up specific brutalist borders and backgrounds
  content = content.replace(/border-black\/50/g, "border-white/10");
  content = content.replace(/border-black/g, "border-white/10");
  content = content.replace(/bg-\[\#0a0a0a\]/g, "bg-white/5");
  content = content.replace(/bg-\[\#111\]/g, "bg-white/5");
  content = content.replace(/bg-\[\#1a1a1a\]/g, "bg-white/5");
  content = content.replace(/bg-black\/20/g, "bg-white/5");
  content = content.replace(/bg-black\/40/g, "bg-white/5");
  content = content.replace(/shadow-\[inset_0_2px_4px_rgba\(0,0,0,0\.5\)\]/g, "");
  content = content.replace(/shadow-\[inset_0_2px_5px_rgba\(0,0,0,0\.8\)\]/g, "");
  content = content.replace(/shadow-\[inset_0_2px_8px_rgba\(0,0,0,0\.5\)\]/g, "");
  content = content.replace(/shadow-\[inset_0_4px_10px_rgba\(0,0,0,0\.8\)\]/g, "");
  content = content.replace(/border-2/g, "border");
  content = content.replace(/border-zinc-800\/50/g, "border-white/10");
  content = content.replace(/border-zinc-700\/50/g, "border-white/10");
  content = content.replace(/border-zinc-800/g, "border-white/10");
  content = content.replace(/border-zinc-700/g, "border-white/10");
  content = content.replace(/border-b-4/g, "border-b");

  fs.writeFileSync(file, content);
});

console.log("UI updated!");
