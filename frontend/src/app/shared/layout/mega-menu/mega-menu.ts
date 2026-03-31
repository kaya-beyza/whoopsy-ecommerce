import { Component, Input, OnInit } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { RouterModule }             from '@angular/router';

interface SubCategory {
  label: string;
  link:  string;
  hot?:  boolean;
}

interface MenuGroup {
  title: string;
  items: SubCategory[];
}

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mega-menu.html',
  styleUrl:    './mega-menu.scss'
})
export class MegaMenu implements OnInit {
  @Input() categoryId!: string;
  groups: MenuGroup[] = [];

  private menuData: Record<string, MenuGroup[]> = {

    yeni: [
      { title: 'Kadın', items: [
        { label: 'Ayakkabı',  link: '/yeni/kadin-ayakkabi',  hot: true },
        { label: 'Giyim',     link: '/yeni/kadin-giyim' },
        { label: 'Aksesuar',  link: '/yeni/kadin-aksesuar' },
      ]},
      { title: 'Erkek', items: [
        { label: 'Ayakkabı',  link: '/yeni/erkek-ayakkabi',  hot: true },
        { label: 'Giyim',     link: '/yeni/erkek-giyim' },
        { label: 'Aksesuar',  link: '/yeni/erkek-aksesuar' },
      ]},
      { title: 'Çocuk', items: [
        { label: 'Ayakkabı',  link: '/yeni/cocuk-ayakkabi',  hot: true },
        { label: 'Giyim',     link: '/yeni/cocuk-giyim' },
      ]},
    ],

    kadin: [
      { title: 'Ayakkabı', items: [
        { label: 'Tüm Ayakkabılar',    link: '/kadin/ayakkabi',           hot: true },
        { label: 'High Top',           link: '/kadin/high-top' },
        { label: 'Low Top',            link: '/kadin/low-top' },
        { label: 'Platform',           link: '/kadin/platform' },
        { label: 'Terlik & Sandalet',  link: '/kadin/terlik' },
      ]},
      { title: 'Giyim', items: [
        { label: 'Tüm Giyim',          link: '/kadin/giyim' },
        { label: 'Sweatshirt & Hoodie', link: '/kadin/sweatshirt',        hot: true },
        { label: 'T-Shirt',            link: '/kadin/tisort' },
        { label: 'Eşofman',            link: '/kadin/esofman' },
        { label: 'Ceket & Mont',       link: '/kadin/ceket' },
        { label: 'Pantolon & Etek',    link: '/kadin/pantolon' },
      ]},
      { title: 'Aksesuar & Öne Çıkanlar', items: [
        { label: 'Çanta',              link: '/kadin/canta' },
        { label: 'Şapka & Bere',       link: '/kadin/sapka' },
        { label: 'Çorap & Bağcık',     link: '/kadin/corap' },
        { label: 'Çok Satanlar',       link: '/kadin/best-sellers',       hot: true },
        { label: 'Koleksiyon',         link: '/kadin/koleksiyon' },
      ]},
    ],

    erkek: [
      { title: 'Ayakkabı', items: [
        { label: 'Tüm Ayakkabılar',    link: '/erkek/ayakkabi',           hot: true },
        { label: 'High Top',           link: '/erkek/high-top' },
        { label: 'Mid Top',            link: '/erkek/mid-top' },
        { label: 'Low Top',            link: '/erkek/low-top' },
        { label: 'Terlik & Sandalet',  link: '/erkek/terlik' },
      ]},
      { title: 'Giyim', items: [
        { label: 'Tüm Giyim',          link: '/erkek/giyim' },
        { label: 'Sweatshirt & Hoodie', link: '/erkek/sweatshirt',        hot: true },
        { label: 'T-Shirt',            link: '/erkek/tisort' },
        { label: 'Eşofman',            link: '/erkek/esofman' },
        { label: 'Ceket & Mont',       link: '/erkek/ceket' },
        { label: 'Şort & Pantolon',    link: '/erkek/sort' },
      ]},
      { title: 'Aksesuar & Öne Çıkanlar', items: [
        { label: 'Çanta & Sırt Çantası', link: '/erkek/canta' },
        { label: 'Şapka & Bere',        link: '/erkek/sapka' },
        { label: 'Çorap & Bağcık',      link: '/erkek/corap' },
        { label: 'Çok Satanlar',        link: '/erkek/best-sellers',      hot: true },
        { label: 'Koleksiyon',          link: '/erkek/koleksiyon' },
      ]},
    ],

    cocuk: [
      { title: 'Ayakkabı', items: [
        { label: 'Tüm Ayakkabılar',      link: '/cocuk/ayakkabi',         hot: true },
        { label: 'Bebek & Toddler (0-4)', link: '/cocuk/bebek' },
        { label: 'Çocuk (4-8 Yaş)',      link: '/cocuk/cocuk' },
        { label: 'Genç (8-12 Yaş)',      link: '/cocuk/genc' },
      ]},
      { title: 'Giyim & Aksesuar', items: [
        { label: 'Tüm Giyim',            link: '/cocuk/giyim' },
        { label: 'T-Shirt',              link: '/cocuk/tisort' },
        { label: 'Eşofman',              link: '/cocuk/esofman' },
        { label: 'Çorap & Aksesuar',     link: '/cocuk/aksesuar' },
      ]},
      { title: 'Öne Çıkanlar', items: [
        { label: 'Yeni Gelenler',         link: '/cocuk/yeni',            hot: true },
        { label: 'Çok Satanlar',          link: '/cocuk/best-sellers' },
        { label: 'Kolay Giyilen',         link: '/cocuk/kolay-giyilen' },
      ]},
    ],

    koleksiyon: [
      { title: 'Klasik Modeller', items: [
        { label: 'Chuck Taylor All Star', link: '/koleksiyon/chuck-taylor', hot: true },
        { label: 'Chuck 70',              link: '/koleksiyon/chuck-70' },
        { label: 'Run Star',              link: '/koleksiyon/run-star' },
        { label: 'One Star',              link: '/koleksiyon/one-star' },
      ]},
      { title: 'Özel Koleksiyonlar', items: [
        { label: 'Tüm Koleksiyonlar',     link: '/koleksiyon/tumu',        hot: true },
        { label: 'Limited Edition',       link: '/koleksiyon/limited' },
        { label: 'Kolaborasyonlar',       link: '/koleksiyon/kolaborasyon' },
      ]},
      { title: 'Tarzına Göre', items: [
        { label: 'Beyaz Ayakkabılar',     link: '/koleksiyon/beyaz' },
        { label: 'Siyah Ayakkabılar',     link: '/koleksiyon/siyah' },
        { label: 'Renkli Modeller',       link: '/koleksiyon/renkli',      hot: true },
        { label: 'Platformlar',           link: '/koleksiyon/platform' },
      ]},
    ],

    sale: [
      { title: 'İndirimli Ürünler', items: [
        { label: 'Tüm İndirimler',        link: '/indirim/tumu',           hot: true },
        { label: 'Kadın İndirim',         link: '/indirim/kadin' },
        { label: 'Erkek İndirim',         link: '/indirim/erkek' },
        { label: 'Çocuk İndirim',         link: '/indirim/cocuk' },
      ]},
      { title: 'Fırsatlar', items: [
        { label: '%20 ve Üzeri',           link: '/indirim/yirmi',          hot: true },
        { label: '%30 ve Üzeri',           link: '/indirim/otuz' },
        { label: 'Son Bedenler',           link: '/indirim/son-beden' },
      ]},
    ],
  };

  ngOnInit(): void {
    this.groups = this.menuData[this.categoryId] ?? [];
  }
}