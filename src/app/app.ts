import { Component, inject, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class AppComponent implements OnDestroy {
  private router = inject(Router);

  private sub = this.router.events
    .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    .subscribe((e) => {
      const url = e.urlAfterRedirects;

      const body = document.body;
      body.classList.remove('theme-admin', 'theme-programmer', 'theme-user');

      if (url.startsWith('/admin')) body.classList.add('theme-admin');
      else if (url.startsWith('/programmer')) body.classList.add('theme-programmer');
      else body.classList.add('theme-user');
    });

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
