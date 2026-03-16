
import React, { useState, useMemo } from 'react';
import { Plant, Direction, Category, SafetyStatus } from '../types';

interface LayoutBuilderProps {
  plants: Plant[];
}

type Step = 'size' | 'preferences' | 'result';

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ plants }) => {
  const [step, setStep] = useState<Step>('size');
  const [landSize, setLandSize] = useState<string>('10 PERCHES');
  const [isPetSafe, setIsPetSafe] = useState(false);
  const [priority, setPriority] = useState<string>('Flower');

  const handleNext = () => {
    if (step === 'size') setStep('preferences');
    else if (step === 'preferences') setStep('result');
  };

  const handleBack = () => {
    if (step === 'preferences') setStep('size');
    else if (step === 'result') setStep('preferences');
  };

  const recommendations = useMemo(() => {
    if (step !== 'result') return null;

    const filtered = plants.filter(p => !isPetSafe || p.pet_safe === SafetyStatus.YES);

    const findBest = (dir: Direction, cat?: Category, term?: string) => {
      let matches = filtered.filter(p => p.directions.includes(dir));
      if (cat) matches = matches.filter(p => p.category.includes(cat));
      if (term) matches = matches.filter(p => 
        p.name_en.toLowerCase().includes(term.toLowerCase()) || 
        p.name_si.toLowerCase().includes(term.toLowerCase())
      );
      return matches[0] || filtered.find(p => p.directions.includes(dir));
    };

    return [
      { zone: 'NW', label: 'white flowers', plant: findBest(Direction.NW, Category.FLOWER, 'white') },
      { zone: 'N', label: 'entrance', plant: findBest(Direction.NORTH, Category.INDOOR) },
      { zone: 'NE', label: 'medicinal', plant: findBest(Direction.NE, Category.HERB) },
      { zone: 'W', label: 'large trees', plant: findBest(Direction.WEST, Category.FRUIT) },
      { zone: 'HOUSE', label: '', plant: null },
      { zone: 'E', label: 'tulsi', plant: findBest(Direction.EAST, Category.HERB, 'Tulsi') },
      { zone: 'SW', label: 'no plants', plant: null },
      { zone: 'S', label: 'red flowers', plant: findBest(Direction.SOUTH, Category.FLOWER, 'red') },
      { zone: 'SE', label: 'kitchen', plant: findBest(Direction.SE, Category.HERB) },
    ];
  }, [step, isPetSafe, plants]);

  if (step === 'size') {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.reload()} className="p-3 rounded-full bg-slate-900 border border-slate-800 shadow-xl">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <h2 className="text-3xl font-black text-white">Build Layout</h2>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex gap-4 items-start">
          <div className="p-2 bg-emerald-500 rounded-full text-white shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p className="text-sm text-emerald-100 font-medium leading-relaxed">
            Recommended planting layouts based on your land size and preferences according to Vastu science.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Land Size</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['10 PERCHES', '20 PERCHES', 'OTHER'].map(size => (
              <button
                key={size}
                onClick={() => setLandSize(size)}
                className={`py-6 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border-2 ${landSize === size ? 'bg-[#10b981] text-white border-[#10b981] shadow-2xl shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-6 bg-[#0f172a] text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl border border-slate-800 hover:bg-[#10b981] hover:border-[#10b981] transition-all"
        >
          Next Step
        </button>
      </div>
    );
  }

  if (step === 'preferences') {
    return (
      <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-6 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-3 rounded-full bg-slate-900 border border-slate-800 shadow-xl">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <h2 className="text-3xl font-black text-white">Build Layout</h2>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Select Preferences</h3>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex items-center justify-between shadow-2xl">
            <span className="text-sm font-black text-slate-300 tracking-wider">Is it pet safe?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPetSafe} onChange={(e) => setIsPetSafe(e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7 relative"></div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">PRIORITY</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Flower', 'Fruit', 'Medicine', 'Shade'].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`py-5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border-2 ${priority === p ? 'bg-emerald-500/10 text-[#10b981] border-[#10b981]' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={handleBack} className="flex-1 py-6 bg-slate-900 text-slate-500 rounded-3xl font-black uppercase tracking-[0.2em] border border-slate-800 transition-all">Back</button>
          <button onClick={handleNext} className="flex-[2] py-6 bg-[#10b981] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 transition-all">Generate Layout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-700">
      {/* Visual Grid Container */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl aspect-square max-w-2xl mx-auto overflow-hidden relative">
        <div className="grid grid-cols-3 grid-rows-3 h-full border border-slate-100">
          {recommendations?.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center justify-center p-4 border border-slate-100 relative ${item.zone === 'HOUSE' ? 'bg-slate-50' : 'bg-white'}`}
            >
              <div className="text-[11px] font-black flex items-center gap-1.5 mb-1">
                <span className="text-emerald-600">{item.zone}</span>
                <span className="text-slate-400 font-medium tracking-tight whitespace-nowrap">{item.label}</span>
              </div>
              {item.plant && (
                <div className="text-center animate-in fade-in zoom-in duration-1000 delay-300">
                  <p className="text-[10px] font-black text-slate-800 sinhala-font">{item.plant.name_si}</p>
                </div>
              )}
              {item.zone === 'HOUSE' && (
                <span className="text-lg font-black text-slate-300 tracking-[0.3em]">HOUSE</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Recommended Plant List</h3>
        </div>

        <div className="space-y-4 divide-y divide-slate-800/50">
          {recommendations?.filter(r => r.plant).map((r, idx) => (
            <div key={idx} className="flex items-center justify-between py-5 group">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-100 sinhala-font group-hover:text-[#10b981] transition-colors">{r.plant?.name_si}</h4>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Zone: {r.zone} | Count: 1</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-xs font-black text-[#10b981] shadow-inner">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-4">
        <button 
          onClick={() => setStep('size')}
          className="flex-1 py-6 bg-slate-900 text-slate-400 rounded-3xl font-black uppercase tracking-[0.2em] border border-slate-800 shadow-xl flex items-center justify-center gap-3 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Restart
        </button>
        <button 
          onClick={() => window.print()}
          className="flex-[2] py-6 bg-[#10b981] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default LayoutBuilder;
