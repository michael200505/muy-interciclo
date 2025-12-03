import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.html',
  styleUrls: ['./container.scss']
})
export class PageContainerComponent {}
