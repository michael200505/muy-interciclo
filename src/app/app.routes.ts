import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [


   {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Redirigir al login al abrir la app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // LOGIN (público)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginComponent),
  },

  // HOME (usuario normal)
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },

  // PANEL PROGRAMADOR
  {
    path: 'programmer',
    canActivate: [RoleGuard],
    data: { roles: ['programmer'] },
    loadComponent: () =>
      import('./pages/programmer/programmer').then(
        (m) => m.ProgrammerPanelComponent
      ),
  },

  // PANEL ADMINISTRADOR
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin/admin').then((m) => m.AdminPanelComponent),
  },

  // PORTAFOLIO PÚBLICO
  {
    path: 'portafolio/:uid',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then((m) => m.PortfolioComponent),
  },

  // Fallback — cualquier ruta desconocida → login
  { path: '**', redirectTo: 'login' },
];
