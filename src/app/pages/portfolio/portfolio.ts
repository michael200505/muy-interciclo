import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProjectsService } from '../../core/project/project.service';
import { HeaderComponent } from "../../ui/header/header";
import { PageContainerComponent } from "../../ui/container/container";

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
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  programmer: any = null;
  projects: any[] = [];

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('id');
    if (!uid) return;

    this.programmer = await this.programmerService.getProgrammer(uid);
    this.projects = await this.projectsService.getProjectsByUser(uid);
  }

  agendar(uid: string) {
    this.router.navigate(['/agendar', uid]);
  }
}
