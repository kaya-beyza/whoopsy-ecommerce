import { Component, signal, inject, effect, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { SearchService } from '../../../core/services/search.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, Navbar, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private router = inject(Router);
  public searchService = inject(SearchService);
  private cartService = inject(CartService);
  public authService = inject(AuthService);

  cartCount = this.cartService.cartCount;
  searchQuery = '';

  constructor() {
    // currentUser değişince (login/logout) sepet sayısını backend'den tekrar çek.
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.id) {
        this.cartService.refreshCartCount();
      } else {
        this.cartService.cartCount.set(0);
      }
    });
  }

  ngOnInit(): void {
    // Sayfa yenilemesinde de hemen senkronize ol.
    if (this.authService.currentUser()?.id) {
      this.cartService.refreshCartCount();
    }
  }

  toggleSearch(): void {
    this.searchService.toggle();
    if (!this.searchService.isOpen()) {
        this.searchQuery = '';
    }
  }

  onSearchSubmit(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.searchService.close();
      this.router.navigate(['/urunler'], { queryParams: { search: query } });
      this.searchQuery = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}