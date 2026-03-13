import React, { FormEvent } from 'react';
import { Bell, Search, UserCircle, Moon, Sun } from 'lucide-react';
import { useSupplyChain } from '../store/SupplyChainContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { alerts, userProfile, addToast, isDarkMode, toggleDarkMode } = useSupplyChain();
  const navigate = useNavigate();
  const unreadAlerts = alerts.filter(a => a.severity === 'Red' && a.status === 'Active').length;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    addToast('Search functionality is simulated in this prototype.', 'info');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 relative transition-colors duration-200">
      <div className="flex items-center space-x-4 flex-1">
        <form onSubmit={handleSearch} className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search shipments, locations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
          />
        </form>
      </div>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => navigate('/alerts')}
          className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          )}
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
        {userProfile && (
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>{userProfile.name}</span>
          </button>
        )}
      </div>
    </header>
  );
}
