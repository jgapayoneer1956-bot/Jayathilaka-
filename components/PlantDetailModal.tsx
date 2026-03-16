
import React from 'react';
import { Plant, SafetyStatus } from '../types';

interface PlantDetailModalProps {
  plant: Plant;
  onClose: () => void;
  onEdit?: () => void;
}

const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, onClose, onEdit }) => {
  // Derive badges from plant metadata
  const hasBenefit = (term: string) => 
    plant.benefits.some(b => b.toLowerCase().includes(term.toLowerCase())) ||
    plant.name_si.includes(term) ||
    plant.name_en.toLowerCase().includes(term.toLowerCase());

  const badges = [
    { label: 'Pet Safe', show: plant.pet_safe === SafetyStatus.YES, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { label: 'Air Purifying', show: hasBenefit('පිරිසිදු') || hasBenefit('air purif'), color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { label: 'Lucky', show: hasBenefit('වාසනාව') || hasBenefit('lucky'), color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { label: 'Toxic (Caution)', show: plant.avoid_if_kids_pets, color: 'bg-red-500/10 text-red-600 border-red-500/20' }
  ].filter(b => b.show);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-800">
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="p-2 bg-[#10b981] text-white hover:bg-[#059669] rounded-full transition-colors shadow-lg flex items-center gap-2 px-4 text-xs font-black uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto overflow-x-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 group relative">
                <img src={plant.image_links[0] || 'https://picsum.photos/seed/empty/400/400'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={plant.name_en} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-[1.5rem] overflow-hidden shadow-xl bg-slate-900 border border-slate-800 group relative">
                  <img src={plant.image_links[1] || plant.image_links[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Alt view" />
                  <div className="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>
                </div>
                
                <div className="flex flex-col justify-center items-center gap-4 bg-[#0a0f1e] rounded-[1.5rem] p-5 text-center border border-slate-800 group hover:border-emerald-500/30 transition-colors shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">External Search</p>
                    <div className="h-[1px] w-8 bg-slate-800 mx-auto"></div>
                  </div>
                  
                  <a 
                    href={plant.image_search_links?.[0] || `https://www.google.com/search?q=${plant.name_en}+plant&tbm=isch`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group/link"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover/link:scale-110 transition-transform">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest group-hover/link:underline">Google Images</span>
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {plant.category.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-[#10b981] text-white text-[10px] font-black uppercase rounded-lg shadow-lg tracking-wider">{cat}</span>
                  ))}
                </div>
                <div>
                  <h2 className="text-4xl font-black sinhala-font leading-tight text-white">{plant.name_si}</h2>
                  <p className="text-xl text-emerald-500/60 italic mt-1 font-bold">{plant.name_en}</p>
                </div>
                
                {/* Status Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {badges.map((badge, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${badge.color}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safety Banner */}
              {plant.avoid_if_kids_pets && (
                <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-[1.5rem] animate-pulse">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                      <h4 className="text-red-400 font-black uppercase tracking-widest text-xs">අවධානය: විෂ සහිතයි (Toxic)</h4>
                      <p className="text-sm text-red-400/70 mt-1 sinhala-font leading-relaxed">මෙම ශාකය කුඩා දරුවන් හෝ සුරතල් සතුන් සිටින නිවෙස් වල තැබීමෙන් වළකින්න.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Direction</p>
                  <p className="font-bold text-emerald-500">{plant.directions.join(', ')}</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Element</p>
                  <p className="font-bold text-emerald-500">{plant.element}</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Sunlight</p>
                  <p className="font-bold text-slate-200">{plant.sunlight}</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Safety Stats</p>
                  <div className="flex gap-2">
                    <span className={`w-3 h-3 rounded-full ${plant.pet_safe === SafetyStatus.YES ? 'bg-emerald-500' : plant.pet_safe === SafetyStatus.NO ? 'bg-red-500' : 'bg-slate-700'}`}></span>
                    <span className={`w-3 h-3 rounded-full ${plant.kids_safe === SafetyStatus.YES ? 'bg-emerald-500' : plant.kids_safe === SafetyStatus.NO ? 'bg-red-500' : 'bg-slate-700'}`}></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Pets / Kids</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4">ප්‍රයෝජන (Benefits)</h4>
                <div className="flex flex-wrap gap-2">
                  {plant.benefits.map((b, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-sm sinhala-font font-medium shadow-inner flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {plant.cautions.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">සැලකිලිමත් වන්න (Cautions)</h4>
                  <ul className="space-y-3">
                    {plant.cautions.map((c, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-400 sinhala-font bg-slate-900/50 p-3 rounded-xl border border-slate-800/30">
                        <span className="text-red-500 text-lg leading-none">⚠</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;
