import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/project/project.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from "../../ui/header/header";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './project-form.html'
})
export class ProjectFormComponent {

  private projectService = inject(ProjectService);
  private auth = inject(Auth);
  private router = inject(Router);

  project = {
    name: '',
    description: '',
    category: 'academic',
    participation: 'frontend',
    technologies: '',
    repoUrl: '',
    demoUrl: ''
  };

  async save() {
    const user = this.auth.currentUser;
    if (!user) return;

    await this.projectService.addProject({
      programmerId: user.uid,
      name: this.project.name,
      description: this.project.description,
      category: this.project.category as any,
      participation: this.project.participation as any,
      technologies: this.project.technologies.split(',').map(t => t.trim()),
      repoUrl: this.project.repoUrl,
      demoUrl: this.project.demoUrl,
      createdAt: Date.now()
    });

    alert("Proyecto guardado");
    this.router.navigate(['/programmer']);
  }
}
