import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { cssify } from '../../utils/css';
import styles from './identity-tile.scss';
import routes from '../../routes';

import { identityRouteData } from '../../data/identity';
import utils from '../../utils/utils';
import { showIdentityContextMenu } from '../../ui/helpers';
import * as api from '../../utils/api';

@customElement('identity-tile')
export default class IdentityTile extends LitElement {
	static styles = cssify(styles);

	@property({ type: Object })
	identity: api.identity.IdentityHandle;

	@property({ type: Object })
	partyState: api.party.PartyMemberState;

	@property({ type: Boolean, attribute: 'offline-opacity' })
	offlineOpacity = false;

	@property({ type: Boolean, attribute: 'no-link' })
	noLink = false;

	@property({ type: Boolean, attribute: 'no-context-menu' })
	noContextMenu = false;

	@property({ type: Boolean, attribute: 'hide-status' })
	hideStatus = false;

	@property({ type: Boolean, attribute: 'hide-presence' })
	hidePresence = false;

	@property({ type: Boolean, attribute: 'light' })
	light = false;

	isHovering: boolean;

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();

		// TODO: update events
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		// Dispose event
	}

	render() {
		let classes = classMap({
			'offline-opacity':
				this.offlineOpacity &&
				this.identity.presence &&
				this.identity.presence.status == api.identity.IdentityStatus.OFFLINE,
			'has-link': !this.noLink,
			light: this.light
		});
		return html`
			<div
				id="base"
				class=${classes}
				@contextmenu=${this.noContextMenu ? null : showIdentityContextMenu(this.identity)}
			>
				<identity-avatar
					.link=${!this.noLink}
					.hideStatus=${this.hideStatus /*  */}
					.identity=${this.identity}
				></identity-avatar>
				<div id="spaced">
					<div id="content">
						<identity-name .identity=${this.identity} no-link></identity-name>
						${this.partyState
							? this.renderPartyState()
							: this.identity.presence && !this.hidePresence
							? html`<h2 id="activity">
									${utils.formatActivity(this.identity.presence, this.identity.party)}
							  </h2>`
							: null}
					</div>
					<slot name="right"></slot>
				</div>
			</div>
		`;
	}

	renderPartyState() {
		if (this.partyState.matchmakerReady) {
			return html`<h2 id="activity">Ready</h2>`;
		} else if (this.partyState.matchmakerFindingLobby) {
			return html`<h2 id="activity">Matching...</h2>`;
		} else if (this.partyState.matchmakerLobby) {
			return html`<h2 id="activity">In Game</h2>`;
		}

		return null;
	}
}
