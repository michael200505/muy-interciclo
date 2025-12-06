export type UserRole = 'admin' | 'programmer' | 'user';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;

  // Datos de perfil del programador:
  specialty?: string;       // especialidad
  bio?: string;             // breve descripción
  photoURL?: string;        // foto de perfil
  githubURL?: string;
  linkedinURL?: string;
  portfolioURL?: string;

  createdAt: number;
}
