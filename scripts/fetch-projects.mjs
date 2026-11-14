#!/usr/bin/env node
/**
 * Pobiera dane repozytoriów z GitHub API i zapisuje je do src/data/projects.json.
 *
 *   npm run projects            — odśwież dane (błędy nie przerywają buildu)
 *   npm run projects -- --strict — zakończ z kodem 1, gdy pobranie się nie uda
 *   --if-ci                      — pobieraj tylko w CI/Vercel (używane w prebuild)
 *
 * Zmienne środowiskowe (tylko po stronie build/CI, nigdy w kodzie klienta):
 *   GITHUB_TOKEN  — opcjonalny token (zakres: read). Bez niego: tylko repo publiczne
 *                   i limit 60 zapytań/h. Z nim: także repo prywatne wpisane
 *                   w projects.overrides.json.
 *   GITHUB_USER   — domyślnie wartość "user" z projects.overrides.json.
 *
 * Repo z organizacji wpisuje się w overrides.order jako "Organizacja/Repo"
 * (np. "Simoart-Studio/Hydro"); pozostałe nazwy dotyczą konta GITHUB_USER.
 *
 * Zasady:
 *   - Pobieramy tylko repo wpisane w overrides.order (bez forków i archiwów).
 *   - Gdy któreś zapytanie się nie uda, zostawiamy pole z ostatniego poprawnego
 *     projects.json. Gdy nie uda się nic, plik zostaje bez zmian.
 *   - Token nigdy nie trafia do pliku wynikowego ani do logów.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/projects.json');
const OVERRIDES = path.join(ROOT, 'src/data/projects.overrides.json');
const STRICT = process.argv.includes('--strict');
const IF_CI = process.argv.includes('--if-ci');
const TOKEN = process.env.GITHUB_TOKEN?.trim() || '';
const API = 'https://api.github.com';

const log = (...a) => console.log('[projects]', ...a);
const warn = (...a) => console.warn('[projects]', ...a);

class RateLimitError extends Error {}

async function gh(url, { raw = false } = {}) {
  const headers = {
    Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'simoart-studio-projects-script',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(url.startsWith('http') ? url : API + url, {
    headers,
    signal: AbortSignal.timeout(15000),
  });

  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000;
    throw new RateLimitError(`limit API wyczerpany (reset: ${new Date(reset).toISOString()})`);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return raw ? res.text() : res.json();
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/* ── README → cel, funkcje, stack ─────────────────────────────── */
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

function clean(line) {
  return line
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(EMOJI, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractReadme(md) {
  if (!md) return { summary: null, features: [], stack: [] };
  const lines = md.replace(/\r/g, '').split('\n');

  // Sekcje wg nagłówków
  const sections = [];
  let current = { title: '', body: [] };
  for (const line of lines) {
    const h = line.match(/^#{1,3}\s+(.*)$/);
    if (h) {
      sections.push(current);
      current = { title: clean(h[1]).toLowerCase(), body: [] };
    } else current.body.push(line);
  }
  sections.push(current);

  // Cel: pierwszy akapit prozy (nie tabela, nie lista, nie kod, nie badge)
  let summary = null;
  let inCode = false;
  for (const s of sections) {
    const skip = /start|instal|uruchom|run|licen|deploy|zmienne|env/.test(s.title);
    for (const raw of s.body) {
      if (raw.trim().startsWith('```')) { inCode = !inCode; continue; }
      if (inCode || skip) continue;
      const t = raw.trim();
      if (!t || /^[|>]|^[-*+]\s|^\d+\.\s/.test(t) || t.startsWith('<') || t.startsWith('[!')) continue;
      const c = clean(t);
      if (c.length >= 40) { summary = c; break; }
    }
    if (summary) break;
  }

  const bullets = (body) =>
    body
      .map((l) => l.match(/^\s*[-*+]\s+(.*)$/)?.[1])
      .filter(Boolean)
      .map(clean)
      .filter((t) => t.length > 2);

  const tableFirstCol = (body) =>
    body
      .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s|:-]+\|\s*$/.test(l))
      .map((l) => l.split('|').map(clean).filter(Boolean))
      .filter((cells) => cells.length >= 2)
      .map((cells) => (cells.length > 2 ? cells[1] : cells[0]))
      .filter((t) => !/^(category|kategoria|technology|technologia)$/i.test(t));

  const features = [];
  const stack = [];
  for (const s of sections) {
    if (/funkc|feature|co jest|możliwo/.test(s.title)) features.push(...bullets(s.body));
    if (/stack|technolog|tech/.test(s.title)) {
      stack.push(...bullets(s.body), ...tableFirstCol(s.body));
    }
  }

  return {
    summary,
    features: features.slice(0, 10),
    stack: [...new Set(stack)].slice(0, 12),
  };
}

function toPercent(langs) {
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  if (!total) return [];
  return Object.entries(langs)
    .map(([name, bytes]) => ({ name, percent: Math.round((bytes / total) * 1000) / 10 }))
    .filter((l) => l.percent >= 0.5)
    .sort((a, b) => b.percent - a.percent);
}

async function main() {
  if (IF_CI && !process.env.CI && !process.env.VERCEL) {
    log('lokalny build: pomijam pobieranie (uruchom `npm run projects`, aby odświeżyć)');
    return;
  }
  const overrides = await readJson(OVERRIDES, null);
  if (!overrides) throw new Error('Brak src/data/projects.overrides.json');
  const user = process.env.GITHUB_USER || overrides.user;
  const wanted = overrides.order ?? [];

  const previous = await readJson(OUT, { repos: [] });
  const prevByName = new Map(previous.repos.map((r) => [r.name.toLowerCase(), r]));

  log(`użytkownik: ${user}, token: ${TOKEN ? 'tak' : 'nie'}, repo: ${wanted.length}`);

  // Lista repo jednym zapytaniem (search obejmuje prywatne widoczne dla tokenu)
  let list;
  try {
    const res = await gh(`/search/repositories?q=user:${encodeURIComponent(user)}&per_page=100`);
    list = res.items;
  } catch (e) {
    warn(`nie udało się pobrać listy repo: ${e.message}`);
    if (STRICT) process.exit(1);
    warn('zostawiam ostatni poprawny projects.json');
    return;
  }

  const byName = new Map(list.map((r) => [r.name.toLowerCase(), r]));
  const repos = [];
  let failures = 0;

  // Repo spoza konta użytkownika (np. organizacji) — wyszukiwanie user:… ich nie obejmuje.
  const keyOf = (entry) => entry.split('/').pop().toLowerCase();
  for (const entry of wanted.filter((w) => w.includes('/'))) {
    try {
      byName.set(keyOf(entry), await gh(`/repos/${entry}`));
    } catch (e) {
      if (e instanceof RateLimitError) throw e;
      warn(`${entry}: ${e.message}`);
    }
  }

  for (const name of wanted) {
    const meta = byName.get(keyOf(name));
    const prev = prevByName.get(keyOf(name));

    if (!meta) {
      // Repo prywatne bez tokenu albo usunięte — zostaw poprzednie dane, jeśli są
      if (prev) repos.push(prev);
      else repos.push({ name, private: true, available: false });
      log(`${name}: niewidoczne przez API${TOKEN ? '' : ' (repo prywatne wymaga GITHUB_TOKEN)'}`);
      continue;
    }
    if (meta.fork || meta.archived) {
      log(`${name}: pomijam (fork/archiwum)`);
      continue;
    }

    const full = meta.full_name;
    const entry = {
      name: meta.name,
      fullName: full,
      available: true,
      private: meta.private,
      description: meta.description,
      topics: meta.topics ?? [],
      homepage: meta.homepage ? (meta.homepage.startsWith('http') ? meta.homepage : `https://${meta.homepage}`) : null,
      url: meta.html_url,
      stars: meta.stargazers_count,
      primaryLanguage: meta.language,
      createdAt: meta.created_at,
      pushedAt: meta.pushed_at,
      lastCommitAt: prev?.lastCommitAt ?? meta.pushed_at,
      languages: prev?.languages ?? [],
      readme: prev?.readme ?? { summary: null, features: [], stack: [] },
    };

    try {
      entry.languages = toPercent(await gh(`/repos/${full}/languages`));
    } catch (e) {
      if (e instanceof RateLimitError) throw e;
      failures++;
      warn(`${name}: języki — ${e.message} (zostawiam poprzednie)`);
    }

    try {
      const commits = await gh(`/repos/${full}/commits?per_page=1`);
      entry.lastCommitAt = commits[0]?.commit?.committer?.date ?? entry.lastCommitAt;
    } catch (e) {
      if (e instanceof RateLimitError) throw e;
      failures++;
      warn(`${name}: ostatni commit — ${e.message} (używam pushed_at)`);
    }

    let readme = null;
    try {
      readme = await gh(`/repos/${full}/readme`, { raw: true });
    } catch (e) {
      if (e instanceof RateLimitError) throw e;
      // Publiczne repo: spróbuj raw.githubusercontent.com (nie liczy się do limitu API)
      if (!meta.private) {
        try {
          const r = await fetch(`https://raw.githubusercontent.com/${full}/${meta.default_branch}/README.md`, {
            signal: AbortSignal.timeout(15000),
          });
          if (r.ok) readme = await r.text();
        } catch {}
      }
      if (!readme) {
        failures++;
        warn(`${name}: README — ${e.message} (zostawiam poprzednie)`);
      }
    }
    if (readme) entry.readme = extractReadme(readme);

    repos.push(entry);
    log(`${name}: ok`);
  }

  const data = {
    $comment: 'Plik generowany przez scripts/fetch-projects.mjs. Nie edytuj ręcznie — użyj projects.overrides.json.',
    generatedAt: new Date().toISOString(),
    user,
    repos,
  };
  await fs.writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  log(`zapisano ${path.relative(ROOT, OUT)} (${repos.length} repo, ${failures} częściowych błędów)`);
}

main().catch((e) => {
  warn(`błąd: ${e.message}`);
  warn('zostawiam ostatni poprawny projects.json');
  process.exit(STRICT ? 1 : 0);
});
