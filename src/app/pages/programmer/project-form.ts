import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ProjectService } from '../../core/project/project.service';

import { PageContainerComponent } from '../../ui/container/container';
import { HeaderComponent } from '../../ui/header/header';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageContainerComponent,
    HeaderComponent
  ],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.scss']
})
export class ProjectFormComponent {

  private auth = inject(Auth);
  private projectService = inject(ProjectService); // ✔ CORRECTO
  private router = inject(Router);

  // Modelo del proyecto
  project = {
    title: '',
    description: '',
    type: 'academic' as 'academic' | 'professional',
    role: 'frontend' as 'frontend' | 'backend' | 'fullstack' | 'database',
    technologies: '',
    repoURL: '',
    demoURL: ''
  };

  async save() {
    const user = this.auth.currentUser;
    if (!user) return;

    await this.projectService.createProject({
      uid: user.uid,
      title: this.project.title,
      description: this.project.description,
      type: this.project.type,
      role: this.project.role,
      technologies: this.project.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
      repoURL: this.project.repoURL,
      demoURL: this.project.demoURL,
      createdAt: Date.now()
    });

    alert('Proyecto creado con éxito');
    this.router.navigate(['/programmer']);
  }
}
