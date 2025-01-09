import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentTheme$;
  isMenuOpen = false;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit() {
    // Subscribe to theme changes to update icons
    this.currentTheme$.subscribe(theme => {
      const darkIcon = document.querySelector('.theme-icon-dark');
      const lightIcon = document.querySelector('.theme-icon-light');
      
      if (theme === 'dark') {
        darkIcon?.classList.remove('d-none');
        lightIcon?.classList.add('d-none');
      } else {
        darkIcon?.classList.add('d-none');
        lightIcon?.classList.remove('d-none');
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
