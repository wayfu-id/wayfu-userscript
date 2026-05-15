import type { StorybookConfig } from "@storybook/react-webpack5";
// import autoprefixer from "autoprefixer";
import * as sass from "sass";

import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

process.env.STORYBOOK = "true";

const config: StorybookConfig = {
    stories: ["../src/scripts/ui/**/*.stories.@(ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        // "@storybook/addon-a11y",
        // "@storybook/addon-docs",
        // "@storybook/addon-onboarding",
        "@storybook/addon-postcss",
    ],
    framework: "@storybook/react-webpack5",

    webpackFinal: async (config) => {
        const postcssOptions = {
            postcssOptions: {
                plugins: [tailwindcss, autoprefixer],
            },
        };

        // ── 1. Remove default CSS rule Storybook injects ──────────────────
        config.module!.rules = config.module!.rules!.filter((rule) => {
            if (rule && typeof rule === "object" && "test" in rule) {
                return !rule.test?.toString().includes("css");
            }
            return true;
        });

        // ── 2. SCSS rule (global + includes) ─────────────────────────────
        config.module?.rules?.push({
            test: /\.scss$/,
            use: [
                // style-loader injects CSS into DOM at runtime (dev only)
                "style-loader",
                // css-loader resolves @import and url()
                {
                    loader: "css-loader",
                    options: {
                        // No CSS modules — we use global SCSS
                        modules: false,
                        sourceMap: true,
                    },
                },
                // postcss handles Tailwind + autoprefixer
                {
                    loader: "postcss-loader",
                    options: postcssOptions,
                },
                // sass-loader compiles SCSS → CSS
                {
                    loader: "sass-loader",
                    options: {
                        implementation: sass,
                        sourceMap: true,
                        sassOptions: {
                            // Tell sass-loader to watch imported partials too,
                            // so HMR triggers on ANY @use / @import change.
                            includePaths: ["src/styles"],
                        },
                    },
                },
            ],
        });

        // ── 3. Plain CSS rule ─────────────────────────────────────────────
        config.module?.rules?.push({
            test: /\.css$/,
            use: [
                "style-loader",
                { loader: "css-loader", options: { sourceMap: true } },
                { loader: "postcss-loader", options: postcssOptions },
            ],
        });

        // ── 4. Enable proper HMR / watch for nested SCSS partials ─────────
        config.watchOptions = {
            // Poll as a fallback on Windows (WSL2 / NTFS watchers can miss events)
            poll: 1000,
            ignored: /node_modules/,
            aggregateTimeout: 300,
        };
        return config;
    },
};
export default config;
