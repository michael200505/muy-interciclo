import { Injectable } from '@angular/core';

export type AppTheme = 'theme-user' | 'theme-programmer' | 'theme-admin' | 'theme-public';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themes: AppTheme[] = ['theme-user', 'theme-programmer', 'theme-admin', 'theme-public'];

  setTheme(theme: AppTheme) {
    const body = document.body;
    this.themes.forEach(t => body.classList.remove(t));
    body.classList.add(theme);
  }
}
