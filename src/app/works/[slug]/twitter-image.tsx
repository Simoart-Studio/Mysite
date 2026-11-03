import { renderOg, OG_SIZE } from '@/lib/og';
import { projects, getProject } from '@/lib/projects';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Studium przypadku projektu';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  return renderOg({
    eyebrow: `Projekt · ${p.status}`,
    title: p.name,
    subtitle: p.tagline ?? p.stack.join(' · '),
  });
}
