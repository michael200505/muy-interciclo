import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar.html'
})
export class AgendarAsesoriaComponent {

  private asesoriaService = inject(AsesoriaService);
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private router = inject(Router);

  programmerId: string = '';
  form = {
    name: '',
    email: '',
    date: '',
    time: '',
    comment: ''
  };

  ngOnInit() {
    this.programmerId = this.route.snapshot.params['id'];

    const current = this.auth.currentUser;

    if (current) {
      this.form.name = current.displayName || '';
      this.form.email = current.email || '';
    }
  }

  async send() {
    await this.asesoriaService.requestAsesoria({
      programmerId: this.programmerId,
      requesterId: this.auth.currentUser?.uid,
      requesterName: this.form.name,
      requesterEmail: this.form.email,
      date: this.form.date,
      time: this.form.time,
      comment: this.form.comment,
      status: 'pending',
      createdAt: Date.now()
    });

    alert("Solicitud enviada. El programador recibirá una notificación en su panel y te responderá por este medio (simulado) o por correo/WhatsApp.");
    this.router.navigate(['/']);
  }
}
