import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoryService } from '../../services/category.service';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [Button, CategoryFormComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  showForm = false;
  selectedCategory?: Category;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  
  ngOnInit(): void {
    this.loadCategories();
  }

  
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }


  toggleCreate() {
    this.selectedCategory = undefined;
    this.showForm = true;
  }

  
  edit(category: Category) {
    this.selectedCategory = category;
    this.showForm = true;
  }

 
  closeForm() {
    this.showForm = false;
  }


  delete(id: string) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories(); // refresh
      },
      error: (err) => {
        console.error('Delete failed', err);
      }
    });
  }

  //  SAVE (CREATE + UPDATE API)
  onSave(data: any) {

    // UPDATE
    if (data.id) {
      this.categoryService.updateCategory(data.id, data).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } 
    // CREATE
    else {
      this.categoryService.createCategory(data).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          console.error('Create failed', err);
        }
      });
    }

    this.showForm = false;
  }
}