import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProjectService } from '../../core/project/project.service';

import { ProgrammerProfile } from '../../core/models/programmer.model';
import { Project } from '../../core/models/project.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class PortfolioComponent {

  private route = inject(ActivatedRoute);
  private programmerService = inject(ProgrammerService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  programmer: ProgrammerProfile | null = null;
  projects: Project[] = [];

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('id');
    if (!uid) {
      this.router.navigate(['/']);
      return;
    }

    this.programmer = await this.programmerService.getProgrammer(uid);
    this.projects = await this.projectService.getProjectsByUser(uid);
  }

  agendar(id: string) {
    this.router.navigate(['/agendar', id]);
  }
}
