const path = require('path');
const fs = require('fs');

const mixinsContent = fs.readFileSync(
  path.join(__dirname, 'src/styles/mixins.scss'),
  'utf-8'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['nodemailer'],
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
