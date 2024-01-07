/* eslint-env node */
/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};

module.exports = config;
