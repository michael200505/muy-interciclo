import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

import { UserService } from '../../core/user/user.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';

import {
  AvailabilityService,
  AvailabilitySlot,
} from '../../core/availability/availability.service';
import { ProgrammerProfile } from '../../core/models/programmer.model';

import { AppUser } from '../../core/models/user.model';
import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate(
          '520ms cubic-bezier(.2,.8,.2,1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('panelIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(.99)' }),
        animate(
          '560ms cubic-bezier(.2,.8,.2,1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class AdminPanelComponent implements OnInit {
  private userService = inject(UserService);
  private programmerService = inject(ProgrammerService);
  private availabilityService = inject(AvailabilityService);
  private cdr = inject(ChangeDetectorRef);

  allUsers: AppUser[] = [];
  loading = false;
  selectedUser: AppUser | null = null;

  newProgrammer = {
    uid: '',
    name: '',
    specialty: '',
    description: '',
    photoURL: '',
    contactLinks: { email: '', linkedin: '', github: '', whatsapp: '' },
    socialLinks: {},
  };

  // Disponibilidad
  programmers: ProgrammerProfile[] = [];
  selectedProgrammerId = '';
  slotDate = '';
  slotHour = '';
  slots: AvailabilitySlot[] = [];
  loadingSlots = false;

  ngOnInit() {
    console.log('🟩 ADMIN PANEL INICIADO');
    this.loadUsers();
    this.loadProgrammers();
  }

  async loadUsers() {
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const users = await this.userService.getAllUsers();
      this.allUsers = [...users];
      console.log('Usuarios cargados:', this.allUsers);
    } catch (e) {
      console.error('ERROR obteniendo usuarios:', e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadProgrammers() {
    try {
      this.programmers = await this.programmerService.getAllProgrammers();
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error cargando programadores:', e);
    }
  }

  startProgrammerSetup(user: AppUser) {
    this.selectedUser = user;

    this.newProgrammer = {
      uid: user.uid,
      name: user.displayName || '',
      specialty: '',
      description: '',
      photoURL: user.photoURL || '',
      contactLinks: {
        email: user.email || '',
        linkedin: '',
        github: '',
        whatsapp: '',
      },
      socialLinks: {},
    };
  }

  async saveProgrammerProfile() {
    if (!this.selectedUser) return;

    await this.userService.updateRole(this.selectedUser.uid, 'programmer');
    await this.programmerService.saveProgrammer(this.newProgrammer);

    alert('✔ Programador guardado correctamente');

    this.selectedUser = null;
    await this.loadUsers();
    await this.loadProgrammers();
  }

  async loadSlots() {
    if (!this.selectedProgrammerId) return;

    this.loadingSlots = true;
    this.cdr.detectChanges();

    try {
      const date = this.slotDate ? this.slotDate : undefined;
      const all = await this.availabilityService.getSlots(
        this.selectedProgrammerId,
        date
      );
      this.slots = all.sort((a, b) =>
        (a.date + a.hour).localeCompare(b.date + b.hour)
      );
    } catch (e) {
      console.error('Error cargando slots:', e);
      this.slots = [];
    } finally {
      this.loadingSlots = false;
      this.cdr.detectChanges();
    }
  }

  async addSlot() {
    if (!this.selectedProgrammerId || !this.slotDate || !this.slotHour) {
      alert('Selecciona programador, fecha y hora');
      return;
    }

    await this.availabilityService.addSlot(
      this.selectedProgrammerId,
      this.slotDate,
      this.slotHour
    );
    this.slotHour = '';
    await this.loadSlots();
  }

  async removeSlot(s: AvailabilitySlot) {
    if (!s.id) return;
    await this.availabilityService.deleteSlot(s.id);
    await this.loadSlots();
  }
}
