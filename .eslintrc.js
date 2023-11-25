// Migrate built-in rules to @stylistic/js namespace
/* eslint @stylistic/migrate/migrate-js: "error" */

// Migrate `@typescript-eslint` rules to @stylistic/ts namespace
/* eslint @stylistic/migrate/migrate-ts: "error" */

module.exports = {
  plugins: [
    '@stylistic',
    '@stylistic/migrate'
  ],
  rules: {
    'array-callback-return': 1,
    'arrow-body-style': 1,
    'no-console': 0,
    'comma-dangle': 0,
    'no-duplicate-imports': 'error',
    'no-return-assign': 1,
    'new-cap': 0,
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
      },
    ],
    'no-use-before-define': 'error',
    'object-shorthand': 1,
    'prefer-arrow-callback': 1,
    'prefer-destructuring': 'warn',
    'prefer-rest-params': 1,
    'prefer-template': 'error',
    'react/display-name': 0,
    'react/react-in-jsx-scope': 'error',
    'react/jsx-key': 0,
    'react/no-unescaped-entities': 0,
    'react/no-unknown-property': 0,
    'react/prop-types': 0,
    'sort-imports': 0,
    'space-before-function-paren': 0,
    indent: 0,
  },
  env: {
    browser: true,
    jest: true,
  },
  globals: {
    React: true,
    NODE_ENV: true,
    cy: true,
    Map: true,
    Promise: true,
    Symbol: true,
    Set: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
