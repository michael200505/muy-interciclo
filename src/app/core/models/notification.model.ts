export type NotificationTargetRole = 'user' | 'programmer' | 'admin';

export interface AppNotification {
  id?: string;

  toUid: string;                 // destinatario
  roleTarget: NotificationTargetRole;

  title: string;
  message: string;

  read: boolean;
  createdAt: number;

  // Metadata útil (opcional)
  asesoriaId?: string;
  programmerId?: string;
  userId?: string;
  date?: string;
  hour?: string;
}
