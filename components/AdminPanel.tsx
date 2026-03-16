
import React, { useState, useEffect } from 'react';
import { Plant, Category, Direction, Element, Sunlight, SafetyStatus } from '../types';
import { api } from '../api';

interface AdminPanelProps {
  plants: Plant[];
  onAdd: (plant: Plant) => void;
  onBulkAdd: (plants: Plant[]) => void;
  onUpdate: (plant: Plant) => void;
  onDelete: (id: string) => void;
  externalEditPlant: Plant | null;
  onClearExternalEdit: () => void;
  onResetAll?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ plants, onAdd, onBulkAdd, onUpdate, onDelete, externalEditPlant, onClearExternalEdit, onResetAll }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // Centralized Form State
  const [formData, setFormData] = useState({
    plant_id: '',
    name_si: '',
    name_en: '',
    scientific_name: '',
    element: Element.EARTH,
    sunlight: Sunlight.MEDIUM,
    pet_safe: SafetyStatus.YES,
    kids_safe: SafetyStatus.YES,
    avoid_if_kids_pets: false,
    benefits: '',
    cautions: '',
    image_links: ['']
  });

  // Sync form with editing plant
  useEffect(() => {
    if (externalEditPlant) {
      setFormData({
        plant_id: externalEditPlant.plant_id,
        name_si: externalEditPlant.name_si,
        name_en: externalEditPlant.name_en,
        scientific_name: externalEditPlant.scientific_name || '',
        element: externalEditPlant.element,
        sunlight: externalEditPlant.sunlight,
        pet_safe: externalEditPlant.pet_safe,
        kids_safe: externalEditPlant.kids_safe,
        avoid_if_kids_pets: externalEditPlant.avoid_if_kids_pets,
        benefits: externalEditPlant.benefits.join('\n'),
        cautions: externalEditPlant.cautions.join('\n'),
        image_links: externalEditPlant.image_links.length > 0 ? [...externalEditPlant.image_links] : ['']
      });
      setIsAdding(false);
    }
  }, [externalEditPlant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.image_links];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, image_links: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, image_links: [...prev.image_links, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.image_links.length <= 1) return;
    const newImages = formData.image_links.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, image_links: newImages }));
  };

  const handleMagicFill = async () => {
    if (!formData.name_en) return alert("Please enter an English Name first.");
    setIsGenerating(true);
    try {
      const details = await api.generatePlantDetails(formData.name_en);
      setFormData(prev => ({
        ...prev,
        name_si: details.name_si || prev.name_si,
        scientific_name: details.scientific_name || prev.scientific_name,
        element: (details.element as Element) || prev.element,
        sunlight: (details.sunlight as Sunlight) || prev.sunlight,
        pet_safe: (details.pet_safe as SafetyStatus) || prev.pet_safe,
        kids_safe: (details.kids_safe as SafetyStatus) || prev.kids_safe,
        avoid_if_kids_pets: details.avoid_if_kids_pets ?? prev.avoid_if_kids_pets,
        benefits: details.benefits?.join('\n') || prev.benefits
      }));
      alert("AI Magic Fill complete!");
    } catch (err) {
      alert("AI filling failed. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPlant: Plant = {
      plant_id: formData.plant_id || Math.random().toString(36).substr(2, 9),
      order_index: plants.length + 1,
      name_si: formData.name_si,
      name_en: formData.name_en,
      scientific_name: formData.scientific_name,
      element: formData.element,
      sunlight: formData.sunlight,
      pet_safe: formData.pet_safe,
      kids_safe: formData.kids_safe,
      avoid_if_kids_pets: formData.avoid_if_kids_pets,
      image_links: formData.image_links.filter(url => url.trim() !== ''),
      image_search_links: [`https://www.google.com/search?q=${formData.name_en}+plant`],
      benefits: formData.benefits.split('\n').filter(b => b.trim() !== ''),
      cautions: formData.cautions.split('\n').filter(c => c.trim() !== ''),
      category: [Category.INDOOR], // Defaults
      directions: [Direction.NORTH] // Defaults
    };

    if (formData.plant_id) {
      onUpdate(finalPlant);
    } else {
      onAdd(finalPlant);
    }
    
    // Reset Form
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setFormData({
      plant_id: '',
      name_si: '',
      name_en: '',
      scientific_name: '',
      element: Element.EARTH,
      sunlight: Sunlight.MEDIUM,
      pet_safe: SafetyStatus.YES,
      kids_safe: SafetyStatus.YES,
      avoid_if_kids_pets: false,
      benefits: '',
      cautions: '',
      image_links: ['']
    });
    setIsAdding(false);
    onClearExternalEdit();
  };

  const startNewRecord = () => {
    handleCloseForm();
    setIsAdding(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight sinhala-font">Plant Manager</h2>
          <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Vastu Flora Internal Database</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onResetAll} className="px-5 py-2.5 bg-red-500/10 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Reset All</button>
          <button onClick={startNewRecord} className="px-8 py-2.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">+ New Plant</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar: Plant List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 divide-y dark:divide-slate-800 overflow-hidden shadow-2xl">
            {plants.map(p => (
              <div key={p.plant_id} className={`p-5 flex items-center justify-between group hover:bg-emerald-500/5 transition-all ${formData.plant_id === p.plant_id ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                    <img src={p.image_links[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm sinhala-font truncate">{p.name_si}</h4>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{p.name_en}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* FIX: Replaced one-liner with multi-statement block and explicit property mapping to avoid type errors */}
                  <button onClick={() => {
                    onClearExternalEdit();
                    setFormData({
                      plant_id: p.plant_id,
                      name_si: p.name_si,
                      name_en: p.name_en,
                      scientific_name: p.scientific_name || '',
                      element: p.element,
                      sunlight: p.sunlight,
                      pet_safe: p.pet_safe,
                      kids_safe: p.kids_safe,
                      avoid_if_kids_pets: p.avoid_if_kids_pets,
                      benefits: p.benefits.join('\n'),
                      cautions: p.cautions.join('\n'),
                      image_links: p.image_links.length > 0 ? [...p.image_links] : ['']
                    });
                  }} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">✎</button>
                  <button onClick={() => onDelete(p.plant_id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main: Form Area */}
        <div className="lg:col-span-8">
          {(formData.plant_id || isAdding) ? (
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3rem] border border-emerald-500/20 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-widest">{formData.plant_id ? 'Update Record' : 'New Collection Entry'}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Manual Database Synchronization</p>
                </div>
                <button onClick={handleCloseForm} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex justify-between">
                      English Name
                      <button type="button" onClick={handleMagicFill} disabled={isGenerating} className={`text-[10px] px-2 py-0.5 rounded-md border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? '◌ Generating...' : '✨ Magic Fill'}
                      </button>
                    </label>
                    <input 
                      name="name_en" 
                      type="text" 
                      required 
                      placeholder="e.g. Snake Plant"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Sinhala Name</label>
                    <input 
                      name="name_si" 
                      type="text" 
                      required 
                      placeholder="ශාකයේ නම"
                      value={formData.name_si}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 text-sm sinhala-font transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Scientific Name (Optional)</label>
                  <input 
                    name="scientific_name" 
                    type="text" 
                    value={formData.scientific_name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 text-sm italic transition-all" 
                  />
                </div>

                {/* Vastu & Care Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Vastu Element</label>
                    <select name="element" value={formData.element} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold">
                      {Object.values(Element).map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Sunlight Requirement</label>
                    <select name="sunlight" value={formData.sunlight} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold">
                      {Object.values(Sunlight).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Image Management Section */}
                <div className="space-y-6 pt-6 border-t dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Image Management</label>
                    <button type="button" onClick={addImageField} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">+ Add Image URL</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.image_links.map((url, idx) => (
                      <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-emerald-500/20">
                          <img src={url || 'https://via.placeholder.com/150?text=Empty'} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                        <input 
                          type="url" 
                          placeholder="Paste image URL here..."
                          value={url}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          className="flex-grow bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-[11px]" 
                        />
                        <button type="button" onClick={() => removeImageField(idx)} className="p-2 text-slate-400 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Text Fields */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Benefits (One per line)</label>
                  <textarea 
                    name="benefits" 
                    rows={4} 
                    value={formData.benefits}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500 text-sm sinhala-font transition-all" 
                  />
                </div>

                {/* Safety Toggles */}
                <div className="flex items-center gap-10 py-4 px-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input 
                        name="avoid_if_kids_pets" 
                        type="checkbox" 
                        checked={formData.avoid_if_kids_pets} 
                        onChange={handleInputChange}
                        className="sr-only" 
                      />
                      <div className={`w-12 h-6 rounded-full transition-all ${formData.avoid_if_kids_pets ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.avoid_if_kids_pets ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className={`ml-4 text-[11px] font-black uppercase tracking-widest transition-colors ${formData.avoid_if_kids_pets ? 'text-red-500' : 'text-slate-500'}`}>Danger Warning</span>
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Toggle this if the plant is toxic to pets or small children.</p>
                </div>

                {/* Submit Action */}
                <div className="pt-10 border-t dark:border-slate-800">
                  <button 
                    type="submit" 
                    className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {formData.plant_id ? 'Update Database Engine' : 'Deploy New Plant Record'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-[700px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-5xl">🌱</div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">Command Center</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 max-w-xs leading-relaxed">Select an existing record from the sidebar to modify or create a new entry using the button above.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
