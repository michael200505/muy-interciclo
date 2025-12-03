export type ProjectCategory = 'academic' | 'work';
export type ParticipationType = 'frontend' | 'backend' | 'database' | 'fullstack';

export interface Project {
  id?: string;
  programmerId: string;           // uid del programador
  name: string;
  description: string;
  category: ProjectCategory;      // academic / work
  participation: ParticipationType;
  technologies: string[];
  repoUrl?: string;
  demoUrl?: string;
  createdAt: number;
}
