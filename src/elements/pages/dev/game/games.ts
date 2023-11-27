import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { cssify } from '../../../../utils/css';
import styles from './games.scss';
import routes, { responses } from '../../../../routes';
import global from '../../../../utils/global';
import cloud from '@rivet-gg/cloud';
import utils from '../../../../utils/utils';
import { showAlert } from '../../../../ui/helpers';
import { DropDownSelectEvent, DropDownSelection } from '../../../dev/drop-down-list';
import { TraversableErrors, VALIDATION_ERRORS } from '../../../../utils/traversable-errors';
import timing, { Debounce } from '../../../../utils/timing';
import RvtRouter from '../../../root/rvt-router';
import { InputUpdateEvent } from '../../../dev/text-input';
import assets from '../../../../data/assets';
import { CloudDashboardCache } from '../../../../data/cache';
import logging from '../../../../utils/logging';
import { GroupCreateEvent } from '../../../modals/create-group';
import { globalEventGroups } from '../../../../utils/global-events';
import { RepeatingRequest } from '../../../../utils/repeating-request';
import { GamesQuery } from '../../../../data/queries/clients';

const tailwindConfig = require('../../../../../tailwind.config.js');
const tailwind_palette = tailwindConfig.theme.extend.colors;

@customElement('page-dev-games')
export default class DevGames extends LitElement {
	static styles = cssify(styles);

	games = new GamesQuery(this);

	@property({ type: Object })
	loadError?: any;

	// === GROUP COMPONENTS ===
	@property({ type: Boolean })
	createGroupModalActive = false;

	devGroupOptions: DropDownSelection<string>[] = [];

	@property({ type: Boolean })
	createGroupHovered = false;

	// === GAME COMPONENTS ===
	@property({ type: Boolean })
	gameModalActive = false;

	@property({ type: String })
	gameDisplayNameValue: string = null;

	@property({ type: String })
	gameNameIdValue = '';

	gameGroupSelection: DropDownSelection<string> = null;

	@property({ type: Boolean })
	isCreatingGame = false;

	@property({ type: String })
	gameValidationErrors: TraversableErrors = new TraversableErrors(VALIDATION_ERRORS.GAME);

	@property({ type: Boolean })
	gameIsValid = false;

	// === DEBOUNCE INFO ===
	validateGameDebounce: Debounce<() => ReturnType<typeof global.cloud.validateGame>>;
	validateGroupDebounce: Debounce<() => ReturnType<typeof global.cloud.validateGroup>>;

	constructor() {
		super();

		this.validateGameDebounce = new Debounce({
			delay: timing.milliseconds(500),
			cb: async () => {
				let displayName = this.gameDisplayNameValue ?? '';
				let nameId = this.gameNameIdValue.length
					? this.gameNameIdValue
					: utils.convertStringToId(displayName);

				return await global.cloud.validateGame({
					nameId,
					displayName
				});
			},
			completeCb: res => {
				// Save errors
				this.gameValidationErrors.load(res.errors.map(err => err.path));
				this.gameIsValid = this.gameValidationErrors.isEmpty() && this.gameGroupSelection != null;

				// Refresh UI
				this.requestUpdate('gameValidationErrors');
			}
		});
		this.validateGameDebounce.onError(async err => {
			this.loadError = err;
			this.gameIsValid = false;
		});
	}

	openGroupModal() {
		this.createGroupModalActive = true;
	}

	async convertGroup(groupId: string) {
		await global.cloud.convertGroup({ groupId });
	}

	async createGroupComplete(event: GroupCreateEvent) {
		await this.convertGroup(event.groupId);
		this.createGroupModalActive = false;
	}

	async createGame() {
		if (!this.gameIsValid) return;

		try {
			let displayName = this.gameDisplayNameValue;
			let nameId = this.gameNameIdValue.length
				? this.gameNameIdValue
				: utils.convertStringToId(displayName);

			let res = await global.cloud.createGame({
				nameId,
				displayName,
				developerGroupId: this.gameGroupSelection.value
			});

			this.gameModalClose();

			// Open new game page
			RvtRouter.shared.navigate(routes.devGame.build({ gameId: res.gameId }));
		} catch (err) {
			this.loadError = err;
			this.isCreatingGame = false;
		}
	}

	changeGameGroupSelection(event: DropDownSelectEvent<string>) {
		this.gameGroupSelection = event.selection;
		this.validateGameDebounce.trigger();
	}

	openGameModal(groupId: string) {
		if (this.games.query.data?.groups.length == 0) {
			showAlert('Cannot create game', html`You cannot create a game before creating a group first.`, [
				{
					label: 'Create A Group',
					cb: this.openGroupModal.bind(this)
				},
				{
					label: 'Dismiss'
				}
			]);
		} else {
			this.gameModalActive = true;
			this.gameGroupSelection = this.devGroupOptions.find(a => a.value == groupId);
		}
	}

	gameModalClose() {
		this.gameModalActive = false;
	}

	gameDisplayNameInput(event: InputUpdateEvent) {
		this.gameDisplayNameValue = event.value;

		this.validateGameDebounce.trigger();
	}

	gameNameIdInput(event: InputUpdateEvent) {
		this.gameNameIdValue = event.value;

		this.validateGameDebounce.trigger();
	}

	render() {
		if (this.loadError) return responses.renderError(this.loadError);

		return html`
			<div id="base" class="pb-12">
				<div id="body">
					${when(this.games.query.isLoading, this.renderPlaceholder, this.renderBody.bind(this))}
				</div>
			</div>

			<modal-create-group
				.active=${this.createGroupModalActive}
				@create=${this.createGroupComplete.bind(this)}
				@close=${() => (this.createGroupModalActive = false)}
			></modal-create-group>

			${this.renderCreateGameModal()}
		`;
	}

	renderBody() {
		return html`
			${this.games.query.data.groups.length
				? html`<div id="groups-list">
						${repeat(
							this.games.query.data.groups,
							g => g.groupId,
							g => this.renderGroup(g)
						)}
				  </div>`
				: null}
			${when(
				global.currentIdentity.isRegistered && global.currentIdentity.isAdmin,
				() =>
					html` <div
						class="dashed-border-button flex justify-center items-center hover:cursor-pointer w-full h-32 place-content-center text-[#d1d1d1]  hover:text-white hover:bg-button-bg-hover-color"
						@click=${this.openGroupModal.bind(this)}
						@mouseenter=${() => (this.createGroupHovered = true)}
						@mouseleave=${() => (this.createGroupHovered = false)}
					>
						<div class="font-bold text-lg pb-0.5 pr-2">
							<e-svg src="solid/plus"></e-svg>
						</div>
						<div class="font-bold text-lg text-center">New Developer Group</div>
					</div>`
			)}
		`;
	}

	renderPlaceholder() {
		return html`<div id="placeholder">
			<div class="placeholder-group">
				<div class="placeholder-group-header">
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
				</div>
				<div class="placeholder-group-body">
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
				</div>
			</div>
			<div class="placeholder-group">
				<div class="placeholder-group-header">
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
					<loading-placeholder></loading-placeholder>
				</div>
				<div class="placeholder-group-body">
					<loading-placeholder></loading-placeholder>
				</div>
			</div>
		</div>`;
	}

	renderGroup(group: cloud.GroupSummary) {
		let isOwner = global.currentIdentity.identityId == group.ownerIdentityId;

		return when(
			group.isDeveloper,
			() =>
				html`<div class="group">
					<div class="group-header">
						<div class="max-sm:w-1/3 md:w-2/3 flex flex-row space-x-3">
							<div class="max-sm:invisible max-sm:w-0 my-auto">
								<group-avatar
									class="w-8 h-8"
									style="--font-size: 12px"
									.group=${group}
								></group-avatar>
							</div>
							<h2 class="my-auto text-ellipsis overflow-hidden text-[24px] max-w-3/4">
								${group.displayName}
							</h2>
						</div>
						<!-- </a> -->
						${when(
							group.isDeveloper,
							() =>
								html` <div class="flex flex-row ml-auto space-x-1">
									<!-- <stylized-button
										class="analytics-button"
										icon="solid/chart-line-up"
										href=${routes.analyticsOverview.build({
										groupId: group.groupId
									})}
										>Analytics</stylized-button
									> -->
									<stylized-button
										class="billing-button w-20"
										border-color=${tailwind_palette['raised-bg-border-color']}
										border-width=".75px"
										href=${routes.groupSettings.build({
											groupId: group.groupId,
											tab: 'Billing'
										})}
										color=${tailwind_palette['raised-bg']}
										>Billing</stylized-button
									>
									<stylized-button
										class="settings-button"
										border-color=${tailwind_palette['raised-bg-border-color']}
										border-width=".75px"
										href=${routes.groupSettings.build({ groupId: group.groupId })}
										color=${tailwind_palette['raised-bg']}
										>Settings</stylized-button
									>
								</div>`
							// Reenable when open beta
							// () =>
							// 	when(
							// 		isOwner,
							// 		() => html`<stylized-button
							// 			.trigger=${this.convertGroup.bind(this, group.groupId)}
							// 			>Convert Group</stylized-button
							// 		>`
							// 	)
						)}
					</div>
					${when(
						group.isDeveloper,
						() =>
							html`<div class="games-list grid grid-cols-4 gap-4">
								<div
									id="create-game"
									class="dashed-border-button"
									@click=${this.openGameModal.bind(this, group.groupId)}
								>
									<div id="create-game-content">
										<lazy-img src=${assets.asset('/games/blank/logo.png')}></lazy-img>
										Create a new game
									</div>
								</div>
								${repeat(
									this.games.query.data?.games.filter(
										g => g.developerGroupId == group.groupId
									),
									g => g.gameId,
									g =>
										html`<dev-game-tile
											.game=${g}
											.group=${this.games.query.data.groups.find(
												gr => gr.groupId == g.developerGroupId
											)}
										></dev-game-tile>`
								)}
							</div>`,
						() => html`<p class="muted-text">This group is not a developer group.</p>`
					)}
				</div>`
		);
	}

	renderCreateGameModal() {
		if (!this.games.query.data) return null;

		let displayName = this.gameDisplayNameValue;
		let displayNameErrors = this.gameValidationErrors.findFormatted('display-name');
		let nameIdErrors = this.gameValidationErrors.findFormatted('name-id');

		return html` <drop-down-modal
			id="create-game-modal"
			?active=${this.gameModalActive}
			@close=${this.gameModalClose.bind(this)}
		>
			<modal-body slot="body">
				<h1>Create your new game</h1>
				<div class="input-group">
					<h2>Owner Developer Group</h2>
					<drop-down-list
						light
						.options=${this.devGroupOptions}
						.selection=${this.gameGroupSelection}
						@select=${this.changeGameGroupSelection.bind(this)}
					></drop-down-list>
					<h2>Game Display Name</h2>
					<text-input
						light
						placeholder="Enter a game name..."
						@input=${this.gameDisplayNameInput.bind(this)}
					></text-input>
					${when(
						displayNameErrors.length > 0,
						() => html`
							<span id="create-game-error">
								<e-svg src="regular/circle-exclamation"></e-svg> ${displayNameErrors[0]}</li>
							</span>`
					)}
					<h2>Game Name ID</h2>
					<text-input
						light
						.filter=${(v: string) => v.replace(/[\s\-]+/g, '-').toLowerCase()}
						placeholder=${displayName
							? utils.convertStringToId(displayName)
							: 'Enter a name id...'}
						@input=${this.gameNameIdInput.bind(this)}
					></text-input>
					${when(
						nameIdErrors.length > 0,
						() => html`
							<span id="create-game-error">
								<e-svg src="regular/circle-exclamation"></e-svg> ${nameIdErrors[0]}</li>
							</span>`
					)}
				</div>
				<p class="content">We’ll walk you though the details of editing your game later.</p>
				<stylized-button
					.trigger=${this.createGame.bind(this)}
					?disabled=${!this.gameIsValid}
					?loading=${this.isCreatingGame}
					>Create</stylized-button
				>
			</modal-body>
		</drop-down-modal>`;
	}
}
