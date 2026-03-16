
import React from 'react';
import { Plant, SafetyStatus } from '../types';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const isDangerous = plant.avoid_if_kids_pets;

  // Derive badges from plant metadata
  const hasBenefit = (term: string) => 
    plant.benefits.some(b => b.toLowerCase().includes(term.toLowerCase())) ||
    plant.name_si.includes(term) ||
    plant.name_en.toLowerCase().includes(term.toLowerCase());

  const badges = [
    { label: 'Pet Safe', show: plant.pet_safe === SafetyStatus.YES, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { label: 'Air Purifying', show: hasBenefit('පිරිසිදු') || hasBenefit('air purif'), color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Lucky', show: hasBenefit('වාසනාව') || hasBenefit('lucky'), color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { label: 'Toxic (Caution)', show: isDangerous, color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  ].filter(b => b.show);

  return (
    <div 
      onClick={onClick}
      className="group bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#10b981]/10 transition-all duration-500 border border-slate-800/50 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        <img 
          src={plant.image_links[0] || 'https://picsum.photos/seed/plant/400/300'} 
          alt={plant.name_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {plant.category.map(cat => (
            <span key={cat} className="px-2.5 py-1 bg-[#10b981]/90 backdrop-blur-md text-[9px] text-white font-black uppercase tracking-tighter rounded-md shadow-lg">
              {cat}
            </span>
          ))}
        </div>
        {isDangerous && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full shadow-xl animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-black sinhala-font mb-0.5 text-slate-100 leading-tight group-hover:text-[#10b981] transition-colors">{plant.name_si}</h3>
        <p className="text-slate-500 text-[11px] italic mb-3 font-bold tracking-tight">{plant.scientific_name || plant.name_en}</p>
        
        {/* Trait Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map((badge, idx) => (
            <span key={idx} className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${badge.color}`}>
              {badge.label}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-black">
            <span className="text-slate-500">ELEMENT</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{plant.element.split(' ')[0]}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-black">
            <span className="text-slate-500">SUNLIGHT</span>
            <span className="text-slate-400">{plant.sunlight}</span>
          </div>
          
          <div className="flex gap-2 pt-3 border-t border-slate-800/50">
            <div className={`flex-1 text-center py-2 rounded-lg text-[9px] font-black tracking-[0.1em] ${plant.pet_safe === SafetyStatus.YES ? 'bg-emerald-500/5 text-emerald-500/60' : plant.pet_safe === SafetyStatus.NO ? 'bg-red-500/10 text-red-500/60' : 'bg-slate-800 text-slate-600'}`}>
              PETS
            </div>
            <div className={`flex-1 text-center py-2 rounded-lg text-[9px] font-black tracking-[0.1em] ${plant.kids_safe === SafetyStatus.YES ? 'bg-emerald-500/5 text-emerald-500/60' : plant.kids_safe === SafetyStatus.NO ? 'bg-red-500/10 text-red-500/60' : 'bg-slate-800 text-slate-600'}`}>
              KIDS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
