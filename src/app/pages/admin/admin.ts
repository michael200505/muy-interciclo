 import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../core/user/user.service';
import { ProgrammerService } from '../../core/programmer/programmer.service';
import { AppUser } from '../../core/models/user.model';
import { ProgrammerProfile } from '../../core/models/programmer.model';
import { HeaderComponent } from "../../ui/header/header";
import { AdminSidebarComponent } from "../../ui/sidebar-admin/sidebar-admin";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, AdminSidebarComponent, PageContainerComponent], // ✅ <-- agregar FormsModule aquí
  templateUrl: './admin.html'
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
    const response = await fetch('https://firestore.googleapis.com/v1/projects/muy-interciclo/databases/(default)/documents/users');
    const json = await response.json();

    this.users = json.documents?.map((doc: any) => ({
      uid: doc.fields.uid.stringValue,
      email: doc.fields.email.stringValue,
      displayName: doc.fields.displayName.stringValue,
      photoURL: doc.fields.photoURL.stringValue,
      role: doc.fields.role.stringValue
    })) || [];
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

  async makeProgrammer() {
    if (!this.selectedUser) return;

    await this.userService.setRole(this.selectedUser.uid, 'programmer');
    await this.programmerService.saveProgrammer(this.newProgrammer);

    alert("Programador creado exitosamente");

    await this.loadUsers();
    await this.loadProgrammers();

    this.selectedUser = null;
  }

  async makeAdmin(user: AppUser) {
    await this.userService.setRole(user.uid, 'admin');
    alert("Rol asignado correctamente");
    await this.loadUsers();
  }
}
