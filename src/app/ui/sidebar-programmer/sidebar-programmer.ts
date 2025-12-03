import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'programmer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-programmer.html',
  styleUrls: ['./sidebar-programmer.scss']
})
export class ProgrammerSidebarComponent {}
