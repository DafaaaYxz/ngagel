
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Download, ExternalLink, Calendar, Code, FileText, Share2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Project, ProjectType, Admin } from '../types';

const ProjectDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [author, setAuthor] = useState<Admin | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (id) {
        const allProjects = await dataService.getProjects();
        const p = allProjects.find(proj => proj.id === id);
        if (p) {
          setProject(p);
          const a = dataService.getAdmins().find(adm => adm.id === p.authorId);
          setAuthor(a || null);
        }
      }
    };
    fetchProjectData();
  }, [id]);

  const handleLike = () => {
    if (project && !liked) {
      dataService.updateProjectLikes(project.id);
      setProject({ ...project, likes: project.likes + 1 });
      setLiked(true);
    }
  };

  const handleDownload = () => {
    if (project) {
      dataService.updateProjectDownloads(project.id);
      setProject({ ...project, downloads: project.downloads + 1 });
      
      if (project.type === ProjectType.CODE) {
        const element = document.createElement("a");
        const file = new Blob([project.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${project.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        window.open(project.content, '_blank');
      }
    }
  };

  if (!project) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-pulse text-red-600 font-bold tracking-widest uppercase">Initializing_Neural_Link...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
        BACK TO VAULT
      </button>

      <div className="glass rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="relative h-64 md:h-96">
          <img 
            src={project.previewUrl} 
            alt={project.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                  {project.language}
                </span>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {project.type}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{project.name}</h2>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleLike}
                className={`p-4 rounded-3xl transition-all flex items-center gap-2 font-bold ${
                  liked ? 'bg-red-600 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                {project.likes}
              </button>
              <button 
                onClick={handleDownload}
                className="bg-red-600 hover:bg-red-700 text-white p-4 px-8 rounded-3xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                {project.type === ProjectType.CODE ? <Download size={20} /> : <ExternalLink size={20} />}
                {project.type === ProjectType.CODE ? 'DOWNLOAD SOURCE' : 'ACCESS LINK'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} /> DEVELOPER_NOTES
              </h3>
              <p className="text-zinc-300 leading-relaxed text-lg italic">
                "{project.notes || 'No developer notes provided for this artifact.'}"
              </p>
            </section>

            <section>
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Code size={14} /> REPOSITORY_CONTENT
              </h3>
              <div className="bg-zinc-950 rounded-[2rem] p-6 border border-white/5 relative group">
                <div className="absolute top-4 right-4 text-[10px] text-zinc-600 font-mono">READONLY_ACCESS</div>
                <pre className="mono text-sm text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {project.type === ProjectType.CODE 
                    ? project.content 
                    : `Encrypted external resource link:\n\n${project.content}`}
                </pre>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
              <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Metadata_Cluster</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Released</div>
                    <div className="text-sm font-bold">{new Date(project.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {author && (
                  <div className="flex items-center gap-3">
                    <img src={author.photoUrl} alt={author.name} className="w-10 h-10 rounded-xl object-cover grayscale" />
                    <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Architect</div>
                      <div className="text-sm font-bold text-red-500">{author.name}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Download size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Downloads</div>
                    <div className="text-sm font-bold">{project.downloads} instances</div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 p-4 bg-zinc-900 rounded-[2rem] border border-white/5 hover:border-red-600/30 transition-colors text-zinc-400 hover:text-white font-bold text-sm">
              <Share2 size={18} />
              SHARE_PROTOCOL
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
