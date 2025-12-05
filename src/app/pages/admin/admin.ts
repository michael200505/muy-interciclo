import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../core/user/user.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';

import { AppUser, UserRole } from '../../core/models/user.model';
import { ProgrammerProfile } from '../../core/models/programmer.model';

import { HeaderComponent } from "../../ui/header/header";
import { AdminSidebarComponent } from "../../ui/sidebar-admin/sidebar-admin";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    AdminSidebarComponent,
    PageContainerComponent
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminPanelComponent {

  private userService = inject(UserService);
  private programmerService = inject(ProgrammerService);

  users: AppUser[] = [];
  programmers: ProgrammerProfile[] = [];

  selectedUser: AppUser | null = null;

  newProgrammer: ProgrammerProfile = {
    uid: '',
    name: '',
    specialty: '',
    description: '',
    photoURL: '',
    contactLinks: {},
    socialLinks: {}
  };

  async ngOnInit() {
    await this.loadUsers();
    await this.loadProgrammers();
  }

  async loadUsers() {
    this.users = await this.userService.getAllUsers();
  }

  async loadProgrammers() {
    this.programmers = await this.programmerService.getAllProgrammers();
  }

  selectUser(user: AppUser) {
    this.selectedUser = user;

    this.newProgrammer.uid = user.uid;
    this.newProgrammer.name = user.displayName;
    this.newProgrammer.photoURL = user.photoURL;
  }

  // ✅ CORREGIDO: role es de tipo UserRole, no string
  async setRole(uid: string, role: UserRole) {
    await this.userService.setRole(uid, role);
    await this.loadUsers();
    alert(`Rol cambiado a ${role}`);
  }

  async makeProgrammer() {
    if (!this.selectedUser) return;

    await this.userService.setRole(this.selectedUser.uid, 'programmer');
    await this.programmerService.saveProgrammer(this.newProgrammer);

    alert("Programador creado correctamente ✔");

    this.selectedUser = null;
    this.newProgrammer = {
      uid: '',
      name: '',
      specialty: '',
      description: '',
      photoURL: '',
      contactLinks: {},
      socialLinks: {}
    };

    await this.loadUsers();
    await this.loadProgrammers();
  }

  editProgrammer(p: ProgrammerProfile) {
    this.selectedUser = {
      uid: p.uid,
      email: '',
      displayName: p.name,
      photoURL: p.photoURL,
      role: 'programmer'
    };

    this.newProgrammer = { ...p };
  }

  async updateProgrammer() {
    await this.programmerService.updateProgrammer(
      this.newProgrammer.uid,
      this.newProgrammer
    );

    alert("Programador actualizado correctamente ✔");

    this.selectedUser = null;
    this.newProgrammer = {
      uid: '',
      name: '',
      specialty: '',
      description: '',
      photoURL: '',
      contactLinks: {},
      socialLinks: {}
    };

    await this.loadProgrammers();
  }

  async deleteProgrammer(uid: string) {
    if (!confirm("¿Seguro que deseas eliminar este programador?")) return;

    await this.programmerService.deleteProgrammer(uid);
    await this.userService.setRole(uid, 'user'); // volver a rol normal

    alert("Programador eliminado ✔");

    await this.loadProgrammers();
    await this.loadUsers();
  }
}
