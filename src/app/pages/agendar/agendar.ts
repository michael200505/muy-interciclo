import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { NotificationService } from '../../core/notification/notification.service';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.scss']
})
export class AgendarAsesoriaComponent implements OnInit {
  private asesoriaService = inject(AsesoriaService);
  private notifService = inject(NotificationService);

  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private router = inject(Router);

  programmerId = '';

  form = {
    name: '',
    email: '',
    date: '',
    hour: '',
    comment: ''
  };

  private async waitUser() {
    return await new Promise<any>((resolve) => {
      onAuthStateChanged(this.auth, (u) => resolve(u));
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
    if (current) {
      this.form.name = current.displayName || '';
      this.form.email = current.email || '';
    }
  }

  async enviarSolicitud(): Promise<void> {
    const user = await this.waitUser();
    if (!user || !this.programmerId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.form.date || !this.form.hour) {
      alert('Selecciona fecha y hora');
      return;
    }

    await this.asesoriaService.requestAsesoria({
      programmerId: this.programmerId,
      userId: user.uid,
      name: this.form.name,
      email: this.form.email,
      date: this.form.date,
      hour: this.form.hour,
      comment: this.form.comment
    });

    // ✅ Notificación al programador (simulada)
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
      hour: this.form.hour
    });

    alert('Solicitud enviada correctamente');
    this.router.navigate(['/mis-asesorias']);
  }
}
