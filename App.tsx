import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import AzaraAI from './components/AzaraAI';
import Auth from './components/Auth';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import { ViewState, Drug, Sale, User, AppSettings } from './types';
import { INITIAL_INVENTORY, INITIAL_SETTINGS } from './constants';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // App Data State
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [inventory, setInventory] = useState<Drug[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize / Load Data
  useEffect(() => {
    // Load User
    const storedUser = localStorage.getItem('gidi_active_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Data
    const storedInventory = localStorage.getItem('gidi_inventory');
    const storedSales = localStorage.getItem('gidi_sales');
    const storedSettings = localStorage.getItem('gidi_settings');

    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    } else {
      setInventory(INITIAL_INVENTORY);
    }

    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    setIsLoading(false);
  }, []);

  // Persist Data on Change
  useEffect(() => {
    if (!isLoading) {
       localStorage.setItem('gidi_inventory', JSON.stringify(inventory));
    }
  }, [inventory, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('gidi_sales', JSON.stringify(sales));
    }
  }, [sales, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('gidi_settings', JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  // Auth Handlers
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('gidi_active_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gidi_active_user');
    setCurrentView('DASHBOARD');
  };

  // Data Handlers
  const handleAddDrug = (newDrug: Drug) => {
    setInventory(prev => [...prev, newDrug]);
  };

  const handleUpdateDrug = (updatedDrug: Drug) => {
    setInventory(prev => prev.map(d => d.id === updatedDrug.id ? updatedDrug : d));
  };

  const handleDeleteDrug = (id: string) => {
    setInventory(prev => prev.filter(d => d.id !== id));
  };

  const handleProcessSale = (newSale: Sale) => {
    setSales(prev => [...prev, newSale]);
    setInventory(prevInv => prevInv.map(drug => {
      const soldItem = newSale.items.find(item => item.id === drug.id);
      if (soldItem) {
        return { ...drug, quantity: drug.quantity - soldItem.cartQuantity };
      }
      return drug;
    }));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  if (isLoading) return null;

  // If no user is logged in, show Auth screen
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Render Content Based on View
  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard inventory={inventory} sales={sales} settings={settings} />;
      case 'INVENTORY':
        return <Inventory 
                  inventory={inventory} 
                  onAddDrug={handleAddDrug} 
                  onUpdateDrug={handleUpdateDrug}
                  onDeleteDrug={handleDeleteDrug} 
                  settings={settings} 
               />;
      case 'POS':
        return <POS inventory={inventory} onProcessSale={handleProcessSale} settings={settings} />;
      case 'AZARA':
        return <AzaraAI />;
      case 'ANALYTICS':
        return <Analytics sales={sales} inventory={inventory} currencySymbol={settings.currencySymbol} />;
      case 'SETTINGS':
        return <Settings settings={settings} onUpdateSettings={handleUpdateSettings} />;
      default:
        return <Dashboard inventory={inventory} sales={sales} settings={settings} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={user} 
        settings={settings}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;