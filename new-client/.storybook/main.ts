import { dirname, join } from 'node:path';
import type { StorybookConfig } from 'storybook-react-rsbuild';

/**
 * Resolves and returns the absolute directory path of a given package.
 *
 * @param value - The package name or path to resolve.
 * @returns The absolute path to the directory containing the package's {@link package.json}.
 *
 * @remark
 * Supports Yarn Plug'n'Play and monorepo setups by locating the package's {@link package.json} file.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const repoName = 'orbit';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: getAbsolutePath('storybook-react-rsbuild'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // typescript: {
  //     reactDocgen: 'react-docgen-typescript',
  //     reactDocgenTypescriptOptions: {
  //         shouldExtractLiteralValuesFromEnum: true,
  //         shouldRemoveUndefinedFromOptional: true,
  //         propFilter: () => true,
  //     },
  //     check: true,
  // },
  rsbuildFinal: (config) => {
    // Customize the final Rsbuild config here
    config.output ??= {};
    config.output['publicPath'] = `/${repoName}/`;
    return config;
  },
};

export default config;
