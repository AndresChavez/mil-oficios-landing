import { Directive, input } from '@angular/core';

type WhatsAppCtaLocation = 'header' | 'hero' | 'services' | 'about' | 'faq' | 'footer_social' | 'footer_contact';

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, parameters: Record<string, string>) => void;
  }
}

@Directive({
  selector: 'a[appTrackWhatsApp]',
  host: {
    '(click)': 'trackClick()',
    '(auxclick)': 'trackAuxClick($event)',
  },
})
export class TrackWhatsAppDirective {
  readonly location = input.required<WhatsAppCtaLocation>({ alias: 'appTrackWhatsApp' });
  readonly serviceCategory = input<string>();

  trackClick(): void {
    const parameters: Record<string, string> = {
      send_to: 'G-SR9FYTSKH5',
      cta_location: this.location(),
    };
    const category = this.serviceCategory();
    if (category) parameters['service_category'] = category;

    window.gtag?.('event', 'whatsapp_cta_clicked', parameters);
  }

  trackAuxClick(event: MouseEvent): void {
    if (event.button === 1) this.trackClick();
  }
}
