import { Component, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MegaMenu } from '../mega-menu/mega-menu';
import { CategoryService, NavCategory } from '../../../core/services/category.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MegaMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  activeCategory = signal<string | null>(null);
  categories: NavCategory[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  onEnter(id: string): void { this.activeCategory.set(id); }
  onLeave(): void { this.activeCategory.set(null); }
}