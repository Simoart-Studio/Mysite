export const BRAND         = 'SimoArt studio';
export const OWNER         = 'Szymon Pochopień';
export const AVAILABILITY  = 'Q2 2026';
export const GITHUB_URL    = 'https://github.com/kameleon1312';
export const LINKEDIN_URL  = 'https://linkedin.com/in/szymon-pochopien';
export const EMAIL         = 'szymon.pochopien01@gmail.com';
export const PHONE         = '+48 793 950 330';
export const CALENDLY_URL  = 'https://calendly.com/szymon-pochopien01/30min';

export const ATTACHMENT_MAX_MB = 4;
export const ATTACHMENT_TYPES  = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const;
export const ATTACHMENT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.docx';

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
