import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // -----------------------------
  // PUBLIC ROUTES
  // -----------------------------
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.PublicHomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'portfolio/:id',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then(m => m.PortfolioComponent),
  },
  {
    path: 'agendar/:id',
    loadComponent: () =>
      import('./pages/agendar/agendar').then(m => m.AgendarAsesoriaComponent),
  },
  {
    path: 'mis-asesorias',
    loadComponent: () =>
      import('./pages/mis-asesorias/mis-asesorias').then(m => m.MisAsesoriasComponent),
  },
  {
    path: 'denied',
    loadComponent: () =>
      import('./pages/denied/denied').then(m => m.DeniedComponent),
  },

  // -----------------------------
  // PROTECTED ROUTES (POR ROL)
  // -----------------------------
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.AdminPanelComponent),
    canActivate: [roleGuard],
    data: { role: 'admin' },
    children: [
      // ejemplo: /admin/users
      // { path: 'users', loadComponent: () => import('./pages/admin/users').then(m => m.UsersComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // ejemplo: /admin/dashboard
      // { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard').then(m => m.AdminDashboardComponent) },
    ],
  },

  {
    path: 'programmer',
    loadComponent: () =>
      import('./pages/programmer/programmer').then(m => m.ProgrammerPanelComponent),
    canActivate: [roleGuard],
    data: { role: 'programmer' },
    children: [
      // ahora tu ruta queda mejor así: /programmer/new-project
      {
        path: 'new-project',
        loadComponent: () =>
          import('./pages/programmer/project-form').then(m => m.ProjectFormComponent),
      },
      // { path: 'projects', loadComponent: () => import('./pages/programmer/projects').then(m => m.ProjectsComponent) },
    ],
  },

  // -----------------------------
  // WILDCARD ROUTE (AL FINAL)
  // -----------------------------
  { path: '**', redirectTo: '' },
];
