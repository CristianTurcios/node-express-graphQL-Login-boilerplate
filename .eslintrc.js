module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript', // Used to resolve imports correctly
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolvers': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [{
    files: [
      '**/*.spec.ts',
    ],
    env: {
      jest: true, // now **/*.test.js files' env has both es6 *and* jest
    },
    // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
    // "extends": ["plugin:jest/recommended"]
    plugins: ['jest'],
    rules: {
      'jest/no-disabled-tests': 'error',
      'jest/expect-expect': 'warn',
      'jest/prefer-to-be-null': 'error',
      'jest/prefer-to-contain': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'error',
      'jest/consistent-test-it': 'error',
      'import/no-extraneous-dependencies': 'off',
    },
  }],
};
