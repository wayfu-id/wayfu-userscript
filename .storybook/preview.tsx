// // .storybook/preview.ts
import "../src/scripts/ui/context/__mocks__/setup";
import type { Preview } from "@storybook/react-webpack5";
import "../src/styles/style.scss"; // your Tailwind + SCSS

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: "wa-dark",
            values: [
                { name: "wa-dark", value: "#111B21" },
                { name: "wa-light", value: "#F0F2F5" },
            ],
        },
    },
    decorators: [
        (Story) => (
            <div id="wayfu-root">
                <Story />
            </div>
        ),
    ],
};

export default preview;
