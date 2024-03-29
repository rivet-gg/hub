const plugin = require('tailwindcss/plugin');
const colors = require('./colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts}'],
	theme: {
		fontFamily: {
			sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
			display: ['Perfectly Nineties', 'ui-sans-serif', 'system-ui'],
			pixel: ['Silkscreen', 'ui-sans-serif', 'system-ui'],
			mono: ['Fira Code', 'monospace']
		},
		transformStyle: {
			flat: 'flat',
			'3d': 'preserve-3d'
		},
		foldups: {
			lg: 'var(--tw-shadow-color) 0px 6px 0px 0px',
			md: 'var(--tw-shadow-color) 0px 4px 0px 0px',
			sm: 'var(--tw-shadow-color) 0px 2px 0px 0px',
			none: 'var(--tw-shadow-color) 0px 0px 0px 0px'
		},
		extend: {
			screens: {
				mdLg: '1100px'
			},
			colors: args => ({
				'button-bg-hover-color': '#ffffff05',
				'base-bg': '#18181b', // Also change this in html/index.html and html/static-styles.css
				'raised-bg': '#FFFFFF17',
				'raised-bg-border-color': '#525252',
				'lowered-bg': '#00000020',
				'context-menu': '#262626',
				'raised-hover': '#FFFFFF27',
				'muted-text': '#737373',
				'main-accent': "theme('colors.orange.300')",
				...colors(args)
			}),
			scale: {
				98: '.98'
			},
			maxWidth: {
				contentwidth: '80rem'
			},
			translate: {
				'.05': '.05rem'
			},
			zIndex: {
				navigation: '4',
				overlay: '6'
			},
			gridTemplateColumns: {
				'sidebar-layout': '15rem calc(100% - 15rem)'
			},
			aria: {
				busy: 'busy',
				selected: 'selected'
			},
			boxShadow: {
				elevated: '10px 10px 0 white'
			},
			backgroundImage: {
				'user-banner': `url("${process.env.ASSETS_URL}/background/mounds-1.png")`,
				'game-tile': `url("${process.env.ASSETS_URL}/games/tile.png")`,
				'dark-grain': `url("${process.env.ASSETS_URL}/effects/grain-dark.png")`,
				'light-grain': `url("${process.env.ASSETS_URL}/effects/grain-light.png")`
			},
			borderWidth: {
				2: '2px'
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
		}),
		/**
		 * Adds translate-z utilities.
		 * Accepts negative values, responds to responsive styles, modify possible values in 'transform' theme key.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateZ}
		 * @example
		 * <div class="translate-z-10"></div>
		 * <div class="-translate-z-1"></div>
		 */
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					'translate-z': value => ({
						'--tw-translate-z': value,
						transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
					})
				},
				{ values: theme('translate'), supportsNegativeValues: true }
			);
		}),
		/**
		 * Adds transform-style utilities.
		 * Modify possible values in 'transformStyle' theme key.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style|MDN}
		 * @example
		 * <div class="transform-style-none"></div>
		 * <div class="transform-style-3d"></div>
		 */
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					'transform-style': value => ({
						'transform-style': value
					})
				},
				{ values: theme('transformStyle') }
			);
		}),
		plugin(({ addComponents }) => {
			addComponents({
				'.retro-elevated': {
					borderWidth: "theme('borderWidth.2')",
					borderColor: "theme('colors.white')",
					boxShadow: "theme('boxShadow.elevated')",
					margin: 'theme(margin.1) theme(margin.4) theme(margin.4) theme(margin.1)',
					backgroundColor: "theme('colors.charcole.950')"
				}
			});
		})
	]
};
