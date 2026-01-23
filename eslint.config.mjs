import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import googleappsscript from 'eslint-plugin-googleappsscript';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '.clasp.json',
      'logs',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'lerna-debug.log*',
      'report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json',
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',
      'lib-cov',
      'coverage',
      '*.lcov',
      '.nyc_output',
      '.grunt',
      'bower_components',
      '.lock-wscript',
      'build/Release',
      'node_modules/',
      'jspm_packages/',
      'typings/',
      '*.tsbuildinfo',
      '.npm',
      '.eslintcache',
      '.stylelintcache',
      '.rpt2_cache/',
      '.rts2_cache_cjs/',
      '.rts2_cache_es/',
      '.rts2_cache_umd/',
      '.node_repl_history',
      '*.tgz',
      '.yarn-integrity',
      '.env',
      '.env.test',
      '.env*.local',
      '.cache/',
      '.parcel-cache',
      '.next',
      '.nuxt',
      'dist/',
      '.out',
      '.storybook-out',
      'storybook-static',
      '.vuepress/dist',
      '.serverless/',
      '.fusebox/',
      '.dynamodb/',
      '.tern-port',
      '.vscode-test',
      'tmp/',
      'temp/',
    ],
  },
  {
    files: ['**/*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'script',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['**/*.config.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      globals: {
        ...globals.es2017,
        ...googleappsscript.environments.googleappsscript.globals,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      googleappsscript: googleappsscript,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  prettierConfig,
]);
