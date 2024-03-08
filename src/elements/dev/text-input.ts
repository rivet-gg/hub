import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { cssify } from '../../utils/css';
import styles from './text-input.scss';
import { classMap } from 'lit/directives/class-map.js';
import utils from '../../utils/utils';

const I32_MIN = -2147483648;
const I32_MAX = 2147483647;

export class InputUpdateEvent extends Event {
	constructor(public value: string) {
		super('input');
	}
}

export class InputChangeEvent extends Event {
	constructor(public value: string) {
		super('change');
	}
}

@customElement('text-input')
export default class TextInput extends LitElement {
	static styles = cssify(styles);

	@property({ type: String })
	version = 'v1';

	@property({ type: Boolean })
	area = false;

	@property({ type: String })
	init = '';

	@property({ type: Boolean })
	number = false;

	// Pads number with zeros
	@property({ type: Number, attribute: 'zero-padding' })
	zeroPadding: number = null;

	@property({ type: Boolean })
	light = false;

	@property({ type: Boolean })
	seamless = false;

	value = '';

	@property({ type: String })
	placeholder = 'Enter some text...';

	@property({ type: Boolean })
	password = false;

	@property({ type: Boolean })
	spellcheck = false;

	@property({ type: Number })
	maxlength = 32;

	@property({ type: Boolean })
	readonly = false;

	@property({ type: Number })
	min: number = I32_MIN;

	@property({ type: Number })
	max: number = I32_MAX;

	@property({ type: Boolean, attribute: 'disabled' })
	isDisabled = false;

	// Truncates text via native text input maxlength property instead of via code points
	@property({ type: Boolean, attribute: 'native-maxlength' })
	nativeMaxLength = false;

	@query('input, textarea')
	inputNode: HTMLInputElement | HTMLTextAreaElement;

	// Use to alter the allowed content in the text input (ex: value => value.replace(/\s/, '-'))
	@property({ type: Object })
	filter: (value: string) => string = null;

	firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		if (changedProperties.has('init')) {
			this.init = this.formatValue(this.init);
		}
	}

	onChange(event: Event) {
		event.stopImmediatePropagation();

		let target = event.target as HTMLInputElement;
		let newValue = this.formatValue(target.value);

		target.value = newValue;

		// Only dispatch event if value updated
		if (this.value != newValue) {
			this.value = newValue;

			this.dispatchEvent(new InputUpdateEvent(this.value));
		}

		this.dispatchEvent(new InputChangeEvent(this.value));
	}

	onInput(event: Event) {
		event.stopImmediatePropagation();

		let target = event.target as HTMLInputElement;
		let newValue = target.value;

		if (this.number) {
			// Parse value
			let value = parseInt(newValue.replace(/\D+/g, ''));

			if (isNaN(value)) {
				newValue = '';
			} else {
				// Clamp value
				if (this.max !== undefined) value = Math.min(value, this.max);

				if (this.zeroPadding != null) {
					let match = newValue.match(/^0+/);
					newValue = `${match ? match[0] : ''}${value == 0 ? '' : value.toString()}`.slice(
						-this.zeroPadding
					);
				} else {
					newValue = value.toString();
				}
			}
		} else if (this.filter) {
			newValue = this.filter(target.value);
		}

		// Truncate by codepoint
		if (!this.nativeMaxLength) newValue = utils.truncateAtCodePoint(newValue, this.maxlength);

		target.value = newValue;
		this.value = newValue;

		let validValue = true;

		if (this.number) {
			if (this.value.length == 0 || (this.min !== undefined && parseInt(this.value) < this.min)) {
				validValue = false;
			}
		}

		if (validValue) this.dispatchEvent(new InputUpdateEvent(this.value));
	}

	formatValue(value: string) {
		let newValue = value;

		if (this.number) {
			// Set to default number value if input is left empty
			if (newValue.length == 0 || parseInt(newValue) < this.min) {
				newValue = this.min !== undefined ? Math.max(0, this.min).toString() : '0';
			}

			// Pad number
			if (this.zeroPadding != null) {
				newValue = `${'0'.repeat(this.zeroPadding)}${newValue}`.slice(-this.zeroPadding);
			}
			// Format number
			else {
				newValue = parseInt(newValue).toString();
			}
		} else if (this.filter) {
			newValue = this.filter(newValue);
		}

		return newValue;
	}

	focus() {
		super.focus();

		this.inputNode.focus();
	}

	clear() {
		this.value = '';
		this.inputNode.value = '';
	}

	async reset() {
		this.value = null;
		this.init = this.formatValue(this.init);
		this.requestUpdate();
	}

	render() {
		let classes = classMap({
			light: this.light,
			seamless: this.seamless,
			disabled: this.isDisabled
		});

		if (this.area) {
			return html`
				<div id="base" class=${classes}>
					<textarea
						.placeholder=${this.placeholder}
						.value=${this.value || this.init}
						.maxLength=${this.maxlength}
						?disabled=${this.isDisabled}
						@input=${this.onInput.bind(this)}
						@change=${this.onChange.bind(this)}
					>
					</textarea>
				</div>
			`;
		} else {
			if (this.light) {
				// TODO: use tailwind variants
				return html`
					<input
						class="w-full text-xs ring-1 text-charcole-950 ring-charcole-900 ring-inset border-none focus:ring-2 focus:border-none focus:ring-inset focus:ring-main-accent hover:ring-2 hover:ring-inset hover:ring-main-accent"
						type=${this.password ? 'password' : 'text'}
						.placeholder=${this.placeholder}
						.spellcheck=${this.spellcheck}
						.value=${this.value || this.init}
						.maxLength=${this.maxlength}
						?readonly=${this.readonly}
						?disabled=${this.isDisabled}
						@input=${this.onInput.bind(this)}
						@change=${this.onChange.bind(this)}
					/>
				`;
			}
			return html`
				<div id="base" class=${classes}>
					<input
						type=${this.password ? 'password' : 'text'}
						.placeholder=${this.placeholder}
						.spellcheck=${this.spellcheck}
						.value=${this.value || this.init}
						.maxLength=${this.maxlength}
						?readonly=${this.readonly}
						?disabled=${this.isDisabled}
						@input=${this.onInput.bind(this)}
						@change=${this.onChange.bind(this)}
					/>
				</div>
			`;
		}
	}
}
