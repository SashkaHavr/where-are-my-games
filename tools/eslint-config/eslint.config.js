import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import turboConfig from 'eslint-config-turbo/flat';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', '.output', '.vinxi'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended],
    rules: {
      curly: ['error', 'multi-line'],
      'func-style': ['error', 'declaration'],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: [
          '../../packages/*/tsconfig.json',
          '../../apps/*/tsconfig.json',
          '../../tools/*/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNumber: false,
          allowNullableString: true,
          allowNullableBoolean: true,
        },
      ],
    },
  },
  pluginReactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{tsx}'],
    ignores: ['src/ui/*.tsx', 'src/ssr.tsx'],
    extends: [pluginReactRefresh.configs.recommended],
  },
  pluginReactCompiler.configs.recommended,
  pluginQuery.configs['flat/recommended'],
  turboConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['*.config.ts', 'src/api.ts', 'src/ssr.tsx'],
    rules: {
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
    },
  },
);
