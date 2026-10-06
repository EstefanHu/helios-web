import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const config = [
  {
    ignores: ['node_modules/', 'build/', 'dist/', '.next/', 'tmp/'],
  },

  // eslint-config-prettier last: it disables stylistic rules that conflict with Prettier.
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: { prettier: eslintPluginPrettier },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'prettier/prettier': ['error'],
      'react/prop-types': 0,
      quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'jsx-quotes': [2, 'prefer-single'],
      'max-len': [
        'error',
        120,
        2,
        {
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreTrailingComments: true,
        },
      ],
      strict: [2, 'never'],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'class-methods-use-this': 'error',
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          '': 'never',
          mjs: 'never',
          jsx: 'ignorePackages',
          js: 'ignorePackages',
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Rules introduced by the React Compiler-era react-hooks plugin that ships with
      // eslint-config-next 16. The code below predates them, so they are warnings here to
      // keep `npm run lint` meaningful while these sites are refactored:
      //   src/app/(app)/archive/page.jsx    - `setLoading(true)` resets state on dep change
      //   src/app/(app)/write/WriteInput.jsx - entry selection + redirect inside an effect
      //   src/app/(app)/layout.jsx          - try/catch returning JSX (see existing TODO)
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'import/prefer-default-export': 'off',
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
    },
  },
  {
    // Config files are CommonJS.
    files: ['next.config.js', '*.config.js', '*.config.mjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
];

export default config;