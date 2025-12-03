export interface ProgrammerProfile {
  uid: string;                 // mismo uid del usuario
  name: string;
  specialty: string;
  description: string;
  photoURL: string;
  contactLinks: {
    email?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    whatsapp?: string;
  };
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}
