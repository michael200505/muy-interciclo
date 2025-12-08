import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProjectService } from '../../core/project/project.service';

import { ProgrammerProfile } from '../../core/models/programmer.model';
import { Project } from '../../core/models/project.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

type TabKey = 'academic' | 'professional';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss'],
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
            stagger(70, [
              animate('420ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
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

  activeTab: TabKey = 'professional';

  async ngOnInit(): Promise<void> {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (!uid) {
      this.router.navigate(['/home']);
      return;
    }

    try {
      this.loading = true;
      this.cdr.detectChanges();

      const [programmer, projects] = await Promise.all([
        this.programmerService.getProgrammer(uid),
        this.projectService.getProjectsByUser(uid),
      ]);

      if (!programmer) {
        this.zone.run(() => {
          this.notFound = true;
          this.loading = false;
        });
        this.cdr.detectChanges();
        return;
      }

      const academic = projects.filter((p) => p.type === 'academic');
      const professional = projects.filter((p) => p.type === 'professional');

      this.zone.run(() => {
        this.programmer = programmer;
        this.academicProjects = academic;
        this.professionalProjects = professional;

        // Tab por defecto: si hay profesionales, mostrar eso; si no, académicos
        this.activeTab = professional.length > 0 ? 'professional' : 'academic';

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

  setTab(tab: TabKey) {
    this.activeTab = tab;
  }

  agendar(uid: string) {
    this.router.navigate(['/agendar', uid]);
  }

  whatsappLink(value?: string): string {
    if (!value) return '';
    const cleaned = value.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleaned.replace('+', '')}`;
  }

  trackById(_: number, p: Project) {
    return (p as any).id ?? `${p.title}-${p.role}-${p.type}`;
  }
}
