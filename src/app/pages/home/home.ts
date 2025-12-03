import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammerService } from '../../core/programmer/programmer.service';
import { ProgrammerProfile } from '../../core/models/programmer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html'
})
export class PublicHomeComponent {

  private programmerService = inject(ProgrammerService);
  private router = inject(Router);

  programmers: ProgrammerProfile[] = [];

  async ngOnInit() {
    this.programmers = await this.programmerService.getAllProgrammers();
  }

  openPortfolio(uid: string) {
    this.router.navigate(['/portfolio', uid]);
  }
}
