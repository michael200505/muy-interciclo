import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user/user.service';
import { AppUser, UserRole } from '../../core/models/user.model';
import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminPanelComponent implements OnInit {

  private userService = inject(UserService);

  programmers: AppUser[] = [];
  loading = false;

  async ngOnInit() {
    await this.loadProgrammers();
  }

  async loadProgrammers() {
    this.loading = true;
    this.programmers = await this.userService.getProgrammers();
    this.loading = false;
  }

  async changeRole(user: AppUser, role: UserRole) {
    await this.userService.updateRole(user.uid, role);
    user.role = role;
  }
}
