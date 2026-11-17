import { Component, DestroyRef, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { IconComponent } from '../shared/icon.component';
import { SPECIALIST_REQUEST_URL } from '../core/contact';
import { BUSINESS_IDENTITY, FOOTER_DOCUMENTS } from '../core/business-identity';
import { TrackWhatsAppDirective } from '../shared/track-whatsapp.directive';

@Component({
  selector: 'app-layout', standalone: true,
  imports: [RouterOutlet, RouterLink, IconComponent, TrackWhatsAppDirective],
  templateUrl: './layout.component.html', styleUrl: './layout.component.css',
})
export class LayoutComponent {
  readonly menuOpen = signal(false);
  readonly isRegistration = signal(false);
  readonly isSpecialists = signal(false);
  readonly specialistRequestUrl = SPECIALIST_REQUEST_URL;
  readonly businessIdentity = BUSINESS_IDENTITY;
  readonly footerDocuments = FOOTER_DOCUMENTS;
  readonly socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/miloficios.pe', icon: 'instagram-white.svg' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@miloficios.pe', icon: 'tiktok-white.webp' },
    { name: 'Facebook', url: 'https://www.facebook.com/miloficios.pe', icon: 'facebook-white.webp' },
  ] as const;
  readonly year = new Date().getFullYear();
  @ViewChild('menuToggle') private menuToggle?: ElementRef<HTMLButtonElement>;

  constructor() {
    inject(Router).events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef))).subscribe(event => {
      this.menuOpen.set(false);
      this.isRegistration.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/especialistas/registro');
      this.isSpecialists.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/especialistas');
    });
  }

  @HostListener('document:keydown.escape') closeMenu(): void {
    if (this.menuOpen()) { this.menuOpen.set(false); this.menuToggle?.nativeElement.focus(); }
  }
}
