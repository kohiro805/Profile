import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://kohiro805.github.io',
  base: '/Hiroto-s-Profile/',
  integrations: [tailwind(), react()],
  output: 'static',
});

