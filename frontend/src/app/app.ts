import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from './shared/layout/header/header';
import { NotificationComponent } from './shared/components/notification/notification';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Angular Material sidenav-content is the actual scroll container
      const content = document.querySelector('mat-sidenav-content');
      if (content) {
        content.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }
}