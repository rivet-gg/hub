const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts}'],
	theme: {
		fontFamily: {
			sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
			display: ['Cartridge', 'ui-sans-serif', 'system-ui'],
			pixel: ['Silkscreen', 'ui-sans-serif', 'system-ui']
		},
		extend: {
			boxShadow: {
				['foldup-lg']: 'var(--tw-shadow-color) 0px 6px 0px 0px',
				['foldup-md']: 'var(--tw-shadow-color) 0px 4px 0px 0px',
				['foldup-sm']: 'var(--tw-shadow-color) 0px 2px 0px 0px',
				['foldup-none']: 'var(--tw-shadow-color) 0px 0px 0px 0px'
			},
			screens: {
				mdLg: '1100px'
			},
			colors: {
				'button-bg-hover-color': '#ffffff05',
				'base-bg': '#18181b', // Also change this in html/index.html and html/static-styles.css
				'raised-bg': '#FFFFFF17',
				'raised-bg-border-color': '#525252',
				'lowered-bg': '#00000020',
				'context-menu': '#262626',
				'raised-hover': '#FFFFFF27',
				'muted-text': '#737373',
				'main-accent': '#7f56d9'
			},
			maxWidth: {
				contentwidth: '1100px'
			},
			translate: {
				'.05': '.05rem'
			},
			zIndex: {
				navigation: '4'
			},
			gridTemplateColumns: {
				'sidebar-layout': '18rem calc(100vw - 18rem)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		plugin(function ({ addBase, theme }) {
			addBase({
				h1: { fontFamily: theme('fontFamily.display') },
				h2: { fontFamily: theme('fontFamily.display') },
				h3: { fontFamily: theme('fontFamily.display') }
			});
		})
	]
};
