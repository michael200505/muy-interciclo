// FILE: src/app/pages/admin/admin.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

import { UserService } from '../../core/user/user.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';

import { ProgrammerProfile } from '../../core/models/programmer.model';
import { AppUser } from '../../core/models/user.model';

import { AvailabilityService, AvailabilitySlot } from '../../core/availability/availability.service';

const EMPTY_CONTACTS = {
  email: '',
  linkedin: '',
  github: '',
  whatsapp: '',
};

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminPanelComponent implements OnInit {
  private userService = inject(UserService);
  private programmerService = inject(ProgrammerService);
  private availabilityService = inject(AvailabilityService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  loadingSlots = false;

  allUsers: AppUser[] = [];
  programmers: ProgrammerProfile[] = [];

  selectedUser: AppUser | null = null;

  // ✅ tu HTML lo usa
  editingExisting = false;

  // ✅ mantenemos esto simple, pero el template NO debe usar contactLinks directo
  newProgrammer: ProgrammerProfile = {
    uid: '',
    name: '',
    specialty: '',
    description: '',
    photoURL: '',
    contactLinks: { ...EMPTY_CONTACTS },
    socialLinks: {},
  } as any;

  // ✅ getter seguro para el template (evita TS2532)
  get contactLinksSafe() {
    // si por alguna razón viene undefined, lo creamos
    if (!(this.newProgrammer as any).contactLinks) {
      (this.newProgrammer as any).contactLinks = { ...EMPTY_CONTACTS };
    }
    return (this.newProgrammer as any).contactLinks as typeof EMPTY_CONTACTS;
  }

  // Disponibilidad
  selectedProgrammerId = '';
  slotDate = '';
  slotHour = '';
  slots: AvailabilitySlot[] = [];

  // Cache para saber si ya existe perfil de programador
  private programmerIds = new Set<string>();

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadUsers(), this.loadProgrammers()]);
  }

  // ✅ PUBLIC para el template
  hasProgrammerProfile(uid: string): boolean {
    return this.programmerIds.has(uid);
  }

  async loadUsers() {
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const users = await this.userService.getAllUsers();
      this.allUsers = [...users];
    } catch (e) {
      console.error('ERROR obteniendo usuarios:', e);
      this.allUsers = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadProgrammers() {
    try {
      const list = await this.programmerService.getAllProgrammers();
      this.programmers = [...list];
      this.programmerIds = new Set(list.map(p => p.uid));
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error cargando programadores:', e);
      this.programmers = [];
      this.programmerIds = new Set();
      this.cdr.detectChanges();
    }
  }

  // ✅ lo llama tu HTML
  async startProgrammerSetup(user: AppUser) {
    this.selectedUser = user;

    const exists = this.hasProgrammerProfile(user.uid);
    this.editingExisting = exists;

    let existing: ProgrammerProfile | null = null;
    if (exists) {
      try {
        existing = await this.programmerService.getProgrammer(user.uid);
      } catch (e) {
        console.error('Error leyendo perfil existente:', e);
      }
    }

    this.newProgrammer = {
      uid: user.uid,
      name: existing?.name ?? user.displayName ?? '',
      specialty: existing?.specialty ?? '',
      description: existing?.description ?? '',
      photoURL: existing?.photoURL ?? (user as any).photoURL ?? '',
      contactLinks: {
        ...EMPTY_CONTACTS,
        ...(existing?.contactLinks ?? {}),
        email: existing?.contactLinks?.email ?? user.email ?? '',
      },
      socialLinks: { ...(existing?.socialLinks ?? {}) },
    } as any;

    this.cdr.detectChanges();
  }

  // ✅ lo llama tu HTML
  async saveProgrammerProfile() {
    if (!this.selectedUser) return;

    // 1) convierte a programador
    try {
      await this.userService.updateRole(this.selectedUser.uid, 'programmer');
    } catch (e) {
      console.error('Error actualizando rol a programmer:', e);
    }

    // 2) asegura contactLinks
    const payload: ProgrammerProfile = {
      ...(this.newProgrammer as any),
      uid: this.selectedUser.uid,
      contactLinks: { ...EMPTY_CONTACTS, ...(this.newProgrammer as any).contactLinks },
      socialLinks: (this.newProgrammer as any).socialLinks ?? {},
    };

    await this.programmerService.saveProgrammer(payload);

    await this.loadUsers();
    await this.loadProgrammers();

    alert(this.editingExisting ? '✔ Cambios guardados' : '✔ Perfil creado');
    this.cancelEdit();
  }

  // ✅ lo llama tu HTML
  cancelEdit() {
    this.selectedUser = null;
    this.editingExisting = false;
    this.newProgrammer = {
      uid: '',
      name: '',
      specialty: '',
      description: '',
      photoURL: '',
      contactLinks: { ...EMPTY_CONTACTS },
      socialLinks: {},
    } as any;

    this.cdr.detectChanges();
  }

  // ✅ lo llama tu HTML
  async deleteProgrammerProfile(user: AppUser) {
    const ok = confirm(`¿Eliminar perfil de programador de "${user.displayName || user.email}"?`);
    if (!ok) return;

    try {
      await this.programmerService.deleteProgrammer(user.uid);
      await this.loadProgrammers();
      alert('🗑️ Perfil eliminado');
    } catch (e) {
      console.error('Error eliminando perfil:', e);
      alert('❌ No se pudo eliminar el perfil');
    }
  }

  // -----------------------------
  // DISPONIBILIDAD
  // -----------------------------
  async loadSlots() {
    if (!this.selectedProgrammerId) return;

    this.loadingSlots = true;
    this.cdr.detectChanges();

    try {
      const date = this.slotDate ? this.slotDate : undefined;
      const data = await this.availabilityService.getSlots(this.selectedProgrammerId, date);
      this.slots = [...data].sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour));
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
    await this.availabilityService.addSlot(this.selectedProgrammerId, this.slotDate, this.slotHour);
    this.slotHour = '';
    await this.loadSlots();
  }

  async removeSlot(s: AvailabilitySlot) {
    if (!s.id) return;
    await this.availabilityService.deleteSlot(s.id);
    await this.loadSlots();
  }
}
