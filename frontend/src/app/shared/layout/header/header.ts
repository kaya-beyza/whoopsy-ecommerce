import { Component, signal, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, Navbar, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private router = inject(Router);
  
  cartCount = signal(0);
  isSearchOpen = signal(false);
  searchQuery = '';

  toggleSearch(): void {
    this.isSearchOpen.set(!this.isSearchOpen());
    if (!this.isSearchOpen()) {
        this.searchQuery = '';
    }
  }

  onSearchSubmit(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.isSearchOpen.set(false);
      this.router.navigate(['/urunler'], { queryParams: { search: query } });
      this.searchQuery = '';
    }
  }
}