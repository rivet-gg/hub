import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { choose } from 'lit/directives/choose.js';
import { cssify } from '../../utils/css';
import { GlobalStatus } from '../../utils/global';
import { globalEventGroups, GlobalStatusChangeEvent } from '../../utils/global-events';
import global from '../../utils/global';
import { Rivet } from '@rivet-gg/api';

@customElement('rvt-user-consent')
export class RvtUserConsent extends LitElement {
	static styles = cssify();

	status = GlobalStatus.Consenting;

	handleStatusChange: (e: GlobalStatusChangeEvent) => void;

	connectedCallback() {
		super.connectedCallback();

		this.handleStatusChange = this.onStatusChanged.bind(this);
		globalEventGroups.add('status-change', this.handleStatusChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		globalEventGroups.remove('status-change', this.handleStatusChange);
	}

	onStatusChanged(e: GlobalStatusChangeEvent) {
		this.status = e.value;
		this.requestUpdate('status');
	}

	private dispatchLogin() {
		this.dispatchEvent(new CustomEvent('login'));
	}

	render() {
		return html`
			<div class="flex flex-col items-center justify-center text-center p-4 pb-8 self-center">
				<e-svg class="w-16 h-auto" src="logo/cream" non-icon preserve></e-svg>
				<!-- Header -->
				${choose(global.bootstrapData.cluster, [
					[
						Rivet.cloud.BootstrapCluster.Oss,
						() => html`<h1 class="text-5xl mt-3.5 mb-8">Welcome to Rivet OSS!</h1>`
					],
					[
						Rivet.cloud.BootstrapCluster.Enterprise,
						() => html`<h1 class="text-5xl mt-3.5 mb-8 text-cream-100">Welcome to Rivet!</h1>`
					]
				])}

				<!-- Login methods -->
				${when(
					global.bootstrapData.loginMethods.accessToken,
					() =>
						html`<p class="text-lg">Login using the CLI with the command below:</p>
							<rvt-copy-area
								value="bolt admin login"
								class="block w-[240px] my-5"
							></rvt-copy-area>
							${when(
								global.bootstrapData.loginMethods.email,
								() => html`<p class="text-lg mb-4">Or login via email:</p>`
							)}`
				)}
				${when(
					global.bootstrapData.loginMethods.email,
					() => html`
						<div class="w-full flex m-auto text-left items-center justify-center gap-4">
							<rvt-button
								.loading=${![
									GlobalStatus.Consenting,
									GlobalStatus.Unregistered,
									GlobalStatus.Connected
								].includes(this.status)}
								@click="${this.dispatchLogin.bind(this)}"
							>
								Register or Login
							</rvt-button>
						</div>
						<div class="w-3/4 border-b-white/10 border-b-[1px] h-px mx-auto my-6"></div>
						<p class="text-charcole-400 text-xs">
							By clicking Register or Login, you agree to the Rivet
							<a class="hover:underline" href="https://rivet.gg/terms" target="_blank"
								>Terms of Service</a
							>
							and
							<a class="hover:underline" href="https://rivet.gg/privacy" target="_blank">
								Privacy Policy</a
							>.
						</p>
					`
				)}
			</div>
		`;
	}
}
