export const BRAND         = 'SimoArt studio';
export const OWNER         = 'Szymon Pochopień';
export const AVAILABILITY  = 'Q2 2026';
export const GITHUB_URL    = 'https://github.com/kameleon1312';
export const LINKEDIN_URL  = 'https://linkedin.com/in/szymon-pochopien';
export const EMAIL         = 'szymon.pochopien01@gmail.com';
/** Numer telefonu w formacie +48 000 000 000. Pusty = nie pokazujemy. DO UZUPEŁNIENIA. */
export const PHONE         = '';
export const CALENDLY_URL  = 'https://calendly.com/szymon-pochopien01/30min';

/** Limit załącznika w formularzu kontaktowym. */
// Vercel przyjmuje żądania do 4,5 MB — załącznik max 4 MB zostawia zapas na resztę formularza
export const ATTACHMENT_MAX_MB = 4;
export const ATTACHMENT_TYPES  = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const;
export const ATTACHMENT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.docx';

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
