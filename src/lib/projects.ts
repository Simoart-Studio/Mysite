import github from '@/data/projects.json';
import overridesFile from '@/data/projects.overrides.json';
import type {
  Project, ProjectChallenge, ProjectImage, ProjectLabel, ProjectStatus,
} from '@/types/project';

/** Tekst wyświetlany, gdy pole nie wynika z repozytorium ani z nadpisań. */
export const TODO = 'Do uzupełnienia';

type GithubRepo = {
  name: string;
  private?: boolean;
  available?: boolean;
  description?: string | null;
  topics?: string[];
  homepage?: string | null;
  url?: string;
  stars?: number;
  primaryLanguage?: string | null;
  createdAt?: string;
  lastCommitAt?: string;
  pushedAt?: string;
  languages?: { name: string; percent: number }[];
  readme?: { summary: string | null; features: string[]; stack: string[] };
};

type Override = Partial<{
  slug: string;
  name: string;
  status: ProjectStatus;
  labels: ProjectLabel[];
  tagline: string;
  stack: string[];
  stackFull: string[];
  forWho: string;
  problem: string;
  solution: string;
  scope: string;
  effect: string;
  challenge: ProjectChallenge;
  limitations: string[];
  demoUrl: string;
  repoUrl: string;
  embed: boolean;
  hidden: boolean;
  thumbnail: ProjectImage;
  screenshots: ProjectImage[];
}>;

type OverridesFile = {
  order: string[];
  projects: Record<string, Override>;
};

const MISSING_LABELS: [keyof Project, string][] = [
  ['tagline',     'opis problemu (awers)'],
  ['forWho',      'dla kogo'],
  ['problem',     'problem'],
  ['solution',    'rozwiązanie'],
  ['scope',       'mój zakres'],
  ['effect',      'efekt'],
  ['challenge',   'wyzwanie techniczne'],
  ['thumbnail',   'miniatura'],
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function build(): Project[] {
  const { order, projects } = overridesFile as unknown as OverridesFile;
  const repos = (github as { repos: GithubRepo[] }).repos;
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

  return order
    .map((repoName): Project | null => {
      const o: Override = projects[repoName] ?? {};
      if (o.hidden) return null;
      const g: GithubRepo = byName.get(repoName.toLowerCase()) ?? { name: repoName };
      const isPrivate = g.private ?? true;

      const project: Project = {
        slug:          o.slug ?? slugify(repoName),
        name:          o.name ?? g.name,
        repoName,
        isPrivate,
        status:        o.status ?? (g.homepage || o.demoUrl ? 'Wdrożony' : 'Prototyp'),
        labels:        o.labels ?? ['projekt własny'],
        tagline:       o.tagline ?? g.description ?? null,
        stack:         (o.stack ?? g.readme?.stack ?? (g.primaryLanguage ? [g.primaryLanguage] : [])).slice(0, 4),
        stackFull:     o.stackFull ?? g.readme?.stack ?? [],
        languages:     g.languages ?? [],
        forWho:        o.forWho ?? null,
        problem:       o.problem ?? null,
        solution:      o.solution ?? null,
        scope:         o.scope ?? null,
        effect:        o.effect ?? null,
        challenge:     o.challenge ?? null,
        limitations:   o.limitations ?? [],
        readmeSummary: g.readme?.summary ?? null,
        readmeFeatures: g.readme?.features ?? [],
        // Repo prywatne: nie pokazujemy linku (dla odwiedzających byłby 404)
        repoUrl:       o.repoUrl ?? (isPrivate ? null : g.url ?? null),
        demoUrl:       o.demoUrl ?? g.homepage ?? null,
        embed:         o.embed ?? false,
        thumbnail:     o.thumbnail ?? null,
        screenshots:   o.screenshots ?? [],
        createdAt:     g.createdAt ?? null,
        lastCommitAt:  g.lastCommitAt ?? g.pushedAt ?? null,
        stars:         g.stars ?? null,
        topics:        g.topics ?? [],
        missing:       [],
      };

      project.missing = MISSING_LABELS
        .filter(([key]) => project[key] == null)
        .map(([, label]) => label);
      if (!project.screenshots.length) project.missing.push('zrzuty ekranu');
      if (!project.demoUrl) project.missing.push('demo');

      return project;
    })
    .filter((p): p is Project => p !== null);
}

export const projects: Project[] = build();

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

const MONTHS = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export function formatMonth(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
