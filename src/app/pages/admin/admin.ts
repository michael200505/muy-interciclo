import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user/user.service';
import { AppUser, UserRole } from '../../core/models/user.model';
import { HeaderComponent} from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';



@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminPanelComponent implements OnInit {

  private userService = inject(UserService);

  allUsers: AppUser[] = [];
  loading = false;

  async ngOnInit() {
    await this.loadUsers();
  }

 async loadUsers() {
  this.loading = true;

  try {
    this.allUsers = await this.userService.getAllUsers();
    console.log("Usuarios cargados:", this.allUsers);
  } catch (e) {
    console.error("ERROR obteniendo usuarios:", e);
  }

  this.loading = false;
}

  async changeRole(user: AppUser, role: UserRole) {
    await this.userService.updateRole(user.uid, role);
    user.role = role; // reflejarlo en pantalla
  }
}
