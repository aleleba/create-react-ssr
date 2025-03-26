import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: [
            'build/',
            'webpack.config.ts',
            'webpack.config.dev.ts',
            'webpack.config.dev.server.ts',
            'webpack.cy.config.ts',
            'service-worker.ts',
            'serviceWorkerRegistration.ts'
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                globals: {
                    ...globals.browser,
                    ...globals.node,
                    ...globals.es2021
                }
            }
        },
        plugins: {
            react: reactPlugin,
            '@typescript-eslint': tseslint.plugin
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            'indent': ['error', 'tab'],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'eol-last': ['error', 'always'],
            '@typescript-eslint/no-var-requires': 'off',
            // Include here the recommended rules for react
            ...reactPlugin.configs.recommended.rules
        }
    }
);