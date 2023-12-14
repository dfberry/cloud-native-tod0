import path from 'node:path';
import { defineConfig, defaultExclude } from 'vitest/config';
import configuration from './vite.config';

export default defineConfig({
    ...configuration,
    test: {
        globals: true,
        setupFiles: path.resolve(__dirname, 'test/setup.ts'),
        exclude: [...defaultExclude, '**/*.svelte**'],
        environmentMatchGlobs: [
            ['**/*.test.tsx', 'jsdom'],
            ['**/*.component.test.ts', 'jsdom'],
        ]
    },
});   