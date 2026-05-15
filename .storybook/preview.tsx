// // .storybook/preview.ts
import "../src/scripts/ui/context/__mocks__/setup";
import "../src/styles/style.scss"; // your Tailwind + SCSS

import type { Preview } from "@storybook/react-webpack5";
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
            // Replicates WhatsApp Web's root layout:
            // div#app > div.two (flex row, full viewport, positioned)
            <div id="app" className="absolute top-[0] left-[0] overflow-hidden m-0 p-0 w-screen h-screen">
                {/* Simulates div.two — the main chat area sibling */}
                <div className="two flex h-full flex-col"></div>
                <div id="wayfu-root">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export default preview;
