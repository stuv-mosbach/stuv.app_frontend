const colors = require("tailwindcss/colors");

module.exports = {
    //mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './util/**/*.{js,ts}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors
        },
    },
    variants: {
        extend: {
            backgroundOpacity: ['active'],
            scale: ['group-hover'],
            opacity: ['disabled'],
            cursor: ['hover', 'focus', 'disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/custom-forms'),
    ],
}
