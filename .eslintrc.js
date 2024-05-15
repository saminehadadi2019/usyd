module.exports = {
  root: true,
  extends: 'airbnb-base',
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
    'no-param-reassign': [2, { props: false }], // Allow reassigning parameters but not their properties
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      js: 'always',
    }],
    'no-undef': 'off', // This disables the no-undef rule completely
    'no-use-before-define' : 'off'
  },
  globals: {
    getMetadata: 'readonly', // Use single quotes
    getAllMetadata: 'readonly', // Use single quotes
  },
};
