import { createTV } from 'tailwind-variants';

const tv = createTV({
	// twMerge: false
});

export const button = tv({
	base: [
		'inline-flex',
		'm',
		'items-center',
		'align-middle',
		'will-change-transform',
		'min-w-30',
		'transition-all',
		'duration-100',
		'disabled:opacity-60',
		'aria-busy:cursor-default',
		'group',
		'text-center'
	],
	variants: {
		variant: {
			primary: [
				'relative font-bold gap-2 text-cream-100 fill-cream-100 border-cream-100 border transition-all',
				"before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-light-grain before:[image-rendering:pixelated] before:bg-blend-multiply before:transition-all before:opacity-0",
				"after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-dark-grain after:[image-rendering:pixelated] after:transition-all after:opacity-100"
			],
			link: ['text-cream-100 gap-2 font-bold px-0 mx-2'],
			secondary: [
				'text-white gap-2 fill-white bg-charcole-900 border-cream-100 border',
				'transition-all text-lg font-bold'
			],
			danger: 'border-red-500 gap-2 font-bold text-red-500 fill-red-500 border transition-all',
			// very specific types
			nav: ['text-cream-100 px-3.5 py-1.5 gap-2.5 font-normal font-display']
		},
		size: {
			sm: 'px-2 py-1 text-xs',
			md: 'px-4 py-2 text-sm',
			lg: 'px-6 py-4 text-base'
		}
	},
	compoundVariants: [
		{
			variant: 'primary',
			class: [
				// hover
				'hover:bg-cream-100 hover:text-charcole-950 hover:before:bg-cream-100 hover:fill-charcole-950',
				'hover:before:opacity-100 hover:after:opacity-0',
				// active
				'active:bg-cream-50',
				// disabled
				'disabled:border-cream-100 disabled:hover:bg-transparent disabled:hover:text-cream-100',
				'disabled:hover:before:opacity-0 disabled:hover:after:opacity-100',
				// loading
				'aria-busy:border-neutral-300 aria-busy:hover:bg-transparent aria-busy:translate-y-0 aria-busy:hover:text-white'
			]
		},
		{
			variant: 'link',
			class: [
				// hover
				'hover:text-white',
				// disabled
				'disabled:text-cream-100/60 disabled:hover:text-cream-100/60',
				// loading
				'aria-busy:text-white'
			]
		},
		{
			variant: 'link',
			size: 'sm',
			class: ['px-0 mx-2']
		},
		{
			variant: 'nav',
			size: 'md',
			class: [
				'px-3.5 py-1.5 text-lg',
				// hover
				'hover:text-white hover:bg-white/5',
				// selected
				'aria-current:border-white/10 aria-current:text-white aria-current:bg-white/5'
			]
		},
		{
			variant: 'danger',
			class: [
				// hover
				'hover:bg-red-500/15',
				// active
				'hover:bg-red-500/20',
				// disabled
				'disabled:border-red-300 disabled:hover:bg-transparent disabled:translate-y-0 disabled:hover:text-red-500 disabled:hover:fill-red-500',
				// loading
				'aria-busy:border-red-300 aria-busy:hover:bg-transparent aria-busy:translate-y-0 aria-busy:hover:text-red-500 aria-busy:hover:fill-red-500'
			]
		},
		{
			variant: 'secondary',
			class: [
				// hover
				'hover:bg-charcole-800',
				// active
				'active:bg-charcole-700 aria-selected:bg-charcole-600',
				// disabled
				'disabled:bg-charcole-900',
				// loading
				'aria-busy:bg-charcole-900'
			]
		}
	],
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
});

export const icon = tv({
	variants: {
		size: { sm: 'h-2.5 w-2.5', md: 'h-5 w-5', lg: 'h-6 w-6' },
		variant: {
			primary: '',
			secondary: '',
			link: '',
			danger: '',
			// custom variants
			nav: 'text-cream-100 group-hover:text-white transition-all'
		}
	},
	compoundVariants: [
		{
			variant: 'nav',
			size: 'md',
			class: 'h-4 w-4'
		}
	]
});

export type ButtonVariants = (typeof button)['variants'];

export type ButtonVariant = keyof ButtonVariants['variant'];
export type ButtonSize = keyof ButtonVariants['size'];
