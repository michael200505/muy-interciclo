import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { ProjectService } from '../../core/project/project.service';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';
import { Project } from '../../core/models/project.model';
import { Asesoria } from '../../core/models/asesoria.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../ui/header/header";
import { ProgrammerSidebarComponent } from "../../ui/sidebar-programmer/sidebar-programmer";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-programmer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ProgrammerSidebarComponent, PageContainerComponent],
  templateUrl: './programmer.html'
})
export class ProgrammerPanelComponent {

  private auth = inject(Auth);
  private projectService = inject(ProjectService);
  private asesoriaService = inject(AsesoriaService);
  private programmerService = inject(ProgrammerService);
  private router = inject(Router);

  programmerId: string = '';
  projects: Project[] = [];
  asesorias: Asesoria[] = [];
  programmer: any = null;

  categoryFilter: string = 'all';

  get pendingCount(): number {
    return this.asesorias.filter(a => a.status === 'pending').length;
  }

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    this.programmerId = user.uid;

    this.programmer = await this.programmerService.getProgrammer(user.uid);
    this.projects = await this.projectService.getProjectsByProgrammer(user.uid);
    this.asesorias = await this.asesoriaService.getAsesoriasByProgrammer(user.uid);
  }

  async deleteProject(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await this.projectService.deleteProject(id);
    this.projects = await this.projectService.getProjectsByProgrammer(this.programmerId);
  }

  goToNewProject() {
    this.router.navigate(['/programmer/new-project']);
  }

  async updateAsesoria(asesoria: Asesoria, status: string) {
    const message = prompt("Mensaje de respuesta para el solicitante:");
    await this.asesoriaService.updateAsesoriaStatus(
      asesoria.id!,
      status as any,
      message || ''
    );

    // 🔔 Simulación de notificación externa (correo/WhatsApp)
    alert(
      `Notificación simulada enviada al usuario (${asesoria.requesterEmail}).\n\n` +
      `Mensaje: ${message || '(sin mensaje adicional)'}`
    );

    this.asesorias = await this.asesoriaService.getAsesoriasByProgrammer(this.programmerId);
  }
}
