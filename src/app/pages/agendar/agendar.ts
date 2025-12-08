import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';

import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { NotificationService } from '../../core/notification/notification.service';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.scss'],
  animations: [
    trigger('pageIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('520ms cubic-bezier(.2,.8,.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class AgendarAsesoriaComponent implements OnInit {
  private asesoriaService = inject(AsesoriaService);
  private notifService = inject(NotificationService);

  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private router = inject(Router);

  programmerId = '';

  submitting = false;

  form = {
    name: '',
    email: '',
    date: '',
    hour: '',
    comment: '',
  };

  private waitUser() {
    return new Promise<any>((resolve) => {
      const unsub = onAuthStateChanged(this.auth, (u) => {
        resolve(u);
        if (unsub) unsub();
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.programmerId = this.route.snapshot.paramMap.get('uid') || '';

    if (!this.programmerId) {
      alert('Programador inválido');
      this.router.navigate(['/home']);
      return;
    }

    const current = await this.waitUser();
    if (!current) {
      this.router.navigate(['/login']);
      return;
    }

    this.form.name = current.displayName || '';
    this.form.email = current.email || '';
  }

  async enviarSolicitud(): Promise<void> {
    if (this.submitting) return;

    const user = await this.waitUser();
    if (!user || !this.programmerId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.form.date || !this.form.hour) {
      alert('Selecciona fecha y hora');
      return;
    }

    try {
      this.submitting = true;

      await this.asesoriaService.requestAsesoria({
        programmerId: this.programmerId,
        userId: user.uid,
        name: this.form.name,
        email: this.form.email,
        date: this.form.date,
        hour: this.form.hour,
        comment: this.form.comment,
      });

      // ✅ Notificación al programador
      await this.notifService.send({
        toUid: this.programmerId,
        roleTarget: 'programmer',
        title: 'Nueva solicitud de asesoría 📩',
        message: `${this.form.name} solicitó asesoría para ${this.form.date} a las ${this.form.hour}.`,
        read: false,
        createdAt: Date.now(),
        programmerId: this.programmerId,
        userId: user.uid,
        date: this.form.date,
        hour: this.form.hour,
      });

      alert('Solicitud enviada correctamente');
      this.router.navigate(['/mis-asesorias']);
    } catch (e) {
      console.error('Error enviando solicitud:', e);
      alert('Ocurrió un error enviando la solicitud.');
    } finally {
      this.submitting = false;
    }
  }
}
