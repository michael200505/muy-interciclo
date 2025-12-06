// src/app/pages/programmer/programmer.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';

import { ProjectService } from '../../core/project/project.service';
import { Project } from '../../core/models/project.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';
// ❗ Elimina este import **si NO usas `<admin-sidebar>` en tu HTML**
// import { AdminSidebarComponent } from '../../ui/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-programmer-panel',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    PageContainerComponent,
    // ❗ SOLO agrégalo si lo usas en programmer.html
    // AdminSidebarComponent
  ],
  templateUrl: './programmer.html',
  styleUrls: ['./programmer.scss'],
})
export class ProgrammerPanelComponent implements OnInit {

  private asesoriaService = inject(AsesoriaService);
  private projectService = inject(ProjectService);
  private auth = inject(Auth);
  private router = inject(Router);

  asesorias: Asesoria[] = [];
  projects: Project[] = []; // ✔ Ahora tipado correctamente

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Cargar asesorías como antes
      this.asesorias = await this.asesoriaService.getAsesoriasByRequest(user.uid);

      // ✔ Cargar proyectos del usuario
      this.projects = await this.projectService.getProjectsByUser(user.uid);

    } catch (error) {
      console.error('Error cargando datos del panel:', error);

      this.asesorias = [];
      this.projects = [];
    }
  }

  // APROBAR ASESORÍA
  async approve(a: Asesoria) {
    if (!a.id) return;

    await this.asesoriaService.updateStatus(
      a.id,
      'approved',
      'Tu asesoría ha sido aprobada.'
    );

    a.status = 'approved';
    a.response = 'Tu asesoría ha sido aprobada.';
  }

  // RECHAZAR ASESORÍA
  async reject(a: Asesoria) {
    if (!a.id) return;

    await this.asesoriaService.updateStatus(
      a.id,
      'rejected',
      'Lo sentimos, tu asesoría ha sido rechazada.'
    );

    a.status = 'rejected';
    a.response = 'Lo sentimos, tu asesoría ha sido rechazada.';
  }
}
