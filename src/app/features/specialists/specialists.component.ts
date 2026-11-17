import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { SPECIALITIES } from '../../core/catalogs';

@Component({
  selector: 'app-specialists', standalone: true, imports: [RouterLink, IconComponent],
  templateUrl: './specialists.component.html', styleUrl: './specialists.component.css',
})
export class SpecialistsComponent {
  readonly specialities = SPECIALITIES.map((value, index) => ({
    value,
    label: value === 'Otro' ? 'Otro oficio' : value,
    icon: ['wrench', 'zap', 'refrigerator', 'paint-roller', 'briefcase-business'][index],
  }));
  readonly benefits = [
    { icon: 'briefcase-business', title: 'Oportunidades según tu perfil', text: 'Las oportunidades dependen de tu especialidad, las zonas que atiendes y la demanda de servicios.' },
    { icon: 'map-pin', title: 'Tu zona, desde el registro', text: 'Selecciona los distritos donde puedes trabajar para que conozcamos tu zona y cobertura de atención.' },
    { icon: 'whatsapp-monochrome', title: 'Contacto por WhatsApp', text: 'Revisaremos tu solicitud y te contactaremos por WhatsApp para conversar sobre los siguientes pasos.' },
  ];
  readonly steps = [
    { icon: 'user', title: 'Completa tu solicitud', text: 'Ingresa tus datos, especialidades y distritos de atención en dos pasos.' },
    { icon: 'clipboard-check', title: 'Revisamos tu información', text: 'Evaluamos los datos que compartiste para conocer tu perfil.' },
    { icon: 'whatsapp', title: 'Conversamos contigo', text: 'Te contactaremos por WhatsApp para continuar con los siguientes pasos.' },
  ];
  readonly faqs = [
    { id: 'specialists-faq-01', question: '¿Puedo registrar más de una especialidad?', answer: 'Sí. En el formulario puedes seleccionar varias especialidades. Si comienzas desde una tarjeta, encontrarás esa opción marcada y podrás cambiarla o agregar otras.' },
    { id: 'specialists-faq-02', question: '¿Qué pasa si mi oficio no aparece?', answer: 'Elige «Otro oficio» para comenzar. Al seleccionar «Otro» en el primer paso del registro, aparecerá un campo para escribir tu oficio. Completa ese dato para continuar. Tu solicitud estará sujeta a evaluación.' },
    { id: 'specialists-faq-03', question: '¿En qué distritos puedo atender?', answer: 'El registro permite elegir varios distritos de Lima Metropolitana. Selecciona las zonas donde puedes trabajar; las oportunidades dependerán de tu cobertura y de la demanda disponible.' },
    { id: 'specialists-faq-04', question: '¿Qué datos necesito para registrarme?', answer: 'Te pediremos tu nombre completo, celular, especialidades, distritos de atención y tipo y número de documento (DNI o carné de extranjería). También puedes agregar una descripción de tu experiencia.' },
    { id: 'specialists-faq-05', question: '¿Enviar mi solicitud significa que ya formo parte de la red?', answer: 'No. Recibir tu solicitud no implica aceptación en la red ni verificación completada. Primero revisaremos la información que compartas.' },
    { id: 'specialists-faq-06', question: '¿Qué ocurre después de enviar mis datos?', answer: 'Cuando el envío se complete correctamente, verás la confirmación de recepción. Revisaremos tu información y te contactaremos por WhatsApp para continuar con el proceso, sin un plazo de aprobación establecido.' },
  ];
  readonly expandedFaqIds = signal<ReadonlySet<string>>(new Set());

  toggleFaq(id: string): void {
    this.expandedFaqIds.update(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
