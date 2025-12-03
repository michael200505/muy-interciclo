import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsesoriaService } from '../../core/asesoria/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from "../../ui/header/header";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent],
  templateUrl: './mis-asesorias.html'
})
export class MisAsesoriasComponent {

  private asesoriaService = inject(AsesoriaService);
  private auth = inject(Auth);

  asesorias: Asesoria[] = [];
window: any;

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para ver tus asesorías.');
      return;
    }

    this.asesorias = await this.asesoriaService.getAsesoriasByRequester(user.uid);
  }
}
