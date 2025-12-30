
import { Admin, Project, ProjectType, AdminRole } from './types';

export const INITIAL_ADMINS: Admin[] = [
  {
    id: 'admin-1',
    username: 'BraynOfficial',
    name: 'Brayn Official',
    role: AdminRole.OWNER,
    quote: "Code is the architecture of the soul. In the digital void, we are the architects.",
    hashtags: ['#CodeMaster', '#CyberArchitect', '#Innovator'],
    photoUrl: 'https://picsum.photos/seed/brayn/400/400',
    password: 'admin'
  },
  {
    id: 'admin-2',
    username: 'Silverhold',
    name: 'Silverhold',
    role: AdminRole.ADMIN,
    quote: "Security is an illusion. Efficiency is the only truth in a world of data.",
    hashtags: ['#SecOps', '#Efficiency', '#TechVanguard'],
    photoUrl: 'https://picsum.photos/seed/silver/400/400',
    password: 'admin'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    name: 'Cyberpunk UI Kit',
    language: 'React/Tailwind',
    type: ProjectType.CODE,
    content: `const CyberButton = () => (\n  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition-all transform hover:scale-105">\n    INITIALIZE SYSTEM\n  </button>\n);`,
    notes: 'A collection of futuristic UI components optimized for high performance.',
    previewUrl: 'https://picsum.photos/seed/cyber/800/450',
    likes: 124,
    downloads: 450,
    authorId: 'admin-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-2',
    name: 'Deep Neural Visualizer',
    language: 'Python',
    type: ProjectType.FILE,
    content: 'https://github.com/braynofficial/deep-visualizer',
    notes: 'Real-time visualization tool for convolutional neural networks.',
    previewUrl: 'https://picsum.photos/seed/neuron/800/450',
    likes: 89,
    downloads: 210,
    authorId: 'admin-2',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
