import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from "../../ui/header/header";
import { PageContainerComponent } from "../../ui/container/container";
import { Asesoria } from '../../core/models/asesoria.model';


@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, PageContainerComponent],
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

 async enviarSolicitud() {
  const user = this.auth.currentUser;
  if (!user || !this.programmer) return;

  await this.asesoriaService.requestAsesoria({
    programmerId: this.programmer.uid,
    userId: user.uid,
    userName: user.displayName ?? user.email ?? '',
    date: this.form.date,
    hour: this.form.hour,
    comment: this.form.comment
  });

  alert('Solicitud enviada correctamente');
}
}
