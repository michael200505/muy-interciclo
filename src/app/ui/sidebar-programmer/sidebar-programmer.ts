import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'programmer-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar-programmer.html',
  styleUrls: ['./sidebar-programmer.scss']
})
export class ProgrammerSidebarComponent { }
