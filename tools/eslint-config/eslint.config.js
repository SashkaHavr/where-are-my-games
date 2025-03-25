import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
// @ts-ignore
import turbo from 'eslint-config-turbo/flat';
// @ts-ignore
import pluginReactCompiler from 'eslint-plugin-react-compiler';
// @ts-ignore
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // @ts-ignore
      ...tseslint.configs.recommended,
      // @ts-ignore
      ...tseslint.configs.recommendedTypeChecked,
      // @ts-ignore
      ...tseslint.configs.stylistic,
      // @ts-ignore
      ...tseslint.configs.stylisticTypeChecked,
      // @ts-ignore
      ...pluginQuery.configs['flat/recommended'],
      // @ts-ignore
      ...turbo,
    ],
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-compiler/react-compiler': 'error',
      'react-hooks/exhaustive-deps': 'off',
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
      curly: ['error', 'multi-line'],
      '@typescript-eslint/no-empty-function': 'off',
      // These doesn't work in monorepo
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        // @ts-ignore
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.config.ts'],
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
