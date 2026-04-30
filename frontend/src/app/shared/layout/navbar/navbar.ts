import { Component, signal, OnInit, computed } from '@angular/core';
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
  categories = signal<NavCategory[]>([]);
  private closeTimer: any;

  // Computed signals for specialized sorting and optimized re-renders
  mainCategories = computed(() => {
    const desiredOrder = ['Ayakkabı', 'Giyim', 'Aksesuar', 'Diğer'];
    
    return this.categories()
      .filter(c => !c.parentId)
      .sort((a, b) => {
        const indexA = desiredOrder.findIndex(o => o.toLowerCase() === a.label.toLowerCase());
        const indexB = desiredOrder.findIndex(o => o.toLowerCase() === b.label.toLowerCase());
        
        const posA = indexA === -1 ? 99 : indexA;
        const posB = indexB === -1 ? 99 : indexB;
        
        return posA - posB;
      });
  });

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  getSubCategories(parentId: string): NavCategory[] {
    return this.categories().filter(c => c.parentId === parentId);
  }

  onEnter(id: string): void { 
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    // Ensure signal updates occur outside the change detection cycle to avoid NG0100
    Promise.resolve().then(() => {
        this.activeCategory.set(id); 
    });
  }

  onLeave(): void { 
    if (this.closeTimer) clearTimeout(this.closeTimer);
    
    this.closeTimer = setTimeout(() => {
      Promise.resolve().then(() => {
          this.activeCategory.set(null);
      });
    }, 150); // Menu transition delay
  }
}