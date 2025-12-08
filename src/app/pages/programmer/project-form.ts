import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

import { ProjectService } from '../../core/project/project.service';
import { Project } from '../../core/models/project.model';

import { PageContainerComponent } from '../../ui/container/container';
import { HeaderComponent } from '../../ui/header/header';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageContainerComponent, HeaderComponent],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.scss']
})
export class ProjectFormComponent implements OnInit {
  private auth = inject(Auth);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editingId: string | null = null;

  project = {
    title: '',
    description: '',
    type: 'academic' as 'academic' | 'professional',
    role: 'frontend' as 'frontend' | 'backend' | 'fullstack' | 'database',
    technologies: '',
    repoURL: '',
    demoURL: ''
  };

  async ngOnInit(): Promise<void> {
    this.editingId = this.route.snapshot.paramMap.get('id');

    if (this.editingId) {
      const existing = await this.projectService.getProjectById(this.editingId);

      if (!existing) {
        alert('Proyecto no encontrado');
        this.router.navigate(['/programmer']);
        return;
      }

      // ✅ seguridad: que solo edite el dueño
      const user = this.auth.currentUser;
      if (!user || existing.uid !== user.uid) {
        alert('No tienes permiso para editar este proyecto');
        this.router.navigate(['/programmer']);
        return;
      }

      this.project = {
        title: existing.title,
        description: existing.description,
        type: existing.type,
        role: existing.role,
        technologies: (existing.technologies || []).join(', '),
        repoURL: existing.repoURL || '',
        demoURL: existing.demoURL || ''
      };
    }
  }

  async save() {
    const user = this.auth.currentUser;
    if (!user) return;

    if (!this.project.title.trim() || !this.project.description.trim()) {
      alert('Completa los campos obligatorios');
      return;
    }

    const techArray = this.project.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (this.editingId) {
      await this.projectService.updateProject(this.editingId, {
        title: this.project.title,
        description: this.project.description,
        type: this.project.type,
        role: this.project.role,
        technologies: techArray,
        repoURL: this.project.repoURL || '',
        demoURL: this.project.demoURL || ''
      });

      alert('Proyecto actualizado ✔');
    } else {
      const newProject: Project = {
        uid: user.uid,
        title: this.project.title,
        description: this.project.description,
        type: this.project.type,
        role: this.project.role,
        technologies: techArray,
        repoURL: this.project.repoURL || '',
        demoURL: this.project.demoURL || '',
        createdAt: Date.now()
      };

      await this.projectService.createProject(newProject);
      alert('Proyecto creado ✔');
    }

    this.router.navigate(['/programmer']);
  }
}
