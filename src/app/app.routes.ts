import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // 🌐 Página principal pública
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent)
  },

  // 🔐 LOGIN (PÚBLICO)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },

  // 👨‍💻 Panel del programador
  {
    path: 'programmer',
    canActivate: [RoleGuard],
    data: { roles: ['programmer'] },
    loadComponent: () =>
      import('./pages/programmer/programmer').then(
        m => m.ProgrammerPanelComponent
      )
  },

  // 🛠️ Panel del administrador
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin/admin').then(
        m => m.AdminPanelComponent
      )
  },

  // 🔎 Portafolio público
  {
    path: 'portafolio/:uid',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then(
        m => m.PortfolioComponent
      )
  },

  // ⚠️ Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
