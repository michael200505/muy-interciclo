import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../../core/user/user.service';
import { AppUser } from '../../core/models/user.model';

import { HeaderComponent } from '../../ui/header/header';
import { PageContainerComponent } from '../../ui/container/container';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,           // ✔ para *ngFor
    HeaderComponent,        // ✔ para <app-header>
    PageContainerComponent  // ✔ para <page-container> o <app-page-container>
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  private router = inject(Router);
  private userService = inject(UserService);

  programmers: AppUser[] = [];

  async ngOnInit() {
    // cargamos todos los programadores
    this.programmers = await this.userService.getProgrammers();
  }

  openPortfolio(uid: string) {
    this.router.navigate(['/portafolio', uid]);
  }
}
