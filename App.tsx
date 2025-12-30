
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Code, User, MessageSquare, Shield, LogOut, ChevronLeft, Plus, Trash2, Edit3, Heart, Download, ExternalLink, Send } from 'lucide-react';
import { dataService } from './services/dataService';
import { Admin, Project, ProjectType } from './types';
import HomeView from './views/Home';
import ProjectDetailView from './views/ProjectDetail';
import AdminDashboard from './views/AdminDashboard';
import LoginView from './views/Login';
import ProfileView from './views/Profile';
import ChatView from './views/Chat';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="glass rounded-[2.5rem] p-3 flex justify-around items-center red-glow">
        <NavLink to="/" icon={<Home size={22} />} active={isActive('/')} />
        <NavLink to="/profile" icon={<User size={22} />} active={isActive('/profile')} />
        <NavLink to="/chat" icon={<MessageSquare size={22} />} active={isActive('/chat')} />
        <NavLink to="/admin" icon={<Shield size={22} />} active={isActive('/admin') || isActive('/login')} />
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, active }: { to: string, icon: React.ReactNode, active: boolean }) => (
  <Link 
    to={to} 
    className={`p-3 rounded-full transition-all duration-300 ${
      active 
        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.5)] scale-110' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
    }`}
  >
    {icon}
  </Link>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white pb-32">
        <header className="p-6 flex justify-between items-center border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-40">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center red-glow-strong group-hover:rotate-12 transition-transform">
              <Code className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SOURCE <span className="text-red-600">CODE</span> HUB</h1>
          </Link>
          <div className="flex gap-4">
            {/* Optional Top Actions */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/project/:id" element={<ProjectDetailView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<LoginView />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
