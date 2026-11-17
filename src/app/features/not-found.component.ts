import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true, imports: [RouterLink],
  template: `<section class="page-container py-20 text-center"><span class="eyebrow">404</span><h1 class="section-title mt-4">No encontramos esta página</h1><p class="my-6 text-brand-muted">Puedes volver al inicio para encontrar lo que necesitas.</p><a routerLink="/" class="button button-specialist">Volver al inicio</a></section>`,
})
export class NotFoundComponent {}
