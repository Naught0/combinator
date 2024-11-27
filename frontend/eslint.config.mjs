import { defineConfig } from "eslint-define-config";

export default defineConfig({
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
  rules: {
    "react/prop-types": "off", // Disable prop-types check if using TypeScript
    "react/jsx-uses-react": "off", // React 17+ does not need jsx-uses-react
    "react/jsx-uses-vars": "error", // Detect unused variables in JSX
    // General JavaScript rules
    "no-console": "warn", // Warn on console logs
    "no-debugger": "warn", // Warn on debugger statements
    "import/no-unresolved": [2, { ignore: ["^vite/"] }], // Ignore Vite-specific paths
    "import/extensions": [
      "error",
      "never",
      { ts: "never", tsx: "never", jsx: "never" },
    ], // Enforce no extensions in import paths
  },
});
