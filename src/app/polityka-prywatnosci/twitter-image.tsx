import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'Polityka prywatności';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: 'Prywatność',
    title: 'Polityka prywatności',
    subtitle: 'Jakie dane zbieram w formularzu, po co i jakie masz prawa.',
  });
}
