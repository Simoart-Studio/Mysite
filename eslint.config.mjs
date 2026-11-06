import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      // dangerouslySetInnerHTML tylko w przejrzanych miejscach (JSON-LD, klasa `js`) — reszta wymaga uzasadnienia.
      'react/no-danger': 'warn',
    },
  },
  {
    // Pliki konfiguracyjne i skrypty Node w CommonJS.
    files: ['next.config.js', 'scripts/**/*.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'docs/**', 'test-results/**', 'playwright-report/**']),
]);
