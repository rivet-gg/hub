// import { LitElement, html, PropertyValues } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { repeat } from 'lit/directives/repeat.js';
// import { when } from 'lit/directives/when.js';
// import { cssify } from '../../../utils/css';
// import styles from './overview.scss';
// import { responses } from '../../../routes';
// import 'chartjs-adapter-moment';
// import { DropDownSelectEvent, DropDownSelection } from '../../dev/drop-down-list';
// import { styleMap } from 'lit/directives/style-map.js';
// import { Orientation } from '../../common/overlay-positioning';
// import cloud from '@rivet-gg/cloud';
// import * as api from '../../../utils/api';
// import { CloudDashboardCache, CloudGameCache } from '../../../data/cache';
// import global from '../../../utils/global';
// import logging from '../../../utils/logging';
// import { globalEventGroups } from '../../../utils/global-events';
// import assets from '../../../data/assets';
// import timing from '../../../utils/timing';
// import { Rivet } from '@rivet-gg/api-internal';
// import Chart from './chart';

// enum DateRange {
// 	Min10 = timing.minutes(10),
// 	Min30 = timing.minutes(30),
// 	Hour1 = timing.hours(1),
// 	Hour6 = timing.hours(6),
// 	Day1 = timing.days(1),
// 	Day2 = timing.days(2),
// 	Day3 = timing.days(3),
// 	Week1 = timing.days(7),
// 	Week2 = timing.days(14),
// 	Month1 = timing.days(30),
// 	Month2 = timing.days(60)
// }

// enum Category {
// 	MmOverview,
// 	MmPlayers,
// 	MmLobbies,
// 	IdentityOverview
// }

// const CATEGORIES: DropDownSelection<number>[] = [
// 	{
// 		label: 'Matchmaker',
// 		value: null,
// 		header: true
// 	},
// 	{
// 		label: 'Overview',
// 		value: Category.MmOverview
// 	},
// 	{
// 		label: 'Players',
// 		value: Category.MmPlayers
// 	},
// 	{
// 		label: 'Lobbies',
// 		value: Category.MmLobbies
// 	},
// 	{
// 		label: 'Identity',
// 		value: null,
// 		header: true
// 	},
// 	{
// 		label: 'Overview',
// 		value: Category.IdentityOverview
// 	}
// ];

// @customElement('page-analytics-overview')
// export default class AnalyticsOverview extends LitElement {
// 	static styles = cssify(styles);

// 	@property({ type: String })
// 	groupId: string = null;

// 	@property({ type: Object })
// 	loadError?: any;

// 	@property({ type: String })
// 	games: cloud.GameSummary[] = [];
// 	@property({ type: String })
// 	game: cloud.GameFull = null;

// 	// Used for caching so as to not re-create the chart.js chart after every update
// 	@property({ type: Array })
// 	charts: Map<string, Chart> = new Map();

// 	@property({ type: Boolean })
// 	isLoading = true;

// 	dateOptions: DropDownSelection<DateRange>[] = [
// 		{ label: 'Past 10 Minutes', value: DateRange.Min10 },
// 		{ label: 'Past 30 Minutes', value: DateRange.Min30 },
// 		{ label: 'Past Hour', value: DateRange.Hour1 },
// 		{ label: 'Past 6 Hours', value: DateRange.Hour6 },
// 		{ label: 'Past Day', value: DateRange.Day1 },
// 		{ label: 'Past 2 Days', value: DateRange.Day2 },
// 		{ label: 'Past 3 Days', value: DateRange.Day3 },
// 		{ label: 'Past Week', value: DateRange.Week1 },
// 		{ label: 'Past 2 Weeks', value: DateRange.Week2 },
// 		{ label: 'Past Month', value: DateRange.Month1 },
// 		{ label: 'Past 2 Months', value: DateRange.Month2 }
// 	];
// 	gameOptions: DropDownSelection<string>[] = [];
// 	namespaceOptions: DropDownSelection<string>[] = [];

// 	@property({ type: Object })
// 	dateSelection: DropDownSelection<DateRange> = this.dateOptions[4];
// 	@property({ type: Object })
// 	gameSelection: DropDownSelection<string> = null;
// 	@property({ type: Object })
// 	namespaceSelection: DropDownSelection<string> = null;
// 	@property({ type: Object })
// 	category: DropDownSelection<number> = CATEGORIES[1];

// 	gamesStream?: api.RepeatingRequest<cloud.GetGamesCommandOutput>;
// 	gameStream?: api.RepeatingRequest<cloud.GetGameByIdCommandOutput>;

// 	firstUpdated(changedProperties: PropertyValues) {
// 		super.firstUpdated(changedProperties);

// 		this.fetchGames();
// 	}

// 	updated(changedProperties: PropertyValues) {
// 		super.updated(changedProperties);

// 		// Fetch analytics
// 		if (
// 			(changedProperties.has('category') ||
// 				changedProperties.has('dateSelection') ||
// 				changedProperties.has('namespaceSelection') ||
// 				changedProperties.has('gameSelection')) &&
// 			this.games.length
// 		) {
// 			let variants: Rivet.cloud.AnalyticsVariantQuery[] = [];
// 			if (this.category.value == Category.MmOverview) {
// 				variants = [
// 					Rivet.cloud.AnalyticsVariantQuery.MatchmakerOverview,
// 					Rivet.cloud.AnalyticsVariantQuery.PlayerCount,
// 					Rivet.cloud.AnalyticsVariantQuery.PlayerCountByRegion,
// 					Rivet.cloud.AnalyticsVariantQuery.PlayerCountByGameMode,
// 					Rivet.cloud.AnalyticsVariantQuery.LobbyCount,
// 					Rivet.cloud.AnalyticsVariantQuery.LobbyCountByRegion,
// 					Rivet.cloud.AnalyticsVariantQuery.LobbyCountByGameMode
// 				];
// 			} else if (this.category.value == Category.MmPlayers) {
// 				variants = [
// 					Rivet.cloud.AnalyticsVariantQuery.AvgPlayDuration,
// 					Rivet.cloud.AnalyticsVariantQuery.AvgPlayDurationByRegion,
// 					Rivet.cloud.AnalyticsVariantQuery.AvgPlayDurationByGameMode,
// 					Rivet.cloud.AnalyticsVariantQuery.NewPlayersPerSecond,
// 					Rivet.cloud.AnalyticsVariantQuery.NewLobbiesPerSecond
// 				];
// 			} else if (this.category.value == Category.MmLobbies) {
// 				variants = [
// 					Rivet.cloud.AnalyticsVariantQuery.DestroyedLobbiesByFailure,
// 					Rivet.cloud.AnalyticsVariantQuery.DestroyedLobbiesByExitCode,
// 					Rivet.cloud.AnalyticsVariantQuery.FailedLobbies,
// 					Rivet.cloud.AnalyticsVariantQuery.LobbyReadyTime
// 				];
// 			} else if (this.category.value == Category.IdentityOverview) {
// 				variants = [Rivet.cloud.AnalyticsVariantQuery.IdentityAccounts];
// 			}

// 			this.fetchAnalytics(variants);
// 		}
// 	}

// 	disconnectedCallback() {
// 		super.disconnectedCallback();

// 		if (this.gamesStream) this.gamesStream.cancel();
// 		if (this.gameStream) this.gameStream.cancel();
// 	}

// 	async fetchGames() {
// 		if (this.gamesStream) this.gamesStream.cancel();

// 		// Fetch events
// 		this.gamesStream = await CloudDashboardCache.watch(data => {
// 			data.games.sort((a, b) => a.displayName.localeCompare(b.displayName));
// 			this.games = data.games.filter(a => a.developerGroupId == this.groupId);

// 			// Create game options
// 			this.gameOptions = [
// 				{ label: 'All', value: null },
// 				...this.games.map(game => {
// 					let handleStyles = styleMap({
// 						display: 'flex',
// 						'flex-direction': 'row',
// 						'align-items': 'center',
// 						padding: '0 10px 0 0'
// 					});

// 					return {
// 						template: html`<div style=${handleStyles}>
// 							<lazy-img
// 								class="left-icon"
// 								bg-size=${game.logoUrl ? 'contain' : 'cover'}
// 								src=${game.logoUrl ?? assets.asset('/games/blank/logo.png')}
// 							></lazy-img>
// 							${game.displayName}
// 						</div>`,
// 						value: game.gameId
// 					};
// 				})
// 			];

// 			if (this.gameSelection) {
// 				this.gameSelection = this.gameOptions.find(o => o.value == this.gameSelection.value);
// 			} else this.gameSelection = this.gameOptions[0];
// 		});

// 		this.gamesStream.onError(err => {
// 			logging.error('Request error', err);

// 			// Only set `loadError` on initiation
// 			if (this.games) globalEventGroups.dispatch('error', err);
// 			else this.loadError = err;
// 		});
// 	}

// 	async fetchGame() {
// 		if (this.gameStream) this.gameStream.cancel();

// 		// Fetch events
// 		this.gameStream = await CloudGameCache.watch(this.gameSelection.value, res => {
// 			this.game = res.game;

// 			this.namespaceOptions = [
// 				{ label: 'All', value: null },
// 				...this.game.namespaces.map(ns => ({
// 					label: ns.displayName,
// 					value: ns.namespaceId
// 				}))
// 			];

// 			if (this.namespaceSelection) {
// 				this.namespaceSelection = this.namespaceOptions.find(
// 					o => o.value == this.namespaceSelection.value
// 				);
// 			} else this.namespaceSelection = this.namespaceOptions[0];
// 		});

// 		this.gameStream.onError(err => {
// 			logging.error('Request error', err);

// 			if (this.game) globalEventGroups.dispatch('error', err);
// 			else this.loadError = err;
// 		});
// 	}

// 	async fetchAnalytics(variants: Rivet.cloud.AnalyticsVariantQuery[]) {
// 		let now = Date.now();

// 		this.isLoading = true;

// 		try {
// 			let res = await global.api.cloud.games.games.getAnalytics({
// 				gameIds: this.namespaceSelection?.value
// 					? null
// 					: this.gameSelection.value
// 					? [this.gameSelection.value]
// 					: this.games.map(a => a.gameId),
// 				namespaceIds: this.namespaceSelection?.value ? [this.namespaceSelection.value] : null,
// 				variants,
// 				queryStart: new Date(now - this.dateSelection.value),
// 				queryEnd: new Date(now)
// 			});

// 			// Hide all charts
// 			this.charts.forEach(c => c.classList.add('hidden'));

// 			for (let dataSet of res.dataSets) {
// 				let id = dataSetToVariant(dataSet);

// 				// Create a new chart
// 				if (!this.charts.has(id)) {
// 					let chart = new Chart();

// 					this.charts.set(id, chart);
// 				}

// 				// Update data
// 				let chart = this.charts.get(id);
// 				chart.dataSet = dataSet;
// 				chart.classList.remove('hidden');
// 			}

// 			this.requestUpdate('charts');
// 		} catch (err) {
// 			globalEventGroups.dispatch('error', err);
// 		}

// 		this.isLoading = false;
// 	}

// 	updateDateRange(event: DropDownSelectEvent<DateRange>) {
// 		this.dateSelection = event.selection;
// 	}

// 	updateGame(event: DropDownSelectEvent<string>) {
// 		this.gameSelection = event.selection;

// 		// Reset data
// 		this.game = null;
// 		this.namespaceSelection = null;
// 		this.namespaceOptions.length = 0;

// 		// Fetch game data
// 		if (this.gameSelection.value != null) this.fetchGame();
// 		else if (this.gameStream) this.gameStream.cancel();
// 	}

// 	updateNamespace(event: DropDownSelectEvent<string>) {
// 		this.namespaceSelection = event.selection;
// 	}

// 	updateCategory(event: DropDownSelectEvent<number>) {
// 		this.category = event.selection;
// 	}

// 	render() {
// 		if (this.loadError) return responses.renderError(this.loadError);

// 		return html`
// 			<div id="base">
// 				<page-header>
// 					<e-svg src="regular/square-poll-vertical"></e-svg>
// 					<h1>Analytics</h1>
// 				</page-header>

// 				<div id="actions">
// 					<div class="action-group">
// 						<div class="pair">
// 							<h2>View</h2>
// 							<drop-down-list
// 								.selection=${this.category}
// 								.options=${CATEGORIES}
// 								@select=${this.updateCategory.bind(this)}
// 							></drop-down-list>
// 						</div>
// 						<div class="pair">
// 							<h2>Range</h2>
// 							<drop-down-list
// 								.selection=${this.dateSelection}
// 								.options=${this.dateOptions}
// 								.orientation=${Orientation.TopRight}
// 								@select=${this.updateDateRange.bind(this)}
// 							></drop-down-list>
// 						</div>
// 					</div>
// 					<div class="action-group">
// 						<div class="pair">
// 							<h2>Game</h2>
// 							<drop-down-list
// 								.selection=${this.gameSelection}
// 								.options=${this.gameOptions}
// 								.orientation=${Orientation.TopRight}
// 								@select=${this.updateGame.bind(this)}
// 							></drop-down-list>
// 						</div>
// 						${when(this.namespaceOptions.length, () => {
// 							return html`<div class="pair">
// 								<h2>Namespace</h2>
// 								<drop-down-list
// 									.selection=${this.namespaceSelection}
// 									.options=${this.namespaceOptions}
// 									.orientation=${Orientation.TopRight}
// 									@select=${this.updateNamespace.bind(this)}
// 								></drop-down-list>
// 							</div>`;
// 						})}
// 					</div>
// 					${when(this.isLoading, () => html`<loading-wheel custom></loading-wheel>`)}
// 				</div>
// 				<div id="body">
// 					<div class="charts">
// 						${repeat(
// 							this.charts,
// 							([k, v]) => k,
// 							([k, v]) => v
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		`;
// 	}
// }

// function dataSetToVariant(dataSet: Rivet.cloud.NamespaceAnalyticsDataSet) {
// 	if (dataSet.matchmakerOverview) return Rivet.cloud.AnalyticsVariantQuery.MatchmakerOverview;
// 	else if (dataSet.playerCount) return Rivet.cloud.AnalyticsVariantQuery.PlayerCount;
// 	else if (dataSet.playerCountByRegion) return Rivet.cloud.AnalyticsVariantQuery.PlayerCountByRegion;
// 	else if (dataSet.playerCountByGameMode) return Rivet.cloud.AnalyticsVariantQuery.PlayerCountByGameMode;
// 	else if (dataSet.lobbyCount) return Rivet.cloud.AnalyticsVariantQuery.LobbyCount;
// 	else if (dataSet.lobbyCountByRegion) return Rivet.cloud.AnalyticsVariantQuery.LobbyCountByRegion;
// 	else if (dataSet.lobbyCountByGameMode) return Rivet.cloud.AnalyticsVariantQuery.LobbyCountByGameMode;
// 	else if (dataSet.avgPlayDuration) return Rivet.cloud.AnalyticsVariantQuery.AvgPlayDuration;
// 	else if (dataSet.avgPlayDurationByGameMode)
// 		return Rivet.cloud.AnalyticsVariantQuery.AvgPlayDurationByGameMode;
// 	else if (dataSet.avgPlayDurationByRegion)
// 		return Rivet.cloud.AnalyticsVariantQuery.AvgPlayDurationByRegion;
// 	else if (dataSet.newPlayersPerSecond) return Rivet.cloud.AnalyticsVariantQuery.NewPlayersPerSecond;
// 	else if (dataSet.newLobbiesPerSecond) return Rivet.cloud.AnalyticsVariantQuery.NewLobbiesPerSecond;
// 	else if (dataSet.destroyedLobbiesByFailure)
// 		return Rivet.cloud.AnalyticsVariantQuery.DestroyedLobbiesByFailure;
// 	else if (dataSet.destroyedLobbiesByExitCode)
// 		return Rivet.cloud.AnalyticsVariantQuery.DestroyedLobbiesByExitCode;
// 	else if (dataSet.failedLobbies) return Rivet.cloud.AnalyticsVariantQuery.FailedLobbies;
// 	else if (dataSet.lobbyReadyTime) return Rivet.cloud.AnalyticsVariantQuery.LobbyReadyTime;
// 	else if (dataSet.identityAccounts) return Rivet.cloud.AnalyticsVariantQuery.IdentityAccounts;

// 	logging.warn('unhandled dataset variant', dataSet);
// 	return null;
// }