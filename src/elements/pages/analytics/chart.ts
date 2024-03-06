import { LitElement, html, PropertyValues, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './chart.scss';
import { cssify } from '../../../utils/css';
import { default as ChartJs, ChartOptions } from 'chart.js/auto';
import { Rivet as RivetEe } from '@rivet-gg/api-ee';
import { BAR_CHART_OPTIONS, DURATION_LINE_CHART_OPTIONS, LINE_CHART_OPTIONS } from './configs';
import utils from '../../../utils/utils';
import { tooltip } from '../../../ui/helpers';
import numbro from 'numbro';

let DATASET_COLORS: [number, number, number][] = [
	[127, 86, 217],
	[252, 196, 25],
	[255, 120, 84],
	[247, 64, 81]
];

@customElement('analytics-chart')
export default class Chart extends LitElement {
	static styles = cssify(styles);

	displayTitle: string;
	@property({ type: Object })
	chart?: ChartJs;

	@property({ type: Object })
	dataSet: RivetEe.ee.cloud.NamespaceAnalyticsDataSet = null;
	structuredDataSets: any[] = [];

	// Set by whichever chart needs to be rendered
	@property({ type: Object })
	renderer: () => TemplateResult = this.defaultRenderer;

	lineChartOptions: ChartOptions<'line'> = LINE_CHART_OPTIONS;
	barChartOptions: ChartOptions<'bar'> = BAR_CHART_OPTIONS;

	updated(changedProperties: PropertyValues) {
		super.updated(changedProperties);

		// Only handles chart.js charts here, see `render` function
		if (changedProperties.has('dataSet')) {
			if (this.dataSet.matchmakerOverview) this.matchmakerOverviewChart();
			if (this.dataSet.playerCount) this.playerCountChart(this.dataSet.playerCount);
			else if (this.dataSet.playerCountByRegion)
				this.playerCountByRegionChart(this.dataSet.playerCountByRegion);
			else if (this.dataSet.playerCountByGameMode)
				this.playerCountByGameModeChart(this.dataSet.playerCountByGameMode);
			else if (this.dataSet.lobbyCount) this.lobbyCountChart(this.dataSet.lobbyCount);
			else if (this.dataSet.lobbyCountByRegion)
				this.lobbyCountByRegionChart(this.dataSet.lobbyCountByRegion);
			else if (this.dataSet.lobbyCountByGameMode)
				this.lobbyCountByGameModeChart(this.dataSet.lobbyCountByGameMode);
			else if (this.dataSet.avgPlayDuration) this.avgPlayDurationChart(this.dataSet.avgPlayDuration);
			else if (this.dataSet.avgPlayDurationByRegion) this.avgPlayDurationByRegionChart();
			else if (this.dataSet.avgPlayDurationByGameMode) this.avgPlayDurationByGameModeChart();
			else if (this.dataSet.newPlayersPerSecond)
				this.newPlayersPerSecondChart(this.dataSet.newPlayersPerSecond);
			else if (this.dataSet.newLobbiesPerSecond)
				this.newLobbiesPerSecondChart(this.dataSet.newLobbiesPerSecond);
			else if (this.dataSet.destroyedLobbiesByFailure)
				this.destroyedLobbiesByFailureChart(this.dataSet.destroyedLobbiesByFailure);
			else if (this.dataSet.destroyedLobbiesByExitCode)
				this.destroyedLobbiesByExitCodeChart(this.dataSet.destroyedLobbiesByExitCode);
			else if (this.dataSet.failedLobbies) this.failedLobbiesChart(this.dataSet.failedLobbies);
			else if (this.dataSet.lobbyReadyTime) this.lobbyReadyTimeChart(this.dataSet.lobbyReadyTime);
		}
	}

	createOrUpdateChart<Options extends ChartOptions>(
		chartCb: (datasets: any[], shadowRoot: ShadowRoot, options: Options) => ChartJs,
		options: Options
	) {
		// Update chart in-place instead of creating a new one
		let newDatasets = preprocessDatasets(this.structuredDataSets);
		if (this.chart) {
			this.chart.data.datasets = [];
			this.chart.data.datasets.push(...newDatasets);
			this.chart.update();
		} else this.chart = chartCb(newDatasets, this.shadowRoot, options);
	}

	matchmakerOverviewChart() {
		this.displayTitle = 'Average Play Duration By Region';

		this.renderer = () => {
			let data = this.dataSet.matchmakerOverview;

			return html`<div id="base" class="stats">
				<div class="stat">
					<h1 class="title">Player Count</h1>
					<h2 class="value">${numbro(data.playerCount).format('0,0')}</h2>
				</div>
				<div class="stat">
					<h1 class="title">Lobby Count</h1>
					<h2 class="value">${numbro(data.lobbyCount).format('0,0')}</h2>
				</div>
			</div>`;
		};
	}

	playerCountChart(data: RivetEe.ee.cloud.PlayerCountDataSet) {
		this.structuredDataSets = [
			{
				label: 'Total Players',
				data: data.playerCount.map((y, i) => ({ x: data.ts[i], y }))
			},
			{
				label: 'Unregistered Players',
				data: data.playerUnreadyCount.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'Players';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	playerCountByRegionChart(data: RivetEe.ee.cloud.PlayerCountByRegionDataSet) {
		let playerCounts = data.playerCount.map((y, i) => ({ x: data.ts[i], y }));
		let uniqueRegions = Array.from(
			new Map(data.regionId.map((id, i) => [id, data.regionNameId[i]])).entries()
		);
		this.structuredDataSets = uniqueRegions.map(([id, nameId]) => ({
			label: nameId,
			data: playerCounts.filter((_, i) => data.regionId[i] == id)
		}));

		this.displayTitle = 'Players By Region';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	playerCountByGameModeChart(data: RivetEe.ee.cloud.PlayerCountByGameModeDataSet) {
		let playerCounts = data.playerCount.map((y, i) => ({ x: data.ts[i], y }));
		let uniqueGameModes = Array.from(
			new Map(data.gameModeId.map((id, i) => [id, data.gameModeNameId[i]])).entries()
		);
		this.structuredDataSets = uniqueGameModes.map(([id, nameId]) => ({
			label: `${nameId} (${id.slice(0, 4)})`,
			data: playerCounts.filter((_, i) => data.gameModeId[i] == id)
		}));

		this.displayTitle = 'Players By Game Mode';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	lobbyCountChart(data: RivetEe.ee.cloud.LobbyCountDataSet) {
		this.structuredDataSets = [
			{
				label: 'Total Lobbies',
				data: data.lobbyCount.map((y, i) => ({ x: data.ts[i], y }))
			},
			{
				label: 'Preemptive Lobbies',
				data: data.lobbyPreemptiveCount.map((y, i) => ({ x: data.ts[i], y }))
			},
			{
				label: 'Unready Lobbies',
				data: data.lobbyUnreadyCount.map((y, i) => ({ x: data.ts[i], y }))
			},
			{
				label: 'Closed Lobbies',
				data: data.lobbyClosedCount.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'Lobbies';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	lobbyCountByRegionChart(data: RivetEe.ee.cloud.LobbyCountByRegionDataSet) {
		let lobbyCounts = data.lobbyCount.map((y, i) => ({ x: data.ts[i], y }));
		let uniqueRegions = Array.from(
			new Map(data.regionId.map((id, i) => [id, data.regionNameId[i]])).entries()
		);
		this.structuredDataSets = uniqueRegions.map(([id, nameId]) => ({
			label: nameId,
			data: lobbyCounts.filter((_, i) => data.regionId[i] == id)
		}));

		this.displayTitle = 'Lobbies By Region';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	lobbyCountByGameModeChart(data: RivetEe.ee.cloud.LobbyCountByGameModeDataSet) {
		let lobbyCounts = data.lobbyCount.map((y, i) => ({ x: data.ts[i], y }));
		let uniqueGameModes = Array.from(
			new Map(data.gameModeId.map((id, i) => [id, data.gameModeNameId[i]])).entries()
		);
		this.structuredDataSets = uniqueGameModes.map(([id, nameId]) => ({
			label: `${nameId} (${id.slice(0, 4)})`,
			data: lobbyCounts.filter((_, i) => data.gameModeId[i] == id)
		}));

		this.displayTitle = 'Lobbies By Game Mode';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	avgPlayDurationChart(data: RivetEe.ee.cloud.AvgPlayDurationDataSet) {
		this.structuredDataSets = [
			{
				label: 'Duration',
				data: data.duration.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'Average Play Duration';
		this.createOrUpdateChart(createLineChart, DURATION_LINE_CHART_OPTIONS);
	}

	avgPlayDurationByRegionChart() {
		this.displayTitle = 'Average Play Duration By Region';

		this.renderer = () => {
			let data = this.dataSet.avgPlayDurationByRegion;
			let maxDuration = data.duration.reduce((s, a) => Math.max(s, a), 0);

			return html`<div id="base">
				<h1 id="title">${this.displayTitle}</h1>
				<div id="list">
					<table>
						<tr>
							<th></th>
							<th></th>
							<th></th>
						</tr>
						${repeat(
							data.regionNameId,
							nameId => nameId,
							(nameId, i) => {
								let percent = (data.duration[i] / maxDuration) * 100;
								let barStyles = styleMap({
									width: `${percent}%`
								});

								return html`<tr>
									<td><h2>${nameId}</h2></td>
									<td class="bar" @mouseenter=${tooltip(`${percent.toFixed(1)}% of max`)}>
										<div class="inner-bar" style=${barStyles}></div>
									</td>
									<td class="value">
										${utils.formatDuration(data.duration[i], { showSeconds: true })}
									</td>
								</tr>`;
							}
						)}
					</table>
				</div>
			</div>`;
		};
	}

	avgPlayDurationByGameModeChart() {
		this.displayTitle = 'Average Play Duration By Game Mode';

		this.renderer = () => {
			let data = this.dataSet.avgPlayDurationByGameMode;
			let maxDuration = data.duration.reduce((s, a) => Math.max(s, a), 0);

			return html`<div id="base">
				<h1 id="title">${this.displayTitle}</h1>
				<div id="list">
					<table>
						<tr>
							<th></th>
							<th></th>
							<th></th>
						</tr>
						${repeat(
							data.gameModeNameId,
							nameId => nameId,
							(nameId, i) => {
								let percent = (data.duration[i] / maxDuration) * 100;
								let barStyles = styleMap({
									width: `${percent}%`
								});

								return html`<tr>
									<td><h2>${nameId}</h2></td>
									<td class="bar" @mouseenter=${tooltip(`${percent.toFixed(1)}% of max`)}>
										<div class="inner-bar" style=${barStyles}></div>
									</td>
									<td class="value">
										${utils.formatDuration(data.duration[i], { showSeconds: true })}
									</td>
								</tr>`;
							}
						)}
					</table>
				</div>
			</div>`;
		};
	}

	newPlayersPerSecondChart(data: RivetEe.ee.cloud.NewPlayersPerSecondDataSet) {
		this.structuredDataSets = [
			{
				label: 'New Players',
				data: data.newPlayerCount.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'New Players Per Second';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	newLobbiesPerSecondChart(data: RivetEe.ee.cloud.NewLobbiesPerSecondDataSet) {
		this.structuredDataSets = [
			{
				label: 'New Lobbies',
				data: data.newLobbyCount.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'New Lobbies Per Second';
		this.createOrUpdateChart(createLineChart, this.lineChartOptions);
	}

	destroyedLobbiesByFailureChart(data: RivetEe.ee.cloud.DestroyedLobbiesByFailureDataSet) {
		let lobbyCounts = data.destroyedLobbyCount.map((y, i) => ({ x: data.ts[i], y }));
		this.structuredDataSets = [
			{ label: 'Normal', data: lobbyCounts.filter((_, i) => !data.failed[i]) },
			{ label: 'Failed', data: lobbyCounts.filter((_, i) => data.failed[i]) }
		];

		this.displayTitle = 'Destroyed Lobbies By Failure';
		this.createOrUpdateChart(createBarChart, this.barChartOptions);
	}

	destroyedLobbiesByExitCodeChart(data: RivetEe.ee.cloud.DestroyedLobbiesByExitCodeDataSet) {
		let lobbyCounts = data.destroyedLobbyCount.map((y, i) => ({ x: data.ts[i], y }));
		let uniqueExitCodes = Array.from(new Set(data.exitCode));
		this.structuredDataSets = uniqueExitCodes.map(exitCode => ({
			label: exitCode,
			data: lobbyCounts.filter((_, i) => data.exitCode[i] == exitCode)
		}));

		this.displayTitle = 'Destroyed Lobbies By Exit Code';
		this.createOrUpdateChart(createBarChart, this.barChartOptions);
	}

	failedLobbiesChart(data: RivetEe.ee.cloud.FailedLobbiesDataSet) {
		this.structuredDataSets = [
			{
				label: 'Lobby Count',
				data: data.destroyedLobbyCount.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'Failed Lobbies';
		this.createOrUpdateChart(createBarChart, this.barChartOptions);
	}

	lobbyReadyTimeChart(data: RivetEe.ee.cloud.LobbyReadyTimeDataSet) {
		this.structuredDataSets = [
			{
				label: 'Ready Duration',
				data: data.readyDuration.map((y, i) => ({ x: data.ts[i], y }))
			}
		];

		this.displayTitle = 'Lobby Ready Time';
		this.createOrUpdateChart(createLineChart, DURATION_LINE_CHART_OPTIONS);
	}

	render() {
		return this.renderer();
	}

	defaultRenderer() {
		if (!this.chart) return null;

		return html`<div id="base">
			<h1 id="title">${this.displayTitle}</h1>
			<div id="canvas-holder">${this.chart.canvas}</div>
		</div>`;
	}
}

// Applies custom configurations to chart datasets
function preprocessDatasets(datasets: any[]): any[] {
	// Color the datasets
	for (let i = 0; i < datasets.length; i++) {
		let dataset = datasets[i];

		// Set dataset color
		let [r, g, b] = DATASET_COLORS[i % DATASET_COLORS.length];
		dataset.borderColor = `rgba(${r}, ${g}, ${b})`;
		dataset.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
	}

	return datasets;
}

function createLineChart(
	datasets: any[],
	shadowRoot: ShadowRoot,
	options: ChartOptions<'line'> = LINE_CHART_OPTIONS
) {
	// Create the chart
	let chart = new ChartJs(document.createElement('canvas'), {
		type: 'line',
		data: {
			datasets: datasets
		},
		options
	});

	// HACK: Chart.js's "attach" mutation observer only observes the document and not the shadow
	// root, we fix that here.
	(chart as any).$proxies.attach.observe(shadowRoot, {
		childList: true,
		subtree: true
	});

	return chart;
}

function createBarChart(
	datasets: any[],
	shadowRoot: ShadowRoot,
	options: ChartOptions<'bar'> = BAR_CHART_OPTIONS
) {
	let chart = new ChartJs(document.createElement('canvas'), {
		type: 'bar',
		data: {
			datasets: datasets
		},
		options
	});

	// HACK: Chart.js's "attach" mutation observer only observes the document and not the shadow
	// root, we fix that here.
	(chart as any).$proxies.attach.observe(shadowRoot, {
		childList: true,
		subtree: true
	});

	return chart;
}
