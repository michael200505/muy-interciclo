import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
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

  // PANEL PROGRAMADOR (protegido)
  {
    path: 'programmer',
    canActivate: [RoleGuard],
    data: { roles: ['programmer'] },
    loadComponent: () =>
      import('./pages/programmer/programmer').then(
        (m) => m.ProgrammerPanelComponent
      ),
  },
  {
  path: 'programmer/new-project',
  loadComponent: () =>
    import('./pages/programmer/project-form').then(m => m.ProjectFormComponent),
  canActivate: [RoleGuard],
  data: { roles: ['programmer'] }
},


  // PANEL ADMINISTRADOR (protegido)
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
  {
  path: 'programmer/edit/:id',
  loadComponent: () =>
    import('./pages/programmer/project-form').then(m => m.ProjectFormComponent),
  canActivate: [RoleGuard],
  data: { roles: ['programmer'] }
},

// AGENDA (USUARIO NORMAL)
{
  path: 'agendar/:uid',
  canActivate: [RoleGuard],
  data: { roles: ['user'] }, // solo usuario normal agenda
  loadComponent: () =>
    import('./pages/agendar/agendar').then(m => m.AgendarAsesoriaComponent),
},

// MIS ASESORÍAS (USUARIO NORMAL)
{
  path: 'mis-asesorias',
  canActivate: [RoleGuard],
  data: { roles: ['user'] },
  loadComponent: () =>
    import('./pages/mis-asesorias/mis-asesorias').then(m => m.MisAsesoriasComponent),
},

// NOTIFICACIONES (cualquier usuario logueado puede verlas)
{
  path: 'notifications',
  canActivate: [RoleGuard],
  data: { roles: ['user', 'programmer', 'admin'] },
  loadComponent: () =>
    import('./pages/notifications/notifications').then(m => m.NotificationsComponent),
},

// al final
{ path: '**', redirectTo: 'login' },
];
