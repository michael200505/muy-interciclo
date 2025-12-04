import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';

import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProjectsService } from '../../core/project/project.service';

import { PageContainerComponent } from '../../ui/container/container';
import { ProgrammerSidebarComponent } from '../../ui/sidebar-programmer/sidebar-programmer';

@Component({
  selector: 'app-programmer-panel',
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    ProgrammerSidebarComponent
  ],
  templateUrl: './programmer.html',
  styleUrls: ['./programmer.scss']
})
export class ProgrammerPanelComponent {

  private auth = inject(Auth);
  private programmerService = inject(ProgrammerService);
  private projectsService = inject(ProjectsService);

  profile: any = null;
  projects: any[] = [];

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    this.profile = await this.programmerService.getProgrammer(user.uid);
    this.projects = await this.projectsService.getProjectsByUser(user.uid);
  }
}
