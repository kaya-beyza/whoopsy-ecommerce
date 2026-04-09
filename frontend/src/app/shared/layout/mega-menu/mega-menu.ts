import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface MenuItem { label: string; link: string; hot?: boolean; }
interface MenuGroup { title: string; items: MenuItem[]; }

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './mega-menu.html',
  styleUrl: './mega-menu.scss'
})
export class MegaMenu implements OnInit {
  @Input() categoryId!: string;
  groups: MenuGroup[] = [];

  private data: Record<string, MenuGroup[]> = {
    yeni: [
      {
        title: 'Kadın', items: [
          { label: 'Ayakkabı', link: '/yeni-gelenler/kadin-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni-gelenler/kadin-giyim' },
          { label: 'Aksesuar', link: '/yeni-gelenler/kadin-aksesuar' },
        ]
      },
      {
        title: 'Erkek', items: [
          { label: 'Ayakkabı', link: '/yeni-gelenler/erkek-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni-gelenler/erkek-giyim' },
          { label: 'Aksesuar', link: '/yeni-gelenler/erkek-aksesuar' },
        ]
      },
      {
        title: 'Çocuk', items: [
          { label: 'Ayakkabı', link: '/yeni-gelenler/cocuk-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni-gelenler/cocuk-giyim' },
        ]
      },
    ],
    kadin: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/kadin/ayakkabi', hot: true },
          { label: 'Spor Ayakkabı', link: '/kadin/ayakkabi/spor' },
          { label: 'Koşu', link: '/kadin/ayakkabi/kosu' },
          { label: 'Outdoor', link: '/kadin/ayakkabi/outdoor' },
          { label: 'Terlik & Sandalet', link: '/kadin/ayakkabi/terlik-sandalet' },
        ]
      },
      {
        title: 'Giyim', items: [
          { label: 'Tüm Giyim', link: '/kadin/giyim' },
          { label: 'Sweatshirt & Hoodie', link: '/kadin/giyim/sweatshirt', hot: true },
          { label: 'T-Shirt', link: '/kadin/giyim/t-shirt' },
          { label: 'Tayt & Şort', link: '/kadin/giyim/tayt-sort' },
          { label: 'Ceket & Mont', link: '/kadin/giyim/ceket-mont' },
        ]
      },
      {
        title: 'Aksesuar & Öne Çıkanlar', items: [
          { label: 'Çanta', link: '/kadin/aksesuar/canta' },
          { label: 'Şapka & Bere', link: '/kadin/aksesuar/sapka-bere' },
          { label: 'Çorap', link: '/kadin/aksesuar/corap' },
          { label: 'Çok Satanlar', link: '/kadin/one-cikanlar/cok-satanlar', hot: true },
        ]
      },
    ],
    erkek: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/erkek/ayakkabi', hot: true },
          { label: 'Spor Ayakkabı', link: '/erkek/ayakkabi/spor' },
          { label: 'Koşu', link: '/erkek/ayakkabi/kosu' },
          { label: 'Basketbol', link: '/erkek/ayakkabi/basketbol' },
          { label: 'Outdoor', link: '/erkek/ayakkabi/outdoor' },
        ]
      },
      {
        title: 'Giyim', items: [
          { label: 'Tüm Giyim', link: '/erkek/giyim' },
          { label: 'Sweatshirt & Hoodie', link: '/erkek/giyim/sweatshirt', hot: true },
          { label: 'T-Shirt', link: '/erkek/giyim/t-shirt' },
          { label: 'Eşofman', link: '/erkek/giyim/esofman' },
          { label: 'Şort & Pantolon', link: '/erkek/giyim/sort-pantolon' },
        ]
      },
      {
        title: 'Aksesuar & Öne Çıkanlar', items: [
          { label: 'Çanta', link: '/erkek/aksesuar/canta' },
          { label: 'Şapka & Bere', link: '/erkek/aksesuar/sapka-bere' },
          { label: 'Çorap', link: '/erkek/aksesuar/corap' },
          { label: 'Çok Satanlar', link: '/erkek/one-cikanlar/cok-satanlar', hot: true },
        ]
      },
    ],
    cocuk: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/cocuk/ayakkabi', hot: true },
          { label: 'Bebek (0–4 Yaş)', link: '/cocuk/ayakkabi/bebek' },
          { label: 'Çocuk (4–8 Yaş)', link: '/cocuk/ayakkabi/cocuk' },
          { label: 'Genç (8–12 Yaş)', link: '/cocuk/ayakkabi/genc' },
        ]
      },
      {
        title: 'Giyim & Aksesuar', items: [
          { label: 'T-Shirt', link: '/cocuk/giyim/t-shirt' },
          { label: 'Eşofman', link: '/cocuk/giyim/esofman' },
          { label: 'Çorap & Aksesuar', link: '/cocuk/aksesuar' },
        ]
      },
      {
        title: 'Öne Çıkanlar', items: [
          { label: 'Yeni Gelenler', link: '/cocuk/one-cikanlar/yeni-gelenler', hot: true },
          { label: 'Çok Satanlar', link: '/cocuk/one-cikanlar/cok-satanlar' },
          { label: 'Kolay Giyilen', link: '/cocuk/one-cikanlar/kolay-giyilen' },
        ]
      },
    ],
    koleksiyon: [
      {
        title: 'Klasikler', items: [
          { label: 'Tüm Koleksiyon', link: '/koleksiyonlar', hot: true },
          { label: 'Signature Serisi', link: '/koleksiyonlar/signature' },
          { label: 'Limited Edition', link: '/koleksiyonlar/limited' },
          { label: 'Kolaborasyonlar', link: '/koleksiyonlar/kolab' },
        ]
      },
      {
        title: 'Tarzına Göre', items: [
          { label: 'Siyah & Beyaz', link: '/tarz/siyah-beyaz' },
          { label: 'Renkli Modeller', link: '/tarz/renkli', hot: true },
          { label: 'Retro', link: '/tarz/retro' },
          { label: 'Minimalist', link: '/tarz/minimalist' },
        ]
      },
    ],
    indirim: [
      {
        title: 'Kategoriye Göre', items: [
          { label: 'Tüm İndirimler', link: '/indirimler', hot: true },
          { label: 'Kadın İndirim', link: '/indirimler/kadin' },
          { label: 'Erkek İndirim', link: '/indirimler/erkek' },
          { label: 'Çocuk İndirim', link: '/indirimler/cocuk' },
        ]
      },
      {
        title: 'Fırsatlar', items: [
          { label: '%20 ve Üzeri', link: '/indirimler/firsat-20', hot: true },
          { label: '%30 ve Üzeri', link: '/indirimler/firsat-30' },
          { label: 'Son Bedenler', link: '/indirimler/son-bedenler' },
        ]
      },
    ],
  };

  ngOnInit(): void {
    this.groups = this.data[this.categoryId] ?? [];
  }
}