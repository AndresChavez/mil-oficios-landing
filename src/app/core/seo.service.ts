import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      let route = this.router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;
      const description: string = route.data['description'] ?? 'Servicios del hogar en Lima. Contacta con Mil Oficios por WhatsApp.';
      const canonical = `https://www.miloficios.pe${this.router.url.split(/[?#]/)[0]}`;
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ name: 'robots', content: route.data['noindex'] ? 'noindex,follow' : 'index,follow' });
      this.meta.updateTag({ property: 'og:title', content: route.title ?? this.title.getTitle() });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url', content: canonical });
      let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) { link = this.document.createElement('link'); link.rel = 'canonical'; this.document.head.appendChild(link); }
      link.href = canonical;
    });
  }
}
