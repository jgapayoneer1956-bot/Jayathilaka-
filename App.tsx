
import React, { useState, useMemo, useEffect } from 'react';
import { Plant, Category, Direction, Element, Sunlight, SafetyStatus } from './types';
import { api } from './api';
import PlantCard from './components/PlantCard';
import FilterBar from './components/FilterBar';
import PlantDetailModal from './components/PlantDetailModal';
import AdminPanel from './components/AdminPanel';
import GuideTabs from './components/GuideTabs';
import LayoutBuilder from './components/LayoutBuilder';

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    direction: 'All',
    element: 'All',
    sunlight: 'All',
    petSafe: 'All',
    kidsSafe: 'All',
    avoidOnly: false
  });
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [adminEditingPlant, setAdminEditingPlant] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'guides' | 'layout' | 'admin'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getAllPlants();
        setPlants(data);
      } catch (err) {
        console.error("Failed to load plants", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && plants.length > 0) {
      api.saveAllPlants(plants);
    }
  }, [plants, isLoading]);

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = 
        plant.name_si.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.name_en.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.category === 'All' || plant.category.includes(filters.category as Category);
      const matchesDirection = filters.direction === 'All' || plant.directions.includes(filters.direction as Direction);
      const matchesElement = filters.element === 'All' || plant.element === filters.element;
      const matchesSunlight = filters.sunlight === 'All' || plant.sunlight === filters.sunlight;
      const matchesPet = filters.petSafe === 'All' || plant.pet_safe === filters.petSafe;
      const matchesKids = filters.kidsSafe === 'All' || plant.kids_safe === filters.kidsSafe;
      const matchesAvoid = !filters.avoidOnly || plant.avoid_if_kids_pets;

      return matchesSearch && matchesCategory && matchesDirection && matchesElement && 
             matchesSunlight && matchesPet && matchesKids && matchesAvoid;
    });
  }, [plants, searchQuery, filters]);

  const handleUpdatePlant = (updatedPlant: Plant) => {
    setPlants(prev => prev.map(p => p.plant_id === updatedPlant.plant_id ? updatedPlant : p));
  };

  const handleAddPlant = (newPlant: Plant) => {
    setPlants(prev => [...prev, newPlant]);
  };

  const handleBulkAddPlants = (newPlants: Plant[]) => {
    setPlants(prev => [...prev, ...newPlants]);
  };

  const handleDeletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.plant_id !== id));
  };

  const handleResetData = async () => {
    if (window.confirm("මෙමගින් ඔබ ඇතුළත් කළ සියලු දත්ත මැකී ගොස් පද්ධතියේ මුල් දත්ත (Master Data) නැවත ස්ථාපනය වේ. ඉදිරියට යමුද?")) {
      const resetData = await api.resetDatabase();
      setPlants(resetData);
      alert("පද්ධතිය නැවත සකස් කරන ලදී.");
    }
  };

  const handleOpenAdminEdit = (plant: Plant) => {
    setAdminEditingPlant(plant);
    setActiveTab('admin');
    setSelectedPlant(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-30 bg-[#020617]/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-[#10b981] rounded-lg shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-tight text-[#10b981] uppercase">VAASTU FLORA</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight">By J.Godakanda Arachchi</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center bg-slate-900/50 p-1 rounded-full border border-slate-800/50">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'guides', label: 'GUIDES' },
              { id: 'layout', label: 'BUILD LAYOUT' },
              { id: 'admin', label: 'ADMIN' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'admin') setAdminEditingPlant(null);
                }}
                className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#10b981] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 hover:scale-110 transition-transform"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#10b981] font-bold uppercase tracking-widest text-[10px]">Loading Database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <div className="space-y-8">
                <div className="relative max-w-4xl mx-auto">
                  <input 
                    type="text"
                    placeholder="ශාකයේ නම සොයන්න (Search name)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4.5 rounded-2xl border border-slate-800 bg-slate-900/50 focus:bg-slate-900 focus:ring-1 focus:ring-[#10b981] outline-none transition-all sinhala-font text-slate-200 placeholder:text-slate-600"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <FilterBar filters={filters} setFilters={setFilters} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                  {filteredPlants.map(plant => (
                    <PlantCard 
                      key={plant.plant_id} 
                      plant={plant} 
                      onClick={() => setSelectedPlant(plant)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guides' && <GuideTabs />}
            {activeTab === 'layout' && <LayoutBuilder plants={plants} />}
            {activeTab === 'admin' && (
              <AdminPanel 
                plants={plants} 
                onAdd={handleAddPlant} 
                onBulkAdd={handleBulkAddPlants}
                onUpdate={handleUpdatePlant} 
                onDelete={handleDeletePlant} 
                externalEditPlant={adminEditingPlant}
                onClearExternalEdit={() => setAdminEditingPlant(null)}
                onResetAll={handleResetData}
              />
            )}
          </>
        )}
      </main>

      {selectedPlant && (
        <PlantDetailModal 
          plant={selectedPlant} 
          onClose={() => setSelectedPlant(null)} 
          onEdit={() => handleOpenAdminEdit(selectedPlant)}
        />
      )}
    </div>
  );
};

export default App;
