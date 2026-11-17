// Business identity supplied by the owner. Shared by the footer and privacy policy.
export const BUSINESS_IDENTITY = {
  legalName: 'CORPORACION MIL OFICIOS S.A.C.',
  ruc: '20615931528',
} as const;

// The owner confirmed these future destinations; their pages are not implemented yet.
export const FOOTER_DOCUMENTS = {
  support: { label: 'Garantía y soporte', path: '/garantia-soporte', available: false },
  terms: { label: 'Términos y condiciones', path: '/terminos-condiciones', available: false },
  complaints: { label: 'Libro de Reclamaciones', path: '/libro-de-reclamaciones', available: false },
} as const;
