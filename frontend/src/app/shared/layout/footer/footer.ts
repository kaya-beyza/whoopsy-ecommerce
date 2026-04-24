import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private searchService = inject(SearchService);

  openSearch(event: Event): void {
    event.preventDefault();
    this.searchService.open();
  }
}
