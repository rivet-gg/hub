import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { cssify } from '../../utils/css';
import clsx from 'clsx';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('rvt-sidebar-layout')
export default class Layout extends LitElement {
	static styles = cssify();

	render() {
		return html`
			<div class="grid lg:grid-cols-sidebar-layout min-h-full gap-5">
				<!-- Sidebar -->
				<div class="flex flex-col border-white/10 lg:border-r">
					<div class="min-h-full lg:overflow-y-auto w-full h-full mt-8">
						<slot name="sidebar"></slot>
					</div>
				</div>

				<!-- Main -->
				<main class="w-full mt-8">
					<slot name="body"></slot>
				</main>
			</div>
		`;
	}
}

@customElement('rvt-sidebar')
export class Sidebar extends LitElement {
	static styles = cssify();

	render() {
		return html`
			<ul role="list" class="flex flex-1 flex-col gap-y-7">
				<slot></slot>
			</ul>
		`;
	}
}

@customElement('rvt-sidebar-body')
export class Body extends LitElement {
	static styles = cssify();

	render() {
		return html` <div><slot></slot></div> `;
	}
}

@customElement('rvt-sidebar-group')
export class Group extends LitElement {
	static styles = cssify();

	@property({ type: String })
	title: string;

	render() {
		return html`
			<li>
				${when(
					this.title,
					() => html`<div class="text-lg leading-6 text-white font-display">${this.title}</div>`
				)}
				<ul role="list" class="-mx-2 mt-2 space-y-1">
					<slot></slot>
				</ul>
			</li>
		`;
	}
}

@customElement('rvt-sidebar-button')
export class Button extends LitElement {
	static styles = cssify();

	@property({ type: String })
	href?: string;

	@property({ type: String })
	target?: string;

	@property({ type: Function })
	trigger?: () => void;

	@property({ type: Boolean, attribute: 'current' })
	current: boolean;

	@property({ type: String })
	icon: string;

	render() {
		return html`
			<li>
				<a
					.href=${ifDefined(this.href)}
					.target=${ifDefined(this.target)}
					@click=${ifDefined(this.trigger)}
					class=${clsx(
						this.current
							? 'opacity-100 cursor-default'
							: 'opacity-60 hover:opacity-100 hover:cursor-pointer',
						'group flex gap-x-3 rounded-md p-2 text-white text-sm items-center leading-6 font-semibold transition'
					)}
				>
					${when(
						this.icon,
						() =>
							html`<e-svg
								.src=${this.icon}
								class="h-4 w-4 shrink-0"
								aria-hidden="true"
							></e-svg>`
					)}
					<span class="truncate"><slot></slot></span>
				</a>
			</li>
		`;
	}
}
