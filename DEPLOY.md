# Deploy — Szymon Pochopień Portfolio

## 1. Przygotowanie przed deployem

### Zmień domenę w lib/metadata.ts
```
SITE_URL = 'https://twoja-domena.pl'
```
To samo URL pojawi się automatycznie w: sitemap, robots, OG metadata, JSON-LD Schema.

### Dodaj prawdziwe obrazy projektów
Zastąp placeholdery w `public/works/`:
- `barberspace-thumb.webp` — 1600×1000px, max 300KB
- `taskiner-thumb.webp` — 800×600px, max 300KB

Optymalizacja: użyj squoosh.app lub `npx @squoosh/cli --webp-lossless -d public/works/ public/works/*.png`

### Zaktualizuj URL-e socialowe w lib/schema.ts
```ts
sameAs: ['https://linkedin.com/in/TWOJ_PROFIL', 'https://github.com/TWOJ_NICK']
```
Oraz w Contact.tsx (href linków LinkedIn i GitHub).

### Currently section
Zaktualizuj bieżącą książkę w `src/components/sections/Currently/Currently.tsx`.

---

## 2. Vercel Deploy

### Opcja A — Vercel CLI (zalecane)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Opcja B — GitHub Import
1. Push repo do GitHub: `git init && git add . && git commit -m "init" && git remote add origin [URL] && git push -u origin main`
2. Wejdź na vercel.com → Add New Project → Import z GitHub
3. Framework: Next.js (auto-detected)
4. Kliknij Deploy

---

## 3. Konfiguracja domeny w Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Dodaj domenę: `twoja-domena.pl`
3. Vercel pokaże rekordy DNS do ustawienia u rejestratora:
   - **A record**: `76.76.21.21`
   - **CNAME www**: `cname.vercel-dns.com`
4. Poczekaj do 24h na propagację DNS

---

## 4. Zmienne środowiskowe (opcjonalne)
Jeśli dodasz Calendly embed lub inne integracje:
- Vercel Dashboard → Settings → Environment Variables

---

## 5. Checklist przed launche'em

- [ ] Prawdziwe screenshoty projektów (WebP, <300KB)
- [ ] SITE_URL ustawiony na finalną domenę
- [ ] LinkedIn/GitHub URL poprawne
- [ ] Calendly link aktywny: https://calendly.com/szymon-pochopien01/30min
- [ ] `npm run build` bez błędów
- [ ] Lighthouse audit: Performance 95+, Accessibility 100, SEO 100
- [ ] Test mobile: 375px (iPhone SE), 390px (iPhone 14), 430px (iPhone 15 Plus)
- [ ] Test tablet: 768px
- [ ] Test desktop: 1280px, 1920px
- [ ] favicon.ico + apple-touch-icon.png dodane do /public

---

## 6. Generowanie faviconów

Zalecane: realfavicongenerator.net
1. Upload logo/monogram SP w wysokiej rozdzielczości
2. Pobierz paczkę — wgraj do `/public`
3. Dodaj `<link>` tagi z wygenerowanego kodu do `src/app/layout.tsx` (w `<head>`)

---

## 7. Analytics

@vercel/analytics i @vercel/speed-insights są już zainstalowane i wgrane w `layout.tsx`.
Automatycznie aktywują się po pierwszym deploy na Vercel.
Podgląd: Vercel Dashboard → Analytics / Speed Insights
