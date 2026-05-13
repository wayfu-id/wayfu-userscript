import type { StorybookConfig } from "@storybook/react-webpack5";
// import autoprefixer from "autoprefixer";
import * as sass from "sass";

import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const config: StorybookConfig = {
    stories: ["../src/scripts/ui/**/*.stories.@(ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
    ],
    framework: "@storybook/react-webpack5",

    webpackFinal: async (config) => {
        const postcssOptions = {
            postcssOptions: {
                plugins: [tailwindcss, autoprefixer],
            },
        };

        config.module!.rules = config.module!.rules!.filter((rule) => {
            if (rule && typeof rule === "object" && "test" in rule) {
                return !rule.test?.toString().includes("css");
            }
            return true;
        });

        config.module?.rules?.push({
            test: /\.scss$/,
            use: [
                "style-loader", // injects CSS into DOM (dev only)
                "css-loader", // resolves @import, url(),
                { loader: "postcss-loader", options: postcssOptions },
                { loader: "sass-loader", options: { implementation: sass } },
            ],
        });

        // Plain CSS rule
        config.module?.rules?.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader", { loader: "postcss-loader", options: postcssOptions }],
        });

        return config;
    },
};
export default config;
