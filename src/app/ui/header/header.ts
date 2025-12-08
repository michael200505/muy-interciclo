import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

import { NotificationService } from '../../core/notification/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private router = inject(Router);
  private notifService = inject(NotificationService);

  unreadCount = 0;
  private timer: any = null;
  private currentUser: User | null = null;

  ngOnInit(): void {
    // Espera usuario y luego refresca contador (poll simple)
    onAuthStateChanged(this.auth, async (u) => {
      this.currentUser = u;

      if (!u) {
        this.unreadCount = 0;
        if (this.timer) clearInterval(this.timer);
        return;
      }

      await this.refreshUnread();

      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => this.refreshUnread(), 4000); // cada 4s
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async refreshUnread() {
    if (!this.currentUser) return;
    try {
      this.unreadCount = await this.notifService.countUnread(this.currentUser.uid);
    } catch (e) {
      console.error('Error contando notificaciones:', e);
      this.unreadCount = 0;
    }
  }

  goNotifications() {
    this.router.navigate(['/notifications']);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
