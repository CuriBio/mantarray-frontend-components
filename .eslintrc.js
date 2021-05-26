module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    "jest/globals": true,
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "google", "prettier"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "vue",
    "jest",
    // "snakecasejs"
  ],
  settings: {
    "snakecasejs/filter": [
      "ClassDeclaration",
      "NewExpression",
      "ImportSpecifier",
    ],
    "snakecasejs/whitelist": [
      "FontAwesomeIcon",
      "afterEach",
      "afterAll",
      "beforeEach",
      "beforeAll",
    ],
  },
  rules: {
    "no-console": 0,
    "no-empty": 0,
    // Stylistic Issues
    "no-irregular-whitespace": 0,
    camelcase: [0, { properties: "never" }],
    "no-invalid-this": 0,
    // "snakecasejs/snakecasejs": "warn",
    // VueJS rules
    "vue/prop-name-casing": ["error", "snake_case"],
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/one-component-per-file": "error",
    "vue/require-default-prop": "error",
    "vue/require-prop-types": "error",
    "vue/v-bind-style": ["error", "shorthand"],
    "vue/v-on-style": ["error", "shorthand"],
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/attributes-order": "error",
    "vue/this-in-template": "error",
    "vue/no-lone-template": "error",
    "vue/no-v-html": "error",
    "vue/order-in-components": "error",
    "vue/no-multiple-slot-args": "error",
    // Jest Rules
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/consistent-test-it": [
      "error",
      { fn: "test", withinDescribe: "test" },
    ],
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: ["expect"],
      },
    ],
    "jest/no-alias-methods": "error",
    "jest/no-conditional-expect": "error",
    "jest/no-deprecated-functions": "error",
    "jest/no-done-callback": "error",
    "jest/no-duplicate-hooks": "error",
    "jest/no-export": "error",
    "jest/no-identical-title": "error",
    "jest/no-if": "error",
    "jest/no-interpolation-in-snapshots": "error",
    "jest/no-standalone-expect": "error",
    "jest/no-test-prefixes": "error",
    "jest/no-test-return-statement": "error",
    "jest/prefer-called-with": "error",

    "jest/prefer-hooks-on-top": "error",
    "jest/prefer-spy-on": "error",
    "jest/prefer-strict-equal": "error",
    "jest/prefer-to-be-null": "error",
    "jest/prefer-to-be-undefined": "error",
    "jest/prefer-to-contain": "error",
    "jest/prefer-to-have-length": "error",
    "jest/require-to-throw-message": "error",
    "jest/require-top-level-describe": "error",
    "jest/valid-describe": "error",
    "jest/valid-expect": "error",
    "jest/valid-title": [
      "error",
      {
        mustMatch: {
          test: "(^Given.+, When.+, Then.+)|(^When.+, Then.+)",
          describe: "(^Given.+)|(^\\S+$)",
        },
      },
    ],
  },
};
