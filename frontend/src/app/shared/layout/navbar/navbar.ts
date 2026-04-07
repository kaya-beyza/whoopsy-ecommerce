import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MegaMenu } from '../mega-menu/mega-menu';

export interface NavCategory {
  id: string;
  label: string;
  highlight: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MegaMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  activeCategory = signal<string | null>(null);

  categories: NavCategory[] = [
    { id: 'yeni', label: 'Yeni Gelenler', highlight: false },
    { id: 'kadin', label: 'Kadın', highlight: false },
    { id: 'erkek', label: 'Erkek', highlight: false },
    { id: 'cocuk', label: 'Çocuk', highlight: false },
    { id: 'koleksiyon', label: 'Koleksiyon', highlight: false },
    { id: 'indirim', label: 'İndirim', highlight: true },
  ];

  onEnter(id: string): void { this.activeCategory.set(id); }
  onLeave(): void { this.activeCategory.set(null); }
}