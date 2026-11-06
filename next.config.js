const path = require('path');
const fs = require('fs');

const mixinsContent = fs.readFileSync(
  path.join(__dirname, 'src/styles/mixins.scss'),
  'utf-8'
);

const isDev = process.env.NODE_ENV === 'development';

// CSP bez nonce (strony są statyczne — nonce wymusiłby renderowanie dynamiczne).
// frame-src https: — podgląd demo projektów w <iframe sandbox> z ich własnych domen.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https:',
  "media-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  serverExternalPackages: ['nodemailer'],
  experimental: {
    serverActions: {
      // Załącznik w formularzu (max 4 MB) + pola tekstowe
      bodySizeLimit: '4.5mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  sassOptions: {
    additionalData: mixinsContent,
    implementation: 'sass',
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
