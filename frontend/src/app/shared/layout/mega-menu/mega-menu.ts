import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavCategory } from '../../../core/services/category.service';

interface MenuItem { label: string; link: string; hot?: boolean; }
interface MenuGroup { title: string; items: MenuItem[]; }

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './mega-menu.html',
  styleUrl: './mega-menu.scss'
})
export class MegaMenu implements OnInit, OnChanges {
  @Input() categoryId!: string;
  @Input() subCategories: NavCategory[] = [];
  groups: MenuGroup[] = [];

  ngOnInit(): void {
    this.refreshGroups();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subCategories']) {
      this.refreshGroups();
    }
  }

  private refreshGroups(): void {
    if (!this.subCategories || this.subCategories.length === 0) {
      this.groups = [];
      return;
    }

    // Process and display child categories in a hierarchical list
    this.groups = [
      {
        title: 'Öne Çıkan Koleksiyonlar',
        items: this.subCategories.map(cat => ({
          label: cat.label,
          link: `/urunler/kategori/${cat.id}`,
          hot: false
        }))
      }
    ];
  }
}