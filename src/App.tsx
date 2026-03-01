/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Utensils, Zap, ShieldCheck, Info, Loader2, Apple, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNutritionInfo } from './services/nutritionService';
import { NutritionInfo } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getNutritionInfo(query);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch nutrition data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Apple size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">Nutria</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">History</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Settings</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900"
          >
            What's on your plate?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-xl mx-auto"
          >
            Enter any food name to get instant nutritional facts, health scores, and expert dietary tips.
          </motion.p>
        </section>

        {/* Search Bar */}
        <section className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a food (e.g., Avocado Toast, Grilled Salmon)"
              className="w-full h-14 pl-14 pr-32 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-center mt-4 text-sm font-medium">{error}</p>
          )}
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div
              key={result.foodName}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Main Stats Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-1",
                      result.healthScore > 70 ? "bg-emerald-500" : result.healthScore > 40 ? "bg-amber-500" : "bg-rose-500"
                    )}>
                      {result.healthScore}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Health Score</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 capitalize mb-1">{result.foodName}</h2>
                  <p className="text-gray-400 font-medium flex items-center gap-1">
                    <Utensils size={14} /> Serving Size: {result.servingSize}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <StatCard label="Calories" value={result.calories} unit="kcal" icon={<Zap className="text-amber-500" size={16} />} />
                  <StatCard label="Protein" value={result.protein} unit="g" icon={<ShieldCheck className="text-blue-500" size={16} />} />
                  <StatCard label="Carbs" value={result.carbs} unit="g" icon={<Info className="text-indigo-500" size={16} />} />
                  <StatCard label="Fat" value={result.fat} unit="g" icon={<Info className="text-rose-500" size={16} />} />
                </div>
              </div>

              {/* Secondary Details */}
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Summary */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info size={20} className="text-emerald-500" />
                    Nutritional Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {result.summary}
                  </p>
                  <div className="mt-6 flex gap-4">
                    <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Fiber</span>
                      <span className="text-xl font-bold">{result.fiber}g</span>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Sugar</span>
                      <span className="text-xl font-bold">{result.sugar}g</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-amber-500" />
                    Dietary Tips
                  </h3>
                  <ul className="space-y-3">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <ChevronRight size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {!result && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-emerald-200" />
              </div>
              <p className="text-gray-400 font-medium">Try searching for "Greek Salad" or "Pepperoni Pizza"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-400 font-medium">
          <p>© 2024 Nutria. Powered by Gemini.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value, unit, icon }: { label: string; value: number; unit: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-colors group">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{value}</span>
        <span className="text-xs font-medium text-gray-400">{unit}</span>
      </div>
    </div>
  );
}
