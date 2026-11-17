export const WHATSAPP_NUMBER = '51980941418';

function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SPECIALIST_REQUEST_URL = whatsappUrl('Hola, vi su web y necesito un especialista.');
