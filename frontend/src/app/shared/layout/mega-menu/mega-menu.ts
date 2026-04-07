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
          { label: 'Ayakkabı', link: '/yeni/kadin-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni/kadin-giyim' },
          { label: 'Aksesuar', link: '/yeni/kadin-aksesuar' },
        ]
      },
      {
        title: 'Erkek', items: [
          { label: 'Ayakkabı', link: '/yeni/erkek-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni/erkek-giyim' },
          { label: 'Aksesuar', link: '/yeni/erkek-aksesuar' },
        ]
      },
      {
        title: 'Çocuk', items: [
          { label: 'Ayakkabı', link: '/yeni/cocuk-ayakkabi', hot: true },
          { label: 'Giyim', link: '/yeni/cocuk-giyim' },
        ]
      },
    ],
    kadin: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/kadin/ayakkabi', hot: true },
          { label: 'Spor Ayakkabı', link: '/kadin/spor' },
          { label: 'Koşu', link: '/kadin/kosu' },
          { label: 'Outdoor', link: '/kadin/outdoor' },
          { label: 'Terlik & Sandalet', link: '/kadin/terlik' },
        ]
      },
      {
        title: 'Giyim', items: [
          { label: 'Tüm Giyim', link: '/kadin/giyim' },
          { label: 'Sweatshirt & Hoodie', link: '/kadin/sweatshirt', hot: true },
          { label: 'T-Shirt', link: '/kadin/tisort' },
          { label: 'Tayt & Şort', link: '/kadin/tayt' },
          { label: 'Ceket & Mont', link: '/kadin/ceket' },
        ]
      },
      {
        title: 'Aksesuar & Öne Çıkanlar', items: [
          { label: 'Çanta', link: '/kadin/canta' },
          { label: 'Şapka & Bere', link: '/kadin/sapka' },
          { label: 'Çorap', link: '/kadin/corap' },
          { label: 'Çok Satanlar', link: '/kadin/best', hot: true },
        ]
      },
    ],
    erkek: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/erkek/ayakkabi', hot: true },
          { label: 'Spor Ayakkabı', link: '/erkek/spor' },
          { label: 'Koşu', link: '/erkek/kosu' },
          { label: 'Basketbol', link: '/erkek/basketbol' },
          { label: 'Outdoor', link: '/erkek/outdoor' },
        ]
      },
      {
        title: 'Giyim', items: [
          { label: 'Tüm Giyim', link: '/erkek/giyim' },
          { label: 'Sweatshirt & Hoodie', link: '/erkek/sweatshirt', hot: true },
          { label: 'T-Shirt', link: '/erkek/tisort' },
          { label: 'Eşofman', link: '/erkek/esofman' },
          { label: 'Şort & Pantolon', link: '/erkek/sort' },
        ]
      },
      {
        title: 'Aksesuar & Öne Çıkanlar', items: [
          { label: 'Çanta', link: '/erkek/canta' },
          { label: 'Şapka & Bere', link: '/erkek/sapka' },
          { label: 'Çorap', link: '/erkek/corap' },
          { label: 'Çok Satanlar', link: '/erkek/best', hot: true },
        ]
      },
    ],
    cocuk: [
      {
        title: 'Ayakkabı', items: [
          { label: 'Tüm Ayakkabılar', link: '/cocuk/ayakkabi', hot: true },
          { label: 'Bebek (0–4 Yaş)', link: '/cocuk/bebek' },
          { label: 'Çocuk (4–8 Yaş)', link: '/cocuk/cocuk' },
          { label: 'Genç (8–12 Yaş)', link: '/cocuk/genc' },
        ]
      },
      {
        title: 'Giyim & Aksesuar', items: [
          { label: 'T-Shirt', link: '/cocuk/tisort' },
          { label: 'Eşofman', link: '/cocuk/esofman' },
          { label: 'Çorap & Aksesuar', link: '/cocuk/aksesuar' },
        ]
      },
      {
        title: 'Öne Çıkanlar', items: [
          { label: 'Yeni Gelenler', link: '/cocuk/yeni', hot: true },
          { label: 'Çok Satanlar', link: '/cocuk/best' },
          { label: 'Kolay Giyilen', link: '/cocuk/kolay' },
        ]
      },
    ],
    koleksiyon: [
      {
        title: 'Klasikler', items: [
          { label: 'Tüm Koleksiyon', link: '/koleksiyon/tumu', hot: true },
          { label: 'Signature Serisi', link: '/koleksiyon/signature' },
          { label: 'Limited Edition', link: '/koleksiyon/limited' },
          { label: 'Kolaborasyonlar', link: '/koleksiyon/kolaborasyon' },
        ]
      },
      {
        title: 'Tarzına Göre', items: [
          { label: 'Siyah & Beyaz', link: '/koleksiyon/siyah-beyaz' },
          { label: 'Renkli Modeller', link: '/koleksiyon/renkli', hot: true },
          { label: 'Retro', link: '/koleksiyon/retro' },
          { label: 'Minimalist', link: '/koleksiyon/minimalist' },
        ]
      },
    ],
    indirim: [
      {
        title: 'Kategoriye Göre', items: [
          { label: 'Tüm İndirimler', link: '/indirim/tumu', hot: true },
          { label: 'Kadın İndirim', link: '/indirim/kadin' },
          { label: 'Erkek İndirim', link: '/indirim/erkek' },
          { label: 'Çocuk İndirim', link: '/indirim/cocuk' },
        ]
      },
      {
        title: 'Fırsatlar', items: [
          { label: '%20 ve Üzeri', link: '/indirim/yirmi', hot: true },
          { label: '%30 ve Üzeri', link: '/indirim/otuz' },
          { label: 'Son Bedenler', link: '/indirim/son-beden' },
        ]
      },
    ],
  };

  ngOnInit(): void {
    this.groups = this.data[this.categoryId] ?? [];
  }
}