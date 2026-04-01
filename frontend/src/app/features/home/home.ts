import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  currentSlide = 0;
  totalSlides = 3;
  slideInterval: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  // Sadece ileri gitme fonksiyonu (Sonsuz Döngü)
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // 3 bittiyse 1'e dön
    }
    this.resetTimer();
  }

  // Sadece geri gitme fonksiyonu
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.totalSlides - 1; // 1'deyken geri basınca 3'e git
    }
    this.resetTimer();
  }

  // Noktalar için
  setSlide(index: number) {
    this.currentSlide = index;
    this.resetTimer();
  }

  // --- ZAMANLAYICI YÖNETİMİ ---
  startTimer() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopTimer() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resetTimer() {
    this.stopTimer();
    this.startTimer();
  }
}