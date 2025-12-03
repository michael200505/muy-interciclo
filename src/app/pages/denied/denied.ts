import { Component } from '@angular/core';
import { HeaderComponent } from "../../ui/header/header";
import { PageContainerComponent } from "../../ui/container/container";

@Component({
  selector: 'app-denied',
  standalone: true,
  templateUrl: './denied.html',
  imports: [HeaderComponent, PageContainerComponent]
})
export class DeniedComponent {}
