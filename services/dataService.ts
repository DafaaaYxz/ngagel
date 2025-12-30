
import { Admin, Project, ProjectType } from '../types';
import { INITIAL_ADMINS, INITIAL_PROJECTS } from '../constants';

const API_BASE = 'http://localhost:5000/api';

const STORAGE_KEYS = {
  PROJECTS: 'sh_projects',
  ADMINS: 'sh_admins',
  CURRENT_ADMIN: 'sh_current_admin'
};

export const dataService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        return data.length > 0 ? data : INITIAL_PROJECTS;
      }
    } catch (e) {
      console.warn("Backend unavailable. Falling back to LocalStorage.");
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(stored);
  },

  saveProject: async (project: Omit<Project, 'id' | 'likes' | 'downloads' | 'createdAt'>): Promise<Project> => {
    const newProject: Project = {
      ...project,
      id: `p-${Date.now()}`,
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || JSON.stringify(INITIAL_PROJECTS));
    const updated = [newProject, ...projects];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    return newProject;
  },

  deleteProject: async (id: string) => {
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    } catch (e) {}
    
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const updated = projects.filter((p: Project) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
  },

  updateProjectLikes: (id: string) => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const updated = projects.map((p: Project) => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    fetch(`${API_BASE}/projects/${id}/like`, { method: 'POST' }).catch(() => {});
  },

  updateProjectDownloads: (id: string) => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const updated = projects.map((p: Project) => p.id === id ? { ...p, downloads: p.downloads + 1 } : p);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    fetch(`${API_BASE}/projects/${id}/download`, { method: 'POST' }).catch(() => {});
  },

  getAdmins: (): Admin[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(stored);
  },

  updateAdmin: async (id: string, updates: Partial<Admin>) => {
    const admins = dataService.getAdmins();
    const updated = admins.map(a => a.id === id ? { ...a, ...updates } : a);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
    
    try {
      await fetch(`${API_BASE}/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}

    const current = dataService.getCurrentAdmin();
    if (current?.id === id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify({ ...current, ...updates }));
    }
  },

  login: (username: string, pass: string): Admin | null => {
    const admins = dataService.getAdmins();
    const admin = admins.find(a => a.username === username && a.password === pass);
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
      return admin;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  },

  getCurrentAdmin: (): Admin | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return stored ? JSON.parse(stored) : null;
  }
};
