import { LitElement, PropertyValues, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { cssify } from '../../utils/css';
import global from '../../utils/global';
import routes, { responses } from '../../routes';
import styles from './access-token.scss';
import { globalEventGroups, IdentityChangeEvent } from '../../utils/global-events';

@customElement('page-access-token')
export default class AccessTokenLink extends LitElement {
	static styles = cssify(styles);

	@property({ type: String })
	token: string;

	@property({ type: Object })
	loadError?: any;

	@property({ type: Boolean })
	finished: boolean = false;

	/// === EVENTS ===
	handleIdentityChange: (e: IdentityChangeEvent) => void;

	firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		if (global.currentIdentity?.isAdmin) this.finished = true;
		else this.fetchData();
	}

	connectedCallback() {
		super.connectedCallback();

		this.handleIdentityChange = this.onIdentityChange.bind(this);
		globalEventGroups.add('identity-change', this.handleIdentityChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		globalEventGroups.remove('identity-change', this.handleIdentityChange);
	}

	// Update render display when identity is updated
	onIdentityChange() {
		if (global.currentIdentity?.isAdmin) this.finished = true;
		else throw new Error('Identity not made into admin');
	}

	async fetchData() {
		try {
			await global.api.auth.identity.accessToken.completeAccessTokenVerification({
				accessToken: this.token
			});

			// Refresh token
			await global.authManager.fetchToken(true);
		} catch (err) {
			this.loadError = err;
		}
	}

	render() {
		if (this.loadError) return responses.renderError(this.loadError);

		return html`<div id="base" class="flex flex-col items-center justify-center h-full">
			${when(
				this.finished,
				() =>
					html`<h2 class="text-4xl text-[#ececec] m-0 mb-2">
							<e-svg src="solid/circle-check"></e-svg>Login succeeded
						</h2>
						<p class="m-0 font-semibold text-[#ececec]">
							No further action is required. You may now return to the home page.
						</p>
						<rvt-button type="a" href=${routes.home.build({})} class="mt-3">Home</rvt-button>`,
				() => html`<loading-wheel></loading-wheel>`
			)}
		</div>`;
	}
}
