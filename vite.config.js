import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icons/*.png'],
            devOptions: {
                enabled: true,
                type: 'module',
            },
            manifest: {
                name: 'PharmaApp',
                short_name: 'NicPharmaApp',
                description: 'Application PWA de gestion de pharmacie avec mode offline',
                theme_color: '#38bdf8',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                {
                    src: '/icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                ],
            },
            workbox: {
                runtimeCaching: [
                {
                    urlPattern: ({ request }) => request.destination === 'document',
                    handler: 'NetworkFirst',
                },
                {
                    urlPattern: ({ request }) =>
                    ['style', 'script', 'image'].includes(request.destination),
                    handler: 'CacheFirst',
                },
                ],
            },
        }),
    ],
});
