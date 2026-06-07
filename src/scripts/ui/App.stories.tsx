import type { Meta, StoryObj } from "@storybook/react";
import Main from "./Main";

const meta: Meta<typeof Main> = {
    title: "WayFu/Panel",
    component: Main,
    parameters: {
        // Override background per story
        backgrounds: { default: "wa-dark" },
        // Fixed position so FAB + panel render naturally
        layout: "fullscreen",
    },
};

export default meta;
type Story = StoryObj<typeof Main>;

// Default state — panel closed
export const Dark: Story = {
    args: { style: "dark" },
    parameters: {
        // Override background per story
        backgrounds: { default: "wa-dark" },
    },
};
// Default state — panel closed
export const Light: Story = {
    args: { style: "light" },
    parameters: {
        // Override background per story
        backgrounds: { default: "wa-light" },
    },
};
