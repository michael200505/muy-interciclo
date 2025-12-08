import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';
import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProgrammerProfile } from '../../core/models/programmer.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

type AsesoriaView = Asesoria & {
  programmerName?: string;
  programmerPhotoURL?: string;
  programmerSpecialty?: string;
};

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './mis-asesorias.html',
  styleUrls: ['./mis-asesorias.scss'],
  animations: [
    trigger('pageIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('520ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class MisAsesoriasComponent implements OnInit {
  private asesoriaService = inject(AsesoriaService);
  private programmerService = inject(ProgrammerService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  loading = true;
  asesorias: AsesoriaView[] = [];

  private waitUser() {
    return new Promise<any>((resolve) => {
      const unsub = onAuthStateChanged(this.auth, (u) => {
        resolve(u);
        if (unsub) unsub();
      });
    });
  }

  statusLabel(status?: string) {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'pending':
      default: return 'Pendiente';
    }
  }

  async ngOnInit(): Promise<void> {
    const user = await this.waitUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.loading = true;
      this.cdr.detectChanges();

      const data = await this.asesoriaService.getAsesoriasByUser(user.uid);

      const cache = new Map<string, ProgrammerProfile | null>();

      const enriched: AsesoriaView[] = await Promise.all(
        data.map(async (a) => {
          const pid = a.programmerId;

          if (!cache.has(pid)) {
            cache.set(pid, await this.programmerService.getProgrammer(pid));
          }

          const prog = cache.get(pid);

          return {
            ...a,
            programmerName: prog?.name ?? 'Programador',
            programmerPhotoURL: prog?.photoURL ?? '',
            programmerSpecialty: prog?.specialty ?? '',
          };
        })
      );

      this.zone.run(() => {
        this.asesorias = enriched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        this.loading = false;
      });

      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error cargando mis asesorías:', e);
      this.zone.run(() => {
        this.asesorias = [];
        this.loading = false;
      });
      this.cdr.detectChanges();
    }
  }
}
