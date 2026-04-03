import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  currentSlide = 0;

  slides = [
    {
      id: 1,
      type: 'video',
      src: 'assets/images/video-1.mp4',
      tag: 'OOPS!',
      title: 'whOOPSy<br>ile',
      desc: 'sokak ruhunu ayağına taşı.',
      link: '/shop'
    },
    {
      id: 2,
      type: 'image',
      src: 'assets/images/hero-1.jpg',
      tag: '',
      title: '',
      desc: '',
      link: '/explore'
    }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }
}