const colors = require('./src/assets/styles/color');
const flowbite = require("flowbite-react/tailwind");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
        flowbite.content(),
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif", 'Playfair Display', 'Raleway', 'Cormorant Garamond'], // Set Poppins as the default sans-serif font
            },
            colors: {
                background: 'linear-gradient(180deg, #FFFDFB 0%, #FFFAF0 100%)',
                primary: colors.primary,
                accent: colors.accent,
                'secondary-accent': colors.secondaryAccent,
                'text-primary': colors.textPrimary,
                'text-secondary': colors.textSecondary,
                'light-gray': colors.lightGray,
                'dark-gray': colors.darkGray,
                error: colors.error,
                warning: colors.warning,
                'light-warning': colors.lightWarning,
                success: colors.success,
                'background-alt': colors.backgroundAlt,
                'background-highlight': colors.backgroundHighlight,
                'button-highlight': colors.buttonHighlight,
                'card-background': colors.cardBackground,
                'text-highlight': colors.textHighlight,
                'header-background': colors.headerBackground,
                highlight: "#FFECEB"
            },
            transitionTimingFunction: {
                "ease-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
            borderWidth: {
                thin: "1px",
            },
            boxShadow: {
                card: "0px 4px 8px rgba(0, 0, 0, 0.05)",
            },
            transitionDuration: {
                fast: "200ms",
            },
        },
        components: {
            '.btn-primary': {
                '@apply bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition': {},
            },
            '.btn-secondary': {
                '@apply bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition': {},
            },
            '.btn-danger': {
                '@apply bg-error text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition': {},
            },
            '.input-field': {
                '@apply w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary': {}
            },
            '.text-error': {
                '@apply text-error text-sm': {}
            },
            '.sidebar': {
                '@apply w-64 bg-gray-800 text-white h-full fixed': {},
            },

            '.sidebar a': {
                '@apply block px-4 py-2 hover:bg-gray-700': {}
            },
            '.sidebar a.active': {
                '@apply bg-gray-700': {}
            },
            '.main-content': {
                ' @apply ml-64 p-6 w-full bg-gray-100 min-h-screen': {}
            }, '.sidebar-item': {
                '@apply flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300': {},
            },
            '.sidebar-item.active': {
                '@apply bg-accent text-white font-bold border-l-4 border-primary shadow-md': {},
            },
            '.sidebar-item:hover': {
                '@apply bg-secondary-accent text-text-primary': {},
            },
            '.sidebar-submenu': {
                '@apply ml-8 text-sm text-dark-gray': {},
            },
            '.sidebar-submenu a': {
                '@apply block px-4 py-2 rounded-md hover:bg-secondary-accent hover:text-text-primary': {},
            },
        }

    },
    plugins: [flowbite.plugin(), new NodePolyfillPlugin()],
}
;
