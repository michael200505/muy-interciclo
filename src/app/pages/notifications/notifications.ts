import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

import { NotificationService } from '../../core/notification/notification.service';
import { AppNotification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss'],
  animations: [
    trigger('pageIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('520ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class NotificationsComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private notifService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  loading = true;
  items: AppNotification[] = [];

  private waitUser() {
    return new Promise<any>((resolve) => {
      const unsub = onAuthStateChanged(this.auth, (u) => {
        resolve(u);
        if (unsub) unsub();
      });
    });
  }

  async ngOnInit(): Promise<void> {
    const user = await this.waitUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    await this.load(user.uid);
  }

  private async load(uid: string) {
    try {
      this.loading = true;
      this.cdr.detectChanges();

      const data = await this.notifService.getByUser(uid);

      // opcional: orden newest first
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.zone.run(() => {
        this.items = [...data];
        this.loading = false;
      });
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error cargando notificaciones:', e);
      this.zone.run(() => {
        this.items = [];
        this.loading = false;
      });
      this.cdr.detectChanges();
    }
  }

  async markRead(n: AppNotification) {
    if (!n.id || n.read) return;
    await this.notifService.markRead(n.id);
    n.read = true;
    this.cdr.detectChanges();
  }

  async markAllRead() {
    const user = this.auth.currentUser;
    if (!user) return;
    await this.notifService.markAllRead(user.uid);
    this.items = this.items.map(x => ({ ...x, read: true }));
    this.cdr.detectChanges();
  }

  simulateEmail(n: AppNotification) {
    console.log('📧 SIMULACIÓN EMAIL:', {
      toUid: n.toUid,
      title: n.title,
      message: n.message,
      asesoriaId: n.asesoriaId,
      date: n.date,
      hour: n.hour,
    });
    alert('📧 Simulación: "correo enviado" (revisa la consola).');
  }

  simulateWhatsapp(n: AppNotification) {
    console.log('📲 SIMULACIÓN WHATSAPP:', {
      toUid: n.toUid,
      title: n.title,
      message: n.message,
      asesoriaId: n.asesoriaId,
      date: n.date,
      hour: n.hour,
    });
    alert('📲 Simulación: "WhatsApp enviado" (revisa la consola).');
  }

  trackById(_: number, n: AppNotification) {
    return n.id;
  }

  unreadCount() {
    return this.items.reduce((acc, x) => acc + (x.read ? 0 : 1), 0);
  }
}
