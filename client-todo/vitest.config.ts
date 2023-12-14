import path from 'node:path';
import { defineConfig, defaultExclude } from 'vitest/config';
import configuration from './vite.config';

const config = {
    ...configuration,
    test: {
        reporters: ['json', 'default'],
        outputFile: { json: "./test-output/test-results.json" },
        globals: true,
        setupFiles: path.resolve(__dirname, 'test/setup.ts'),
        exclude: [...defaultExclude],
        environmentMatchGlobs: [
            ['**/*.test.tsx', 'jsdom'],
            ['**/*.component.test.ts', 'jsdom'],
        ]
    },
};

// @ts-ignore
export default defineConfig(config); 