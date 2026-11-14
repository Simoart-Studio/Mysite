import { renderOg, OG_SIZE } from '@/lib/og';
import { projects } from '@/lib/projects';

export const alt = 'Wszystkie projekty';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: `${projects.length} projektów`,
    title: 'Wszystkie projekty',
    subtitle: projects.map((p) => p.name).join(' · '),
  });
}
