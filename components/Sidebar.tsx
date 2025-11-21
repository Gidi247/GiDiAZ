import React from 'react';
import { ViewState, User, AppSettings } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User | null;
  settings: AppSettings;
  onLogout: () => void;
  onInstallApp?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, settings, onLogout, onInstallApp }) => {
  const menuItems: { id: ViewState; icon: string; label: string }[] = [
    { id: 'DASHBOARD', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'INVENTORY', icon: 'fa-boxes-stacked', label: 'Inventory' },
    { id: 'POS', icon: 'fa-cash-register', label: 'Point of Sale' },
    { id: 'ANALYTICS', icon: 'fa-chart-line', label: 'Analytics' },
    { id: 'AZARA', icon: 'fa-user-doctor', label: 'AZARA AI' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-gidiDark text-white flex flex-col h-screen sticky top-0 shadow-xl transition-all duration-300 z-50">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-gray-700">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gidiBlue to-gidiTeal flex items-center justify-center shadow-lg shrink-0">
            <i className="fa-solid fa-plus text-white text-xl"></i>
        </div>
        <div className="hidden lg:block overflow-hidden">
            <span className="text-xl font-bold block tracking-tight leading-none">GiDi<span className="text-gidiTeal">.</span></span>
            <span className="text-[10px] text-gray-400 truncate block">{settings.pharmacyName}</span>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-gidiBlue text-white shadow-lg shadow-blue-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className={`w-8 flex justify-center ${item.id === 'AZARA' ? 'animate-pulse' : ''}`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
            </div>
            <span className="hidden lg:block font-medium text-sm">{item.label}</span>
            {item.id === 'AZARA' && (
                <span className="hidden lg:flex ml-auto h-2 w-2 bg-gidiTeal rounded-full animate-ping"></span>
            )}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-700 mx-2">
             <button
                onClick={() => onChangeView('SETTINGS')}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
                  ${currentView === 'SETTINGS' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <div className="w-8 flex justify-center">
                    <i className="fa-solid fa-gear text-lg"></i>
                </div>
                <span className="hidden lg:block font-medium text-sm">Settings</span>
            </button>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        {onInstallApp && (
          <button 
              onClick={onInstallApp}
              className="w-full flex items-center gap-3 p-2 rounded-lg bg-gidiBlue/20 text-gidiBlue hover:bg-gidiBlue hover:text-white transition-colors mb-2 border border-gidiBlue/30"
          >
              <div className="w-8 flex justify-center"><i className="fa-solid fa-download"></i></div>
              <span className="hidden lg:block text-xs font-bold">Install App</span>
          </button>
        )}

        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gidiBlue to-gidiTeal flex items-center justify-center text-xs font-bold uppercase">
                {user?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.role || 'Staff'}</p>
            </div>
        </div>
        <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 py-2"
        >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;