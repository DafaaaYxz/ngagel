
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Terminal, FileCode, Heart, Download, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Project, ProjectType } from '../types';

const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/project/${project.id}`} className="group relative">
    <div className="glass rounded-[2rem] overflow-hidden hover:border-red-600/50 transition-all duration-500 hover:scale-[1.02] h-full flex flex-col shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img src={project.previewUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
          {project.type === ProjectType.CODE ? <Terminal size={12} className="text-red-500" /> : <FileCode size={12} className="text-red-500" />}
          {project.language}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{project.name}</h3>
        <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-grow">{project.notes}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm"><Heart size={14} className="group-hover:text-red-500" />{project.likes}</div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm"><Download size={14} className="group-hover:text-red-500" />{project.downloads}</div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">ID: {project.id.slice(0, 8)}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 transition-all duration-500 group-hover:w-1/2 rounded-t-full"></div>
    </div>
  </Link>
);

const HomeView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await dataService.getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = projects.filter(p => (p.name.toLowerCase().includes(search.toLowerCase()) || p.language.toLowerCase().includes(search.toLowerCase())) && (filter === 'ALL' || p.type === filter));

  return (
    <div className="space-y-10">
      <section className="relative text-center py-12">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">THE <span className="text-red-600">LEGENDARY</span> VAULT</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg italic">Accessing database clusters...</p>
      </section>

      <section className="sticky top-24 z-30 bg-black/50 backdrop-blur-xl p-4 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input type="text" placeholder="Search the matrix..." className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-red-600/50" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['ALL', ProjectType.CODE, ProjectType.FILE].map(type => (
            <button key={type} onClick={() => setFilter(type)} className={`px-6 py-3 rounded-2xl font-bold text-xs tracking-widest transition-all ${filter === type ? 'bg-red-600 text-white red-glow' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>{type}</button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-red-600" size={48} />
          <p className="text-zinc-500 font-mono text-sm animate-pulse tracking-widest">QUERYING_MONGODB_ATLAS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {filtered.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      )}
    </div>
  );
};

export default HomeView;
