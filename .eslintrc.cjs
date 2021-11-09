module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: ["svelte3", "@typescript-eslint"],
    ignorePatterns: ["*.cjs", "svelte.config.js"],
    overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
    settings: {
        "svelte3/typescript": () => require("typescript"),
    },
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
        ecmaVersion: 2019,
        tsconfigRootDir: __dirname,
        extraFileExtensions: [".svelte"],
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    rules: {
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/strict-boolean-expressions": [
            "error",
            { allowString: false, allowNumber: false },
        ],
    },
};
