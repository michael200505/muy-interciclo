export type UserRole = 'admin' | 'programmer' | 'user';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
}
