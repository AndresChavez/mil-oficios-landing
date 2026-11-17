export const SERVICES = [
  { name: 'Gasfitería', icon: 'wrench', description: 'Fugas, grifería y desagües' },
  { name: 'Electricidad', icon: 'zap', description: 'Tomacorrientes, luces y cableado' },
  { name: 'Línea blanca', icon: 'refrigerator', description: 'Refrigeradoras, lavadoras y cocinas' },
  { name: 'Pintura', icon: 'paint-roller', description: 'Interiores, exteriores y acabados' },
] as const;

export const TESTIMONIALS = [
  { quote: 'Tuve una fuga en la cocina y el técnico llegó puntual, explicó el problema y lo resolvió todo. Muy recomendado.', name: 'María P. · Miraflores', service: 'Gasfitería', sample: true, image: 'assets/photos/testimonial-illustration.webp', icon: 'user' },
  { quote: 'El técnico revisó los tomacorrientes y me explicó el trabajo antes de empezar. Todo quedó funcionando bien. Lo recomiendo.', name: 'Carlos R. · Jesús María', service: 'Electricidad', sample: true, image: 'assets/photos/testimonial-carlos-illustration.webp', icon: 'zap' },
  { quote: 'Coordiné la pintura de mi sala por WhatsApp. El especialista cuidó los muebles y dejó todo limpio. Me gustó el resultado.', name: 'Patricia G. · San Borja', service: 'Pintura', sample: true, image: 'assets/photos/testimonial-patricia-illustration.webp', icon: 'paint-roller' },
] as const;
