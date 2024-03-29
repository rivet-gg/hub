import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cssify } from '../../utils/css';
import styles from './alert-panel.scss';
import { AlertPanelData } from '../root/rvt-root';

export class SelectOptionEvent extends Event {
	constructor(public index: number) {
		super('select');
	}
}

export interface AlertOption {
	label: string;
	destructive?: boolean;
	color?: string;
	cb?: () => any;
}

@customElement('alert-panel')
export default class AlertPanel extends LitElement {
	static styles = cssify(styles);

	@property({ type: Object })
	data: AlertPanelData;

	@property({ type: Boolean })
	active: boolean;

	async selectOption(index: number) {
		// Call the callback
		let option = this.data.options[index];
		if (option.cb) {
			let result = option.cb();

			if (result instanceof Promise) await result;
		}

		// Dispatch event
		this.dispatchEvent(new SelectOptionEvent(index));
	}

	render() {
		if (!this.data) return null;

		return html`
			<div id="base">
				<div id="title" class="font-display text-3xl">${this.data.title}</div>
				${this.data.details ? html`<div id="details">${this.data.details}</div>` : null}
				<div id="footer">
					<div id="options">
						${this.data.options.map(
							(option, idx) =>
								html`<rvt-button
									variant="${option.destructive ? 'danger' : 'primary'}"
									@click=${this.selectOption.bind(this, idx)}
									>${option.label}</rvt-button
								>`
						)}
					</div>
				</div>
			</div>
		`;
	}

	close() {
		// Dispatch event
		this.dispatchEvent(new SelectOptionEvent(0));
	}
}
