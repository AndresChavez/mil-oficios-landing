import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { SERVICES, TESTIMONIALS } from '../core/content';
import { SPECIALIST_REQUEST_URL } from '../core/contact';
import { TrackWhatsAppDirective } from '../shared/track-whatsapp.directive';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home', standalone: true,
  imports: [RouterLink, IconComponent, TrackWhatsAppDirective],
  templateUrl: './home.component.html', styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly services = SERVICES;
  readonly testimonials = environment.production
    ? TESTIMONIALS.filter(testimonial => !testimonial.sample)
    : TESTIMONIALS;
  readonly currentTestimonial = signal(0);
  readonly specialistRequestUrl = SPECIALIST_REQUEST_URL;
  readonly benefits = [
    { icon: 'shield-check', title: 'Técnicos verificados', description: 'Identidad, referencias y experiencia.' },
    { icon: 'whatsapp-monochrome', title: 'Coordina por WhatsApp', description: 'Cuéntanos qué necesitas desde el chat.' },
    { icon: 'handshake', title: 'Atención con confianza', description: 'Resuelve tus dudas antes de coordinar el servicio.' },
    { icon: 'map-pin', title: 'Cerca de ti', description: 'Técnicos de tu distrito para atención rápida.' },
  ];
  readonly faqs = [
    {
      id: 'faq-01',
      question: '¿Cuánto cuesta solicitar una cotización?',
      answer: 'Puedes enviarnos tu solicitud sin compromiso. Si el especialista necesita realizar una visita técnica para evaluar el trabajo, te informaremos previamente si tiene algún costo y cuáles son sus condiciones.',
    },
    {
      id: 'faq-02',
      question: '¿Cómo funciona Mil Oficios?',
      answer: 'Cuéntanos qué trabajo necesitas, en qué distrito y cuándo te gustaría realizarlo. Te ayudaremos a encontrar especialistas que puedan atender tu solicitud para que elijas la opción que mejor se adapte a tus necesidades.',
    },
    {
      id: 'faq-03',
      question: '¿Cómo sé que el especialista es confiable?',
      answer: 'En Mil Oficios buscamos trabajar con especialistas que pasan por un proceso de revisión de información y experiencia. Te compartiremos los datos disponibles del especialista para ayudarte a tomar una decisión informada.',
    },
    {
      id: 'faq-04',
      question: '¿Qué tan rápido responden?',
      answer: 'Revisamos tu solicitud para ayudarte a encontrar un especialista disponible. El tiempo de respuesta puede variar según el tipo de trabajo, la ubicación y la disponibilidad de nuestros especialistas.',
    },
    {
      id: 'faq-05',
      question: '¿Puedo elegir al especialista que realizará el trabajo?',
      answer: 'Sí. Cuando encontremos especialistas disponibles, te presentaremos las alternativas para que puedas elegir con quién deseas coordinar el servicio.',
    },
    {
      id: 'faq-06',
      question: '¿Qué sucede si tengo un problema después del servicio?',
      answer: 'Puedes comunicarte con Mil Oficios para reportar lo ocurrido. Revisaremos tu caso y te orientaremos sobre las condiciones de garantía o solución que correspondan al trabajo realizado.',
    },
    {
      id: 'faq-07',
      question: '¿Qué tipos de servicios puedo solicitar?',
      answer: 'Puedes solicitar servicios de gasfitería, electricidad, carpintería, pintura, melamina, drywall, reparación de electrodomésticos y otros trabajos de mantenimiento o mejora del hogar.',
    },
    {
      id: 'faq-08',
      question: '¿En qué distritos atienden?',
      answer: 'Recibimos solicitudes en Lima Metropolitana y Callao. La atención dependerá de la disponibilidad de especialistas que cubran tu distrito.',
    },
  ] as const;
  readonly expandedFaqIds = signal<ReadonlySet<string>>(new Set());

  isFaqOpen(id: string): boolean {
    return this.expandedFaqIds().has(id);
  }

  toggleFaq(id: string): void {
    this.expandedFaqIds.update(expanded => {
      const next = new Set(expanded);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  selectTestimonial(index: number): void {
    this.currentTestimonial.set((index + this.testimonials.length) % this.testimonials.length);
  }
}
