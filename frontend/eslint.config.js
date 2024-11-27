/* eslint-env node */
/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  {
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "prettier",
    ],
    plugins: ["react", "@typescript-eslint"],
    parserOptions: {
      ecmaVersion: "",
      sourceType: "module",
    },
    parser: "@typescript-eslint/parser",
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

module.exports = config;
