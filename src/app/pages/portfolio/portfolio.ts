import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
export class PortfolioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private programmerService = inject(ProgrammerService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  programmer: ProgrammerProfile | null = null;

  academicProjects: Project[] = [];
  professionalProjects: Project[] = [];

  loading = true;
  notFound = false;

  async ngOnInit(): Promise<void> {
    const uid = this.route.snapshot.paramMap.get('uid'); // ✅ FIX
    if (!uid) {
      this.router.navigate(['/home']);
      return;
    }

    try {
      this.loading = true;
      this.cdr.detectChanges();

      const [programmer, projects] = await Promise.all([
        this.programmerService.getProgrammer(uid),
        this.projectService.getProjectsByUser(uid)
      ]);

      if (!programmer) {
        this.zone.run(() => {
          this.notFound = true;
          this.loading = false;
        });
        this.cdr.detectChanges();
        return;
      }

      this.zone.run(() => {
        this.programmer = programmer;

        this.academicProjects = projects.filter(p => p.type === 'academic');
        this.professionalProjects = projects.filter(p => p.type === 'professional');

        this.loading = false;
        this.notFound = false;
      });

      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error cargando portafolio:', e);
      this.zone.run(() => {
        this.loading = false;
        this.notFound = true;
      });
      this.cdr.detectChanges();
    }
  }

  agendar(uid: string) {
    this.router.navigate(['/agendar', uid]);
  }
whatsappLink(value?: string): string {
  if (!value) return '';
  const cleaned = value.replace(/[^\d+]/g, '');
  return `https://wa.me/${cleaned.replace('+', '')}`;
}


}
