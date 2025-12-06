import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Asesoria } from '../../core/models/asesoria.model';
import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-programmer-panel',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './programmer.html',
  styleUrls: ['./programmer.scss']
})
export class ProgrammerPanelComponent {

  private asesoriaService = inject(AsesoriaService);
  private auth = inject(Auth);
  private router = inject(Router);

  asesorias: Asesoria[] = [];

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return this.router.navigate(['/login']);

    this.asesorias = await this.asesoriaService.getAsesoriasByRequest(user.uid);
  }

  // APROBAR ASESORÍA
  async approve(a: Asesoria) {
    if (!a.id) return;

    await this.asesoriaService.updateStatus(
      a.id,
      'approved',
      'Tu asesoría ha sido aprobada.'
    );

    a.status = 'approved';
    a.response = 'Tu asesoría ha sido aprobada.';
  }

  // RECHAZAR ASESORÍA
  async reject(a: Asesoria) {
    if (!a.id) return;

    await this.asesoriaService.updateStatus(
      a.id,
      'rejected',
      'Lo sentimos, tu asesoría ha sido rechazada.'
    );

    a.status = 'rejected';
    a.response = 'Lo sentimos, tu asesoría ha sido rechazada.';
  }
}
