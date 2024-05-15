module.exports = {
  root: true,
  extends: [],  // Removed 'airbnb-base' for potentially fewer stylistic constraints
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // Rules are either turned off or set in a way to allow more flexibility
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'import/extensions': 'off',
    'no-undef': 'off',
    'no-use-before-define': 'off',
  },
  globals: {
    getMetadata: 'readonly',
    getAllMetadata: 'readonly',
  },
};
