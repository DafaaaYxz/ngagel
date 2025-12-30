
import React, { useState, useEffect } from 'react';
import { User, Shield, Quote, Github, Twitter, ExternalLink, Code } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Admin, AdminRole } from '../types';

const ProfileCard = ({ admin }: { admin: Admin }) => {
  return (
    <div className="group relative glass rounded-[3rem] p-8 overflow-hidden transition-all duration-500 hover:scale-[1.02] border-zinc-800/50 hover:border-red-600/40">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] pointer-events-none group-hover:bg-red-600/20"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
        <div className="relative shrink-0">
          <img 
            src={admin.photoUrl} 
            alt={admin.name} 
            className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] object-cover grayscale transition-all duration-500 group-hover:grayscale-0 ring-2 ring-zinc-800 group-hover:ring-red-600 shadow-2xl" 
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-tighter">
            {admin.role === AdminRole.OWNER ? 'PROJECT_LEAD' : 'SYSTEM_ADMIN'}
          </div>
        </div>
        
        <div className="flex-grow space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{admin.name}</h2>
            <p className="text-red-500 font-mono text-sm">@{admin.username.toLowerCase()}</p>
          </div>
          
          <div className="relative">
            <Quote className="absolute -top-4 -left-6 text-zinc-800/50 group-hover:text-red-600/20 transition-colors" size={48} />
            <p className="text-zinc-400 italic text-lg leading-relaxed relative z-10">
              "{admin.quote}"
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {admin.hashtags.map(tag => (
              <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full group-hover:border-zinc-700 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-center md:justify-start gap-4 pt-4 border-t border-white/5">
            <SocialIcon icon={<Github size={20} />} />
            <SocialIcon icon={<Twitter size={20} />} />
            <SocialIcon icon={<Code size={20} />} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-red-600/30">
    {icon}
  </button>
);

const ProfileView: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    setAdmins(dataService.getAdmins());
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-8">
        <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4">THE <span className="text-red-600">ARCHITECTS</span></h2>
        <p className="text-zinc-500 text-lg">Meet the legends who maintain the fabric of the Source Code Hub.</p>
      </section>

      <div className="space-y-12 pb-10">
        {admins.map(admin => (
          <ProfileCard key={admin.id} admin={admin} />
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
