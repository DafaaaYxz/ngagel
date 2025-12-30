
export enum ProjectType {
  CODE = 'CODE',
  FILE = 'FILE'
}

export enum AdminRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  quote: string;
  hashtags: string[];
  photoUrl: string;
  password?: string;
}

export interface Project {
  id: string;
  name: string;
  language: string;
  type: ProjectType;
  content: string;
  notes: string;
  previewUrl: string;
  likes: number;
  downloads: number;
  authorId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAdmin: boolean;
}
