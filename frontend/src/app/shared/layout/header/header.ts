import { Component, signal } from '@angular/core';
import { RouterModule }      from '@angular/router';
import { Navbar }            from '../navbar/navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  cartCount = signal(3);

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    console.log('Arama:', query);
  }
}