// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Tell Tailwind WHERE to scan for class names
    content: [
        "./src/scripts/ui/**/*.{tsx,jsx,ts,js}",
        "./src/scripts/ui/**/*.stories.{tsx,jsx,ts,js}",
        "./src/views/**/*.pug",
        "./assets/*.html",
        "./.storybook/**/*.{ts,tsx}",
    ],

    // Prefix all Tailwind classes to avoid clashing with WA's own CSS
    // prefix: "wf-",

    // Important: scope everything under #wayfu-root
    // so WayFu styles never leak into WhatsApp's UI
    important: "#wayfu-root",

    theme: {
        extend: {
            colors: {
                "wf-green": "#009A4B",
                "wf-blue1": "#1C8EBD",
                "wf-blue2": "#1C7DA6",
                "wf-orange": "#FFD279",
            },
        },
    },

    // Dark mode via data attribute — matches your [data-theme="dark"]
    darkMode: ["attribute", "data-theme"],

    plugins: [],
};
