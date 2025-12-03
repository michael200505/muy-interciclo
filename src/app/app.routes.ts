import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.PublicHomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
  path: 'admin',
  loadComponent: () => import('./pages/admin/admin').then(m => m.AdminPanelComponent),
  canActivate: [roleGuard],
  data: { role: 'admin' }
},

  {
    path: 'programmer',
    loadComponent: () => import('./pages/programmer/programmer').then(m => m.ProgrammerPanelComponent),
    canActivate: [roleGuard],
    data: { role: 'programmer' }
  },
  {
    path: 'denied',
    loadComponent: () => import('./pages/denied/denied').then(m => m.DeniedComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
