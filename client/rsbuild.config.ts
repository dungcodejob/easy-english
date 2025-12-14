import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  output: {
    sourceMap: {
      js: 'source-map',
    },
  },
  source: {
    tsconfigPath: './tsconfig.json',
  },

  tools: {
    // New section for bundler-specific plugins
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          virtualRouteConfig: './src/routes.ts',
          routesDirectory: './src',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
});
