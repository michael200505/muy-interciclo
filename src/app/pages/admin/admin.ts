import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../core/user/user.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';

import { AppUser } from '../../core/models/user.model';
import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminPanelComponent implements OnInit {
  private userService = inject(UserService);
  private programmerService = inject(ProgrammerService);
  private cdr = inject(ChangeDetectorRef); // ✅

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
    socialLinks: {}
  };

  ngOnInit() {
    console.log("🟩 ADMIN PANEL INICIADO");
    this.loadUsers(); // ✅ no hace falta async aquí
  }

  async loadUsers() {
    this.loading = true;
    this.cdr.detectChanges(); // ✅ pinta "Cargando..." siempre

    try {
      const users = await this.userService.getAllUsers();

      this.allUsers = [...users]; // ✅ nueva referencia (importante)
      console.log("Usuarios cargados:", this.allUsers);

    } catch (e) {
      console.error("ERROR obteniendo usuarios:", e);

    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // ✅ fuerza repintado tras refresh
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
        whatsapp: ''
      },
      socialLinks: {}
    };
  }

  async saveProgrammerProfile() {
    if (!this.selectedUser) return;

    await this.userService.updateRole(this.selectedUser.uid, 'programmer');
    await this.programmerService.saveProgrammer(this.newProgrammer);

    alert("✔ Programador guardado correctamente");

    this.selectedUser = null;
    await this.loadUsers();
  }
}
