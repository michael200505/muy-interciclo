export type AsesoriaStatus = 'pending' | 'approved' | 'rejected';

export interface Asesoria {
  id?: string;
  programmerId: string;       // uid del programador
  requesterId?: string;       // uid del usuario si está logueado
  requesterName: string;
  requesterEmail: string;
  date: string;               // 'YYYY-MM-DD'
  time: string;               // 'HH:mm'
  comment?: string;
  status: AsesoriaStatus;
  responseMessage?: string;
  createdAt: number;
}
