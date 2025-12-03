import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-admin.html',
  styleUrls: ['./sidebar-admin.scss']
})
export class AdminSidebarComponent {}
