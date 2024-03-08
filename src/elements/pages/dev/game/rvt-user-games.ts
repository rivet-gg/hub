import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { cssify } from '../../../../utils/css';
import styles from './rvt-user-games.scss';
import routes, { responses } from '../../../../routes';
import global from '../../../../utils/global';
import { Rivet } from '@rivet-gg/api';
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
import clsx from 'clsx';

@customElement('rvt-user-games')
export default class RvtUserGames extends LitElement {
	static styles = cssify(styles);

	@property({ type: Object })
	data: CloudDashboardCache.Payload = null;

	@property({ type: Object })
	loadError?: any;

	// === GROUP COMPONENTS ===
	@property({ type: Boolean })
	createGroupModalActive = false;

	devGroupOptions: DropDownSelection<string>[] = [];

	// === GAME COMPONENTS ===
	@property({ type: Boolean })
	gameModalActive = false;

	@property({ type: String })
	gameDisplayNameValue: string = null;

	gameGroupSelection: DropDownSelection<string> = null;

	@property({ type: Boolean })
	isCreatingGame = false;

	@property({ type: String })
	gameValidationErrors: TraversableErrors = new TraversableErrors(VALIDATION_ERRORS.GAME);

	@property({ type: Boolean })
	gameIsValid = false;

	gamesStream?: RepeatingRequest<CloudDashboardCache.Payload>;

	// === DEBOUNCE INFO ===
	validateGameDebounce: Debounce<() => ReturnType<typeof global.deprecatedApi.cloud.validateGame>>;
	validateGroupDebounce: Debounce<() => ReturnType<typeof global.deprecatedApi.cloud.validateGroup>>;

	constructor() {
		super();

		this.validateGameDebounce = new Debounce({
			delay: timing.milliseconds(500),
			cb: async () => {
				let displayName = this.gameDisplayNameValue ?? '';

				return await global.api.cloud.games.games.validateGame({
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

	firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		this.fetchData();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this.gamesStream) this.gamesStream.cancel();
	}

	async fetchData(forceRestart = false) {
		if (this.gamesStream) this.gamesStream.cancel();

		// Fetch events
		this.gamesStream = CloudDashboardCache.watch(
			'UserGames.gamesStream',
			data => {
				data.games.sort((a, b) => a.displayName.localeCompare(b.displayName));
				data.groups.sort((a, b) =>
					a.isDeveloper == b.isDeveloper
						? a.displayName.localeCompare(b.displayName)
						: +b.isDeveloper - +a.isDeveloper
				);
				this.data = data;

				this.devGroupOptions = this.data.groups
					.filter(group => group.isDeveloper)
					.map(group => ({
						template: html`<group-handle-tile
							light
							no-link
							.group=${group as any}
							style=${styleMap({ '--font-size': '12px' })}
						></group-handle-tile>`,
						value: group.groupId
					}));

				// Set group selection if only one dev group exists
				if (this.devGroupOptions.length == 1) {
					this.gameGroupSelection = this.devGroupOptions[0];
				}
			},
			{ watchIndex: forceRestart ? null : undefined }
		);

		this.gamesStream.onError(err => {
			logging.error('Request error', err);

			// Only set `loadError` on initiation
			if (this.data) globalEventGroups.dispatch('error', err);
			else this.loadError = err;
		});
	}

	openGroupModal() {
		this.createGroupModalActive = true;
	}

	async createGroupComplete(event: GroupCreateEvent) {
		this.fetchData(true);
		this.createGroupModalActive = false;
	}

	async createGame() {
		if (!this.gameIsValid) return;

		try {
			let displayName = this.gameDisplayNameValue;

			let res = await global.api.cloud.games.games.createGame({
				displayName,
				developerGroupId: this.gameGroupSelection.value
			});

			this.fetchData(true);
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
		if (this.data.groups.length == 0) {
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

	render() {
		if (this.loadError) return responses.renderError(this.loadError);

		return html`
			<div id="base" class="pb-12">
				<div id="body">${when(this.data !== null, this.renderBody.bind(this))}</div>
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
			<div class="max-w-contentwidth px-3 md:px-5 lg:px-0">
				${this.data.groups.length
					? html`<div id="groups-list">
							${repeat(
								this.data.groups,
								g => g.groupId,
								g => this.renderGroup(g)
							)}
					  </div>`
					: null}
				${when(
					// Allow creating new group if user is admin or registered on a public cluster
					global.currentIdentity.isAdmin ||
						(global.bootstrapData.cluster == Rivet.cloud.BootstrapCluster.Enterprise &&
							global.currentIdentity.isRegistered),
					() =>
						html` <button
							class="dashed-border-button transition-all flex justify-center items-center hover:cursor-pointer w-full h-32 place-content-center text-white hover:bg-button-bg-hover-color"
							@click=${this.openGroupModal.bind(this)}
						>
							<div class="font-bold text-lg pb-0.5 pr-2">
								<e-svg src="solid/plus"></e-svg>
							</div>
							<div class="font-bold text-lg text-center">New Developer Group</div>
						</button>`
				)}
			</div>
		`;
	}

	renderGroup(group: Rivet.group.Handle) {
		return when(
			group.isDeveloper,
			() =>
				html`<div class="group">
					<div class="group-header">
						<div class="max-sm:w-1/3 md:w-2/3 flex flex-row space-x-3">
							<div class="max-sm:invisible max-sm:w-0 my-auto">
								<group-avatar
									class="w-12 h-12"
									style="--font-size: 12px"
									.group=${group}
								></group-avatar>
							</div>
							<h2 class="my-auto text-ellipsis overflow-hidden text-2xl max-w-3/4">
								${group.displayName}
							</h2>
						</div>
						${when(
							group.isDeveloper,
							() =>
								html` <div class="flex flex-row ml-auto space-x-4">
									<rvt-button
										icon="solid/chart-line-up"
										href=${routes.analyticsOverview.build({
											groupId: group.groupId
										})}
										>Analytics</rvt-button
									>

									<rvt-button
										href=${routes.groupSettings.build({
											groupId: group.groupId,
											tab: 'billing'
										})}
										>Billing</rvt-button
									>
									<rvt-button href=${routes.groupSettings.build({ groupId: group.groupId })}
										>Settings</rvt-button
									>
								</div>`
							// TODO: Reenable when open beta
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
									class=${clsx(
										'h-80 flex flex-col justify-center items-center cursor-pointer dashed-border-4 dashed-border-white dashed-border-lg transition-all',
										!this.gameModalActive && 'hover:bg-button-bg-hover-color'
									)}
									@click=${this.openGameModal.bind(this, group.groupId)}
								>
									<div class="relative flex flex-col place-content-center m-auto">
										<h4 class="font-semibold text-lg text-center">Create a game</h4>
										<lazy-img
											class="h-24 w-4/5 m-auto mt-6"
											src=${assets.asset('/games/blank/newgame.svg')}
											bg-size="contain"
										></lazy-img>
									</div>
								</div>
								${repeat(
									this.data.games.filter(g => g.developer.groupId == group.groupId),
									g => g.gameId,
									g =>
										html`<dev-game-tile
											.game=${g}
											.group=${this.data.groups.find(
												gr => gr.groupId == g.developer.groupId
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
		if (!this.data) return null;

		let displayName = this.gameDisplayNameValue;
		let displayNameErrors = this.gameValidationErrors.findFormatted('display-name');

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
				</div>
				<p class="content text-center">
					We'll walk you though the details of editing your game later.
				</p>
				<rvt-button
					class="mt-4"
					@click=${this.createGame.bind(this)}
					?disabled=${!this.gameIsValid}
					?loading=${this.isCreatingGame}
					>Create</rvt-button
				>
			</modal-body>
		</drop-down-modal>`;
	}
}
