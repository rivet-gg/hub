/* eslint-disable no-mixed-spaces-and-tabs */
import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { cssify } from '../../utils/css';
import styles from './register-panel.scss';
import global from '../../utils/global';
import { classMap } from 'lit/directives/class-map.js';
import { responses } from '../../routes';
import logging from '../../utils/logging';
import TextInput from '../dev/text-input';
import { when } from 'lit/directives/when.js';
import * as api from '../../utils/api';
import RvtRoot from '../root/rvt-root';
import { globalEventGroups, IdentityChangeEvent } from '../../utils/global-events';
import { createError } from '../common/rvt-error';

export const VALIDATE_EMAIL =
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

@customElement('register-panel')
export default class RegisterPanel extends LitElement {
	static styles = cssify(styles);

	@property({ type: String })
	email = '';

	@property({ type: String })
	code = '';

	@property({ type: String })
	verificationId: string = null;

	@property({ type: String })
	emailError = '';

	@property({ type: String })
	codeError = '';

	@property({ type: String })
	loadingMessage = '';

	@property({ type: Boolean })
	isCompleting = false;

	@property({ type: Boolean })
	codeAreaActive = false;

	@property({ type: Boolean })
	wait = false;

	@property({ type: Boolean, attribute: 'light' })
	light = false;

	@property({ type: String, attribute: 'title' })
	title: string;

	@property({ type: String, attribute: 'description' })
	description: string;

	@property({ type: Boolean, attribute: 'no-back' })
	noBackButton = false;

	// Used for customizing the email
	@property({ type: String })
	gameId: string = null;

	@property({ type: Object })
	loadError?: any;

	@query('#email-input')
	emailInput: TextInput;

	@query('#code-input')
	codeInput: TextInput;

	/// === EVENTS ===
	handleIdentityChange: (e: IdentityChangeEvent) => void;

	connectedCallback() {
		super.connectedCallback();

		this.handleIdentityChange = this.onIdentityChange.bind(this);
		globalEventGroups.add('identity-change', this.handleIdentityChange);
	}

	onIdentityChange() {
		this.requestUpdate();
	}

	emailChange(event: Event) {
		let target = event.target as HTMLInputElement;

		this.email = target.value;

		if (!VALIDATE_EMAIL.test(this.email)) {
			this.email = '';
			this.emailError = 'Invalid email';
		} else this.emailError = null;
	}

	emailKeyPress(event: KeyboardEvent) {
		// Enter is pressed
		if (this.emailError == null && event.key == 'Enter') {
			this.startEmailVerification();
			this.emailInput.blur();
		}
	}

	codeChange(event: Event) {
		let target = event.target as HTMLInputElement;

		this.code = target.value;

		if (!this.code.trim().length) {
			this.codeError = 'Invalid code';
		} else this.codeError = null;
	}

	codeKeyPress(event: KeyboardEvent) {
		// Enter is pressed
		if (this.codeError == null && event.key == 'Enter') this.completeEmailVerification();
	}

	async startEmailVerification() {
		// Wait for captcha
		let captchaToken = null;
		try {
			if (global.bootstrapData.captcha.turnstile) {
				captchaToken = await RvtRoot.shared.promptCaptcha();
			}
			this.wait = true;
			this.codeError = null;

			let res = await global.deprecatedApi.auth.startEmailVerification({
				email: this.email.trim(),
				captcha: captchaToken
					? {
							turnstile: { clientResponse: captchaToken }
					  }
					: null,
				gameId: this.gameId
			});

			this.verificationId = res.verificationId;

			this.wait = false;
			this.codeAreaActive = true;
		} catch (err) {
			this.loadError = err;

			this.codeAreaClose();
		}
	}

	async completeEmailVerification() {
		this.isCompleting = true;

		try {
			let res = await global.deprecatedApi.auth.completeEmailVerification({
				verificationId: this.verificationId,
				code: this.code.trim()
			});

			this.isCompleting = false;
			this.codeError = null;
			this.code = null;

			if (res.status == api.auth.CompleteStatus.SWITCH_IDENTITY) {
				this.codeAreaClose();

				this.wait = true;
				this.loadingMessage = 'Switching accounts...';
				this.verificationId = null;

				// Refresh token
				await global.authManager.fetchToken(true);
				this.closeRegisterPanel();
				this.resetRegister();
			} else if (res.status == api.auth.CompleteStatus.LINKED_ACCOUNT_ADDED) {
				this.codeAreaClose();

				this.wait = true;
				this.loadingMessage = 'Success! Updating account status...';
				this.verificationId = null;

				// Wait for update
				await globalEventGroups.await('identity-change');
				this.closeRegisterPanel();
				this.resetRegister();
			} else if (res.status == api.auth.CompleteStatus.ALREADY_COMPLETE) {
				this.codeError = 'This verification session has already been completed.';
			} else if (res.status == api.auth.CompleteStatus.EXPIRED) {
				this.codeError = 'This verification session has expired. Please try again.';
			} else if (res.status == api.auth.CompleteStatus.TOO_MANY_ATTEMPTS) {
				this.codeError = 'Too many failed attempts. Try again later.';
			} else if (res.status == api.auth.CompleteStatus.INCORRECT) {
				this.codeError = 'The verification code given is incorrect.';
			} else {
				this.codeError = 'Unknown error';
				logging.error('Unknown error', res.status);
			}
		} catch (err) {
			this.loadError = err;

			this.codeAreaClose();
		}
	}

	codeAreaClose() {
		this.codeAreaActive = false;
		this.code = '';
		this.verificationId = null;
		if (this.codeInput) this.codeInput.clear();
	}

	focusInput() {
		if (this.emailInput) this.emailInput.focus();
	}

	resetRegister() {
		this.email = '';
		this.code = '';
		this.emailError = '';
		this.codeError = '';

		if (this.codeAreaActive) {
			this.emailInput.clear();
			this.codeInput.clear();
			this.codeAreaClose();
		}
	}

	closeRegisterPanel() {
		this.dispatchEvent(new Event('close'));
	}

	async logout() {
		await global.authManager.logout();
	}

	// === RENDER ===
	render() {
		if (this.loadError) return createError(this.loadError);

		let classes = classMap({
			loading: this.wait,
			light: this.light
		});

		return html`
			<div id="base" class=${classes}>
				${this.codeAreaActive ? this.renderCodeArea() : this.renderEmailArea()}
				${this.wait
					? html`<div id="loading-overlay">
							<loading-wheel .message=${this.loadingMessage}></loading-wheel>
					  </div>`
					: null}
			</div>
		`;
	}

	renderEmailArea() {
		// Get email from current identity
		let identity = global.currentIdentity.linkedAccounts.find(a => a.email);
		// Check if registered (with email)
		let isRegistered = global.currentIdentity.isRegistered && !!identity;

		return html`<div id="email-area">
			<h1>${this.title ?? 'Register or Login'}</h1>
			${when(
				isRegistered,
				() =>
					html`<div id="registered">
						<p>
							Your account is already registered.<br /><span id="email"
								>Email: ${identity.email.email}</span
							>
						</p>
						<rvt-button
							class="ml-4"
							icon="solid/arrow-right-from-bracket"
							variant="danger"
							@click=${this.logout.bind(this)}
							>Log out</rvt-button
						>
					</div>`,
				() =>
					html`<p>
							${this.description ??
							html`Enter your email below to register a Rivet account or login to an existing
							account.`}
						</p>
						<div id="input-area">
							<h3>Email</h3>
							<text-input
								version="v2"
								id="email-input"
								.light=${this.light}
								?disabled=${isRegistered}
								placeholder="Enter email here..."
								maxlength="320"
								@keydown=${this.emailKeyPress.bind(this)}
								@input=${this.emailChange.bind(this)}
							></text-input>
						</div>

						<div class="actions space-x-2">
							${this.noBackButton
								? null
								: html`<rvt-button
										variant="secondary"
										@click=${this.closeRegisterPanel.bind(this)}
										>Back</rvt-button
								  >`}
							<rvt-button
								?disabled=${this.emailError != null}
								@click=${this.startEmailVerification.bind(this)}
								>Continue</rvt-button
							>
						</div>
						${this.emailError != null ? html`<p id="error">${this.emailError}</p>` : null}`
			)}
		</div>`;
	}

	renderCodeArea() {
		return html`<div id="code-area">
			<e-svg non-icon preserve src="graphics/email"></e-svg>
			<h1>Email Verification Code</h1>
			<p>
				Check your email <b>(${this.email})</b> for a verification code from <b>hello@rivet.gg</b> and
				paste it into the area below.
			</p>
			<text-input
				id="code-input"
				.light=${this.light}
				placeholder=""
				maxlength="8"
				@input=${this.codeChange.bind(this)}
				@keydown=${this.codeKeyPress.bind(this)}
				.filter=${(value: string) => value.replace(/[^a-z0-9]/gi, '').toUpperCase()}
			>
			</text-input>
			${this.codeError != null ? html`<p id="error">${this.codeError}</p>` : null}
			<div class="actions space-x-2">
				<rvt-button variant="secondary" @click=${this.codeAreaClose.bind(this)}>Back</rvt-button>
				<rvt-button
					@click=${this.completeEmailVerification.bind(this)}
					?disabled=${this.codeError != null}
					?loading=${this.isCompleting}
					>Continue</rvt-button
				>
			</div>
		</div>`;
	}
}
