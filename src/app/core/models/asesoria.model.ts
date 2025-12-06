export type AsesoriaStatus = 'pending' | 'approved' | 'rejected';

export interface Asesoria {
  id?: string;
  userId: string;
  programmerId: string;
  name: string;
  email: string;
  date: string;
  hour: string;
  comment: string;
  status: AsesoriaStatus;
  response?: string;
  createdAt: number;
}
