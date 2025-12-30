
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Shield, Layout, Settings, Save, AlertCircle, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { Admin, Project, ProjectType } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'UPLOAD' | 'PROFILE'>('PROJECTS');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [newProj, setNewProj] = useState({ name: '', language: '', type: ProjectType.CODE, content: '', notes: '', previewUrl: '' });
  const [profileForm, setProfileForm] = useState<Partial<Admin>>({});

  useEffect(() => {
    const init = async () => {
      const current = dataService.getCurrentAdmin();
      if (!current) {
        navigate('/login');
        return;
      }
      setAdmin(current);
      setProfileForm(current);
      const projs = await dataService.getProjects();
      setProjects(projs.filter(p => p.authorId === current.id));
    };
    init();
  }, [navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setNewProj(prev => ({ ...prev, previewUrl: url }));
    } catch (err) {
      alert("Matrix Uplink Failed: Image could not be stored.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin) {
      setIsSaving(true);
      const saved = await dataService.saveProject({ ...newProj, authorId: admin.id });
      setProjects(prev => [saved, ...prev]);
      setIsSaving(false);
      setActiveTab('PROJECTS');
      setNewProj({ name: '', language: '', type: ProjectType.CODE, content: '', notes: '', previewUrl: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this legendary artifact from the hub?')) {
      await dataService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (!admin) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-72 space-y-4">
        <div className="glass p-6 rounded-[2.5rem] space-y-6 text-center">
          <div className="relative inline-block">
            <img src={admin.photoUrl} alt={admin.name} className="w-24 h-24 rounded-3xl object-cover mx-auto ring-2 ring-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)]" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              {admin.role}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg">{admin.name}</h2>
            <p className="text-zinc-500 text-xs">@{admin.username}</p>
          </div>
          <button 
            onClick={() => { dataService.logout(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-bold"
          >
            <LogOut size={16} /> LOGOUT
          </button>
        </div>

        <nav className="glass p-2 rounded-[2.5rem] flex flex-col">
          <NavBtn icon={<Layout size={18} />} label="My Projects" active={activeTab === 'PROJECTS'} onClick={() => setActiveTab('PROJECTS')} />
          <NavBtn icon={<Plus size={18} />} label="New Upload" active={activeTab === 'UPLOAD'} onClick={() => setActiveTab('UPLOAD')} />
          <NavBtn icon={<Settings size={18} />} label="Settings" active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow space-y-6">
        {activeTab === 'PROJECTS' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Repository <span className="text-zinc-500">({projects.length})</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p.id} className="glass p-4 rounded-[2rem] flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <img src={p.previewUrl} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <h4 className="font-bold">{p.name}</h4>
                      <p className="text-zinc-500 text-xs">{p.language} • {p.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="p-3 text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'UPLOAD' && (
          <form onSubmit={handleUpload} className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Plus className="text-red-600" /> INITIALIZE UPLOAD
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Name</label>
                <input required className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-red-600" value={newProj.name} onChange={e => setNewProj({...newProj, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Language</label>
                <input required className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-red-600" value={newProj.language} onChange={e => setNewProj({...newProj, language: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preview Resource</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`border-2 border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${newProj.previewUrl ? 'border-green-600/50 bg-green-600/5' : 'border-zinc-800 hover:border-red-600/50 hover:bg-red-600/5'}`}>
                  {isUploading ? <Loader2 className="animate-spin text-red-600" /> : newProj.previewUrl ? <CheckCircle2 className="text-green-500" /> : <Upload className="text-zinc-500" />}
                  <span className="text-xs mt-2 font-bold text-zinc-400">{isUploading ? 'UPLINKING...' : newProj.previewUrl ? 'ASSET SECURED' : 'UPLOAD TO CLOUDINARY'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
                <input placeholder="Or paste manual URL" className="w-full bg-black/50 border border-zinc-800 rounded-[2rem] p-4 h-full focus:outline-none focus:border-red-600" value={newProj.previewUrl} onChange={e => setNewProj({...newProj, previewUrl: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Content</label>
              <textarea required className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 h-48 mono text-sm focus:outline-none focus:border-red-600" value={newProj.content} onChange={e => setNewProj({...newProj, content: e.target.value})} />
            </div>

            <button type="submit" disabled={isSaving || isUploading} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold p-5 rounded-3xl shadow-lg transition-all flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {isSaving ? 'NEURAL UPLINK IN PROGRESS...' : 'DEPLOY TO HUB'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-red-600 text-white red-glow' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
    {icon} <span>{label}</span>
  </button>
);

export default AdminDashboard;
