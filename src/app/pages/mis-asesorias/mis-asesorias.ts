import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';
import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './mis-asesorias.html',
  styleUrls: ['./mis-asesorias.scss']
})
export class MisAsesoriasComponent {

  private auth = inject(Auth);
  private asesoriaService = inject(AsesoriaService);

  asesorias: Asesoria[] = [];

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    this.asesorias = await this.asesoriaService.getAsesoriasByUser(uid);
  }
}
