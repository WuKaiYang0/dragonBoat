// @ts-nocheck
const typescriptEslint = require('typescript-eslint')
const eslintPluginVue = require('eslint-plugin-vue')
const eslintConfigPrettier = require('eslint-config-prettier')
const eslint = require('@eslint/js')
const globals = require('globals')
module.exports = typescriptEslint.config(
  { ignores: ['**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended']
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser
      }
    },
    rules: {
      'vue/multi-word-component-names': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-unused-vars': 1
    }
  },
  eslintConfigPrettier
)
