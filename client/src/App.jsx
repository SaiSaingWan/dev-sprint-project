import { useState } from 'react';
import { Zap, User, Home, Target, TrendingUp, IdCard } from 'lucide-react';
import HomePage from './pages/HomePage';
import MissionsPage from './pages/MissionsPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home / Feed', icon: Home },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'progress', label: 'Career & Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Reports', icon: IdCard },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-950 text-slate-100">
      
      {/* TOP HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="bg-sky-600 text-white p-2 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Dev<span className="text-sky-400">Sprint</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Total EXP:</span>
            <span className="font-extrabold text-white font-mono text-sm">1,370</span>
          </div>
          <button 
            onClick={() => setActiveTab('profile')} 
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA WITH SIDEBAR */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900/40 border-r border-slate-800 p-4 space-y-2">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* DYNAMIC PAGE RENDERER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'home' && <HomePage onNavigateToMissions={() => setActiveTab('missions')} />}
          {activeTab === 'missions' && <MissionsPage />}
          {activeTab === 'progress' && <ProgressPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden bg-slate-900 border-t border-slate-800 flex justify-around py-2.5 sticky bottom-0 z-30">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center ${isActive ? 'text-sky-400' : 'text-slate-400'}`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-bold">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}