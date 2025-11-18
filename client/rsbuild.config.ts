import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_API_URL?: string;
    }
  }
}

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
    rspack: {
      plugins: [
        TanStackRouterRspack({
          target: 'react',
          virtualRouteConfig: './src/routes.ts',
          routesDirectory: './src',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
});
