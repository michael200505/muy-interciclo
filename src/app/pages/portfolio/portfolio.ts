import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProjectService } from '../../core/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgrammerProfile } from '../../core/models/programmer.model';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.html'
})
export class PortfolioComponent {

  private programmerService = inject(ProgrammerService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  programmer: ProgrammerProfile | null = null;
  projects: Project[] = [];

  async ngOnInit() {
    const uid = this.route.snapshot.params['id'];

    this.programmer = await this.programmerService.getProgrammer(uid);
    this.projects = await this.projectService.getProjectsByProgrammer(uid);
  }

  agendar(uid: string) {
    this.router.navigate(['/agendar', uid]);
  }
}
