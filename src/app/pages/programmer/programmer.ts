import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';
import { ProjectService } from '../../core/project/project.service';
import { Project } from '../../core/models/project.model';

import { NotificationService } from '../../core/notification/notification.service';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-programmer-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, PageContainerComponent],
  templateUrl: './programmer.html',
  styleUrls: ['./programmer.scss'],
  animations: [
    trigger('pageIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('520ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('listIn', [
      transition(':enter', [
        query(
          '.anim-item',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(60, [
              animate(
                '420ms cubic-bezier(.2,.8,.2,1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ProgrammerPanelComponent implements OnInit {
  private asesoriaService = inject(AsesoriaService);
  private projectService = inject(ProjectService);
  private notifService = inject(NotificationService);

  private auth = inject(Auth);
  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  asesorias: Asesoria[] = [];
  projects: Project[] = [];
  loadingProjects = false;

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.loadingProjects = true;
      this.cdr.detectChanges();

      const [asesorias, projects] = await Promise.all([
        this.asesoriaService.getAsesoriasByRequest(user.uid),
        this.projectService.getProjectsByUser(user.uid),
      ]);

      this.zone.run(() => {
        this.asesorias = [...asesorias];
        this.projects = [...projects];
        this.loadingProjects = false;
      });

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando datos del panel:', error);
      this.zone.run(() => {
        this.asesorias = [];
        this.projects = [];
        this.loadingProjects = false;
      });
      this.cdr.detectChanges();
    }
  }

  // ✅ APROBAR ASESORÍA + NOTIFICACIÓN
  async approve(a: Asesoria) {
    if (!a.id) return;

    const response = 'Tu asesoría ha sido aprobada.';
    await this.asesoriaService.updateStatus(a.id, 'approved', response);

    // notificación al usuario
    await this.notifService.send({
      toUid: a.userId,
      roleTarget: 'user',
      title: 'Asesoría aprobada ✅',
      message: `Tu asesoría con el programador fue aprobada para ${a.date} a las ${a.hour}.`,
      read: false,
      createdAt: Date.now(),
      asesoriaId: a.id,
      programmerId: a.programmerId,
      userId: a.userId,
      date: a.date,
      hour: a.hour,
    });

    a.status = 'approved';
    a.response = response;
    this.cdr.detectChanges();
  }

  // ✅ RECHAZAR ASESORÍA + NOTIFICACIÓN
  async reject(a: Asesoria) {
    if (!a.id) return;

    const response = 'Lo sentimos, tu asesoría ha sido rechazada.';
    await this.asesoriaService.updateStatus(a.id, 'rejected', response);

    await this.notifService.send({
      toUid: a.userId,
      roleTarget: 'user',
      title: 'Asesoría rechazada ❌',
      message: `Tu asesoría para ${a.date} a las ${a.hour} fue rechazada. Revisa el detalle en “Mis asesorías”.`,
      read: false,
      createdAt: Date.now(),
      asesoriaId: a.id,
      programmerId: a.programmerId,
      userId: a.userId,
      date: a.date,
      hour: a.hour,
    });

    a.status = 'rejected';
    a.response = response;
    this.cdr.detectChanges();
  }

  // ✅ ELIMINAR PROYECTO
  async deleteProject(p: Project) {
    if (!p.id) {
      alert('Este proyecto no tiene id. No se puede eliminar.');
      return;
    }

    const ok = confirm(`¿Eliminar el proyecto "${p.title}"?`);
    if (!ok) return;

    await this.projectService.deleteProject(p.id);
    this.projects = this.projects.filter((x) => x.id !== p.id);
    this.cdr.detectChanges();
  }
}
