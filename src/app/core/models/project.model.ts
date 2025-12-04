export interface Project {
  id?: string;
  uid: string;  // programador dueño del proyecto
  title: string;
  description: string;
  type: 'academic' | 'professional';
  role: 'frontend' | 'backend' | 'fullstack' | 'database';
  technologies: string[];
  repoURL: string;
  demoURL: string;
  createdAt: number;
}
