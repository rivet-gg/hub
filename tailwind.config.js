const plugin = require('tailwindcss/plugin');
const tailwindPalettes = require('./src/styles/pallete/tailwind.json');

const palettesMap = tailwindPalettes.reduce((acc, curr) => {
	acc[curr.paletteName] = curr;
	return acc;
}, {});

const converPalletteToTailwind = palette =>
	palette.swatches.reduce((acc, curr) => {
		acc[curr.name] = `#${curr.color}`;
		return acc;
	}, {});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts}'],
	theme: {
		fontFamily: {
			sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
			display: ['Cartridge', 'ui-sans-serif', 'system-ui'],
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
			colors: {
				'button-bg-hover-color': '#ffffff05',
				'base-bg': '#18181b', // Also change this in html/index.html and html/static-styles.css
				'raised-bg': '#FFFFFF17',
				'raised-bg-border-color': '#525252',
				'lowered-bg': '#00000020',
				'context-menu': '#262626',
				'raised-hover': '#FFFFFF27',
				'muted-text': '#737373',
				'main-accent': '#7f56d9',
				violet: converPalletteToTailwind(palettesMap['Violet']),
				zinc: converPalletteToTailwind(palettesMap['Zinc'])
			},
			scale: {
				98: '.98'
			},
			maxWidth: {
				contentwidth: '1100px'
			},
			translate: {
				'.05': '.05rem'
			},
			zIndex: {
				navigation: '4',
				overlay: '6'
			},
			gridTemplateColumns: {
				'sidebar-layout': '18rem calc(100vw - 18rem)'
			},
			aria: {
				busy: 'busy'
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
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					foldup: value => ({
						boxShadow: value
					})
				},
				{ values: theme('foldups') }
			);
		})
	]
};
