import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProgrammerProfile } from '../../core/models/programmer.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
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
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private programmerService = inject(ProgrammerService);

  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  programmers: ProgrammerProfile[] = [];
  loading = true;

  async ngOnInit(): Promise<void> {
    console.log('✅ HOME INIT');

    this.loading = true;
    this.cdr.detectChanges();

    try {
      const list = await this.programmerService.getAllProgrammers();
      console.log('✅ PROGRAMMERS:', list);

      this.zone.run(() => {
        this.programmers = [...list];
        this.loading = false;
      });

      this.cdr.detectChanges();
    } catch (e) {
      console.error('❌ ERROR cargando programmers:', e);

      this.zone.run(() => {
        this.programmers = [];
        this.loading = false;
      });

      this.cdr.detectChanges();
    }
  }

  openPortfolio(uid: string) {
    this.router.navigate(['/portafolio', uid]);
  }

  trackByUid(_: number, p: ProgrammerProfile) {
    return p.uid;
  }
}
