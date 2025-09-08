import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
    {
        ...tseslint.configs.recommended[0],
    },
    pluginReact.configs.flat.recommended,
    {
        rules: {
            "react/display-name": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": "off",
            "linebreak-style": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-undef": "off",
            "indent": "off",
            "quotes": "off", 
            "semi": "off",
            "no-unused-vars": "off",
            "react/no-unescaped-entities": "off",
        },
    },
])