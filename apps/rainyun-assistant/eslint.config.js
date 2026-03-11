import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "warn", // 未使用的变量
      "@typescript-eslint/no-explicit-any": "warn", // 显式的 any 类型
      "@typescript-eslint/no-unused-expressions": "off", // 未使用的表达式，包括用于执行副作用的短路表达式
      "no-constant-condition": "warn", // 常量条件
      "prefer-const": "warn", // 首选 const
      "no-empty": "warn", // 空块
    },
  },
)
