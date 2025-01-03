import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private themeSubject = new BehaviorSubject<Theme>(this.getCurrentTheme());

  constructor() {
    // Listen for changes in system theme
    this.mediaQuery.addEventListener('change', e => {
      if (this.getStoredTheme() === null) {
        // Only update if user hasn't manually set a theme
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Initialize theme
    this.setTheme(this.getCurrentTheme());
  }

  // Get current theme as Observable
  theme$: Observable<Theme> = this.themeSubject.asObservable();

  // Get current theme value
  getCurrentTheme(): Theme {
    return this.getStoredTheme() ?? (this.mediaQuery.matches ? 'dark' : 'light');
  }

  // Set theme
  setTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    this.themeSubject.next(theme);
  }

  // Toggle theme
  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Clear stored theme preference
  resetToSystemTheme(): void {
    localStorage.removeItem(this.THEME_KEY);
    this.setTheme(this.mediaQuery.matches ? 'dark' : 'light');
  }

  // Get theme from localStorage
  private getStoredTheme(): Theme | null {
    const theme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    return theme && ['light', 'dark'].includes(theme) ? theme : null;
  }
}
