const defaultConfig = require('tailwindcss/defaultConfig')

module.exports = {
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1280px',
        },
        fontSize: {
            'xs': '.5rem',
            'sm': '.75rem',
            'base': '0.875rem',
            'lg': '1rem',
            'xl': '1.125rem',
            '2xl': '1.25rem',
            '3xl': '1.5rem',
            '4xl': '2rem',
            '5xl': '3rem',
            '6xl': '4rem',
            '7xl': '5rem',
        },
        extend: {
            spacing: {
                '2px': '2px',
                '7': '1.75rem',
                '10': '2.5rem',
                '12': '3rem',
                '16': '4rem',
                '20': '5rem',
                '24': '6rem',
                '28': '7rem',
                '32': '8rem',
                '80': '20rem',
                '128': '32rem',
                '(screen-16)': 'calc(100vh - 4rem)',
            },
            inset: {
                '16': '4rem',
                '20': '5rem',
                '24': '6rem',
            },
            borderWidth: {
                '6': '6px',
            },
            maxWidth: theme => {
                return {
                    'screen-xl': theme('screens.xl'),
                }
            },
            maxHeight: {
                xs: '20rem',
                sm: '30rem',
                '(screen-16)': 'calc(100vh - 4rem)',
            },
            boxShadow: {
                'md-light': '0 0 12px 8px rgb(255,255,255)',
                'md-bottom': '0 3px 1px 0 rgba(0,0,0,0.05)',
                'md-bottom-inner': 'inset 0 3px 1px 0 rgba(0,0,0,0.06)',
            },
            zIndex: {
                '90': '90',
                '100': '100',
            }
        },
    },
    variants: {
        backgroundColor: ['responsive', 'odd', 'even', 'hover', 'focus', 'group-hover'],
        borderColor: ['responsive', 'hover', 'focus'],
        borderWidth: ['responsive', 'first', 'last', 'hover', 'focus'],
        opacity: ['responsive', 'hover', 'focus', 'disabled'],
        visibility: ['group-hover'],
        cursor: ['disabled']
    },
    plugins: [
        require('@tailwindcss/custom-forms')
    ]
}