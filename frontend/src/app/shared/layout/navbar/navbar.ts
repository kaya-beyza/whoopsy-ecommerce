import { Component, signal } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { MegaMenu }          from '../mega-menu/mega-menu';

export interface NavCategory {
  id: string;
  label: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MegaMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  activeCategory = signal<string | null>(null);

  categories: NavCategory[] = [
    { id: 'yeni',       label: 'Yeni Gelenler', highlight: true },
    { id: 'kadin',      label: 'Kadın'          },
    { id: 'erkek',      label: 'Erkek'          },
    { id: 'cocuk',      label: 'Çocuk'          },
    { id: 'koleksiyon', label: 'Koleksiyon'     },
    { id: 'sale',       label: 'İndirim',        highlight: true },
  ];

  onMouseEnter(id: string): void { this.activeCategory.set(id); }
  onMouseLeave(): void           { this.activeCategory.set(null); }
}