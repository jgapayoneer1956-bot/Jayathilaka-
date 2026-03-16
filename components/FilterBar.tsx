
import React from 'react';
import { Category, Direction, Element, Sunlight } from '../types';

interface FilterBarProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const categories = ['All', ...Object.values(Category)];
  const directions = ['All', ...Object.values(Direction)];
  const elements = ['All', ...Object.values(Element)];
  const suns = ['All', ...Object.values(Sunlight)];

  const updateFilter = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Chips - Row 1 */}
      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => updateFilter('category', cat)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-widest transition-all border ${
              filters.category === cat 
                ? 'bg-[#10b981] text-white border-[#10b981]' 
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Selectors - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981] ml-1">Direction</label>
          <select 
            value={filters.direction}
            onChange={(e) => updateFilter('direction', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none focus:ring-1 focus:ring-[#10b981] appearance-none"
          >
            {directions.map(dir => <option key={dir} value={dir}>{dir}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981] ml-1">Element</label>
          <select 
            value={filters.element}
            onChange={(e) => updateFilter('element', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none focus:ring-1 focus:ring-[#10b981] appearance-none"
          >
            {elements.map(el => <option key={el} value={el}>{el}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981] ml-1">Sunlight</label>
          <select 
            value={filters.sunlight}
            onChange={(e) => updateFilter('sunlight', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none focus:ring-1 focus:ring-[#10b981] appearance-none"
          >
            {suns.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-end h-full pt-4 sm:pt-0">
          <label className="flex items-center cursor-pointer group">
            <input 
              type="checkbox" 
              checked={filters.avoidOnly}
              onChange={(e) => updateFilter('avoidOnly', e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative"></div>
            <span className="ml-3 text-[11px] font-black text-slate-400 peer-checked:text-emerald-500 tracking-wider uppercase sinhala-font">අනතුරු ශාක පමණි</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
