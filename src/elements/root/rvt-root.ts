import { customElement, property, query } from 'lit/decorators.js';
import { html, LitElement, TemplateResult } from 'lit';
import { cssify } from '../../utils/css';
import global, { GlobalStatus } from '../../utils/global';
import { globalEventGroups, GlobalStatusChangeEvent, windowEventGroups } from '../../utils/global-events';
import timing from '../../utils/timing';
import styles from './rvt-root.scss';
import RvtRouter, { RouteChangeEvent, RouteTitleChangeEvent } from './rvt-router';
import { AlertOption } from '../overlay/alert-panel';
import { ActionSheetItem } from '../overlay/action-sheet';
import RegisterPanel from '../overlay/register-panel';
import config from '../../config';
import { HookFetch } from '../../utils/fetch-hook';
import { DeferredStageEvent, Stage } from '../pages/link-game';
import StylizedButton from '../common/stylized-button';
import { Alignment, Orientation } from '../common/overlay-positioning';
import { DropDownSelectEvent, DropDownSelection } from '../dev/drop-down-list';
import { Breadcrumb } from '../common/rvt-nav';
import { RepeatingRequest } from '../../utils/repeating-request';
import settings from '../../utils/settings';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

export const MIN_SWIPE_THRESHOLD = 10;
const TRANSITION_LENGTH = timing.milliseconds(200); // Match with consts.scss/$transition-length

export interface AlertPanelData {
	title: string | TemplateResult;
	details: TemplateResult;
	options: AlertOption[];
	noDimClose?: boolean; // Disable closing the alert panel by clicking outside of the modal
	active: boolean;
}

interface ActionSheetData {
	contextElement: HTMLElement;
	options: ActionSheetItem[];
	active: boolean;
}

interface TooltipData {
	contextElement: HTMLElement;
	text: string;
	active: boolean;
}

interface ContextMenuData {
	x: number;
	y: number;
	contextElement: HTMLElement;
	content: TemplateResult;
	orientation: Orientation;
	active: boolean;
}

interface DropDownListData<T> {
	contextElement: HTMLElement;
	active: boolean;
	fixed: boolean;
	orientation: Orientation;
	options: DropDownSelection<T>[];
	light: boolean;
	selection: DropDownSelection<T>;
	selectionCb: (event: DropDownSelectEvent<T>) => void;
	bgColor: string;
	highlightColor: string;
}

const ERROR_MESSAGES = [
	{
		title: 'Unknown Error',
		body: "This error has been reported to Rivet's developers. Please try again later."
	}
];

@customElement('rvt-root')
export default class RvtRoot extends LitElement {
	static styles = cssify(styles);

	static shared: RvtRoot;

	// === COMPONENTS ===
	@query('rvt-router')
	router: RvtRouter;

	@query('register-panel')
	registerPanel: RegisterPanel;

	// === DATA ==
	@property({ type: Number })
	globalStatus: GlobalStatus = GlobalStatus.Loading;

	@property({ type: Object })
	alertPanelData: AlertPanelData = { title: '', details: null, options: [], active: false };

	@property({ type: Object })
	actionSheetData: ActionSheetData = { contextElement: null, options: [], active: false };

	@property({ type: Object })
	tooltipData: TooltipData = { contextElement: null, text: '', active: false };

	@property({ type: Object })
	contextMenuData: ContextMenuData = {
		x: 0,
		y: 0,
		contextElement: null,
		content: null,
		orientation: Orientation.TopLeft,
		active: false
	};

	@property({ type: Object })
	dropDownListData: DropDownListData<any> = {
		contextElement: null,
		active: false,
		fixed: false,
		orientation: Orientation.TopLeft,
		options: [],
		light: false,
		selection: null,
		selectionCb: null,
		bgColor: null,
		highlightColor: null
	};

	@property({ type: Object })
	windowSize: { width: number; height: number } = { width: window.innerWidth, height: window.innerHeight };

	@property({ type: String })
	routeTitle = '';

	@property({ type: Boolean })
	registerPanelActive = false;

	@property({ type: Object })
	breadcrumb: Breadcrumb = undefined;

	// True when the user selects "register" instead of "continue as guest" on the link page
	@property({ type: Number })
	deferredLinkGameStage: Stage = null;

	turnstileWidgetId: string = null;

	errorMessage = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

	// === EVENT HANDLERS ===
	handleStatusChange: (e: GlobalStatusChangeEvent) => void;
	handleResize: () => void;
	handleKeyDown: (e: KeyboardEvent) => void;

	// === DEBUG ===
	@property({ type: Object })
	inFlightRequests!: Map<number, URL>;
	@property({ type: Object })
	activeRepeatingRequests = new Map<number, RepeatingRequest<any>>();

	constructor() {
		super();

		// Set singleton
		if (RvtRoot.shared != null) throw new Error('UIRoot.shared has already been set.');
		RvtRoot.shared = this;

		// Hook in to fetch events
		if (config.DEBUG) {
			new HookFetch(inFlight => (this.inFlightRequests = inFlight));
		}
	}

	beforeUnload(event: BeforeUnloadEvent) {
		event.returnValue = 'Are you sure you want to leave?';
	}

	// === LIFECYCLE ===
	connectedCallback() {
		super.connectedCallback();
		// Handle status change
		this.handleStatusChange = this.onStatusChange.bind(this);
		globalEventGroups.add('status-change', this.handleStatusChange);

		// Handle resize
		this.handleResize = this.onResize.bind(this);
		windowEventGroups.add('resize', this.handleResize, timing.milliseconds(100));
		this.onResize();

		// Handle key down
		this.handleKeyDown = this.onKeyDown.bind(this);
		windowEventGroups.add('keydown', this.handleKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		// TODO: Stop listening to live events

		// Remove event listeners
		globalEventGroups.remove('status-change', this.handleStatusChange);
		windowEventGroups.remove('resize', this.handleResize, timing.milliseconds(100));
		windowEventGroups.remove('keydown', this.handleKeyDown);
	}

	// === STATE MANAGEMENT ===
	public showAlertPanel(data?: AlertPanelData) {
		this.alertPanelData = data;
	}

	public hideAlertPanel() {
		globalEventGroups.dispatch('alert-panel-close', false);
		this.alertPanelData.active = false;
		this.requestUpdate('alertPanelData');
	}

	public showActionSheet(data: ActionSheetData) {
		this.actionSheetData = data;
	}

	public hideActionSheet() {
		this.actionSheetData.active = false;
		this.requestUpdate('actionSheetData');
	}

	public showTooltip(contextElement: HTMLElement, text: string) {
		this.tooltipData = {
			contextElement,
			text,
			active: true
		};
	}

	public hideTooltip() {
		if (!this.tooltipData.active) return;

		this.tooltipData.active = false;
		this.requestUpdate('tooltipData');
	}

	public showContextMenu(
		contextElement: HTMLElement,
		x: number,
		y: number,
		content: TemplateResult,
		orientation: Orientation = Orientation.TopLeft
	) {
		this.contextMenuData = {
			x: Math.round(x),
			y: Math.round(y),
			contextElement,
			content,
			orientation,
			active: true
		};
	}

	public hideContextMenu() {
		if (!this.contextMenuData.active) return;

		this.contextMenuData.active = false;
		this.requestUpdate('contextMenuData');
	}

	public openDropDownList<T>(data: DropDownListData<T>) {
		this.dropDownListData = data;
	}

	public closeDropDownList() {
		this.dropDownListData.active = false;
		this.requestUpdate('dropDownListData');
	}

	onStatusChange(e: GlobalStatusChangeEvent) {
		this.globalStatus = e.value;
	}

	onResize() {
		// Update pip window size
		this.windowSize.width = window.innerWidth;
		this.windowSize.height = window.innerHeight;
		this.requestUpdate('windowSize');

		// Turn off the tooltip and context menu on resize
		this.hideContextMenu();
		this.hideActionSheet();
		this.hideTooltip();
	}

	onKeyDown(event: KeyboardEvent) {
		// Close overlays
		if (event.code == 'Escape') {
			// Alert panel takes precedence over search panel
			if (this.contextMenuData.active) {
				this.hideContextMenu();
			} else if (this.alertPanelData.active) {
				this.hideAlertPanel();
			}
		}
	}

	onRouteChange(event: RouteChangeEvent) {
		this.breadcrumb = event.breadcrumb;

		this.routeTitle = event.title;

		// Hide context menu
		this.hideContextMenu();
	}

	onTitleChange(event: RouteTitleChangeEvent) {
		// Update title name after the page animation is complete
		setTimeout(() => {
			this.routeTitle = event.title;
		}, TRANSITION_LENGTH);
	}

	onLoginButtonClick() {
		global.suppressLoadingAnimationDuringConsent = true;
		global.grantConsent();
		this.openRegisterPanel();
	}

	openRegisterPanel() {
		this.registerPanelActive = true;
	}

	closeRegisterPanel() {
		this.registerPanelActive = false;
	}

	// Manage loading status
	hideLoading() {
		document.getElementById('loading').classList.add('hidden');
	}

	showLoading() {
		document.getElementById('loading').classList.remove('hidden');
	}

	promptCaptcha(): Promise<string> {
		return new Promise((resolve, reject) => {
			let element: HTMLElement = document.body.querySelector('#turnstile');

			if (element) {
				element.style.removeProperty('display');
			} else {
				element = document.createElement('div');
				element.setAttribute('id', 'turnstile');
				element.addEventListener('click', e => {
					if (e.target === e.currentTarget) this.closeCaptcha();
				});

				let cancel = new StylizedButton();
				cancel.addEventListener('click', this.closeCaptcha.bind(this));
				cancel.append(document.createTextNode('Cancel'));
				element.append(cancel);

				document.body.append(element);
			}

			this.turnstileWidgetId = turnstile.render(element, {
				sitekey: global.bootstrapData.captcha.turnstile.siteKey,
				callback: (token: string) => {
					this.closeCaptcha();
					resolve(token);
				},
				'error-callback': err => {
					this.closeCaptcha();
					reject(err);
				}
			});
		});
	}

	closeCaptcha() {
		let element: HTMLElement = document.body.querySelector('#turnstile');

		if (element) {
			element.style.setProperty('display', 'none');
			turnstile.remove(this.turnstileWidgetId);
		}
	}

	// === RENDER ===
	render() {
		let content = null;

		// NOTE: Game link page has own flow
		if (
			window.location.pathname.startsWith('/link/') &&
			(this.globalStatus == GlobalStatus.Consenting ||
				this.globalStatus == GlobalStatus.Unregistered ||
				this.globalStatus == GlobalStatus.Connected ||
				this.globalStatus == GlobalStatus.Reconnecting)
		) {
			this.hideLoading();

			let token = window.location.pathname.split('/')[2];
			content = html`
				<page-link-game
					.token="${token}"
					.initStage="${ifDefined(this.deferredLinkGameStage)}"
					@deferred-stage="${(e: DeferredStageEvent) => (this.deferredLinkGameStage = e.stage)}"
				></page-link-game>
			`;
		} else {
			switch (this.globalStatus) {
				// Loading
				case GlobalStatus.Loading:
				case GlobalStatus.Bootstrapping:
					this.showLoading();
					break;
				case GlobalStatus.Consenting:
				case GlobalStatus.Unregistered:
					this.hideLoading();
					content = html`
						<div class="flex justify-center min-h-full w-full">
							<rvt-user-consent
								class="self-center"
								@login=${RvtRoot.shared.onLoginButtonClick}
							></rvt-user-consent>
						</div>
					`;
					break;
				case GlobalStatus.Connected:
				case GlobalStatus.Reconnecting:
					// Continue as normal
					this.hideLoading();
					content = html`
						<!-- Page Body -->
						<div id="content-holder" class="min-h-screen flex pt-14 box-border">
							<rvt-router
								@change="${this.onRouteChange.bind(this)}"
								@title-change="${this.onTitleChange.bind(this)}"
							></rvt-router>
						</div>
					`;
					break;

				// Failures
				case GlobalStatus.AuthFailed:
					this.showLoading();
					break;
				case GlobalStatus.BootstrapFailed:
					this.hideLoading();
					let error = (global.bootstrapError?.stack || global.bootstrapError).toString();
					content = html`
						<e-svg class="text-5xl w-full text-center mb-2" src="solid/bomb"></e-svg>
						<h1>${this.errorMessage.title}</h1>
						<p>${this.errorMessage.body}</p>
						<div class="mt-2">
							<code
								class="mt-1 no-ligatures thick text-left w-3/4 inline-block select-text whitespace-pre-wrap"
								>${error}</code
							>
						</div>
						<rvt-button @click=${() => window.location.reload()}>Reload</rvt-button>
					`;
					break;
			}
		}

		return html` ${this.renderOverlays()} ${content} `;
	}

	renderDebug() {
		let activeRepeatingRequests = [...this.activeRepeatingRequests.values()];
		activeRepeatingRequests.sort((a, b) => b.createTimestamp - a.createTimestamp);

		return html`
			<div id="debug">
				<div id="build-info">
					${config.RIVET_NAMESPACE ?? 'unknown'} &mdash; ${config.GIT_BRANCH} &mdash;
					${config.GIT_COMMIT.substring(0, 8)}
				</div>

				<div id="in-flight-requests">
					<ul>
						${repeat(
							activeRepeatingRequests,
							x => x.id,
							x => {
								let date = new Date(x.createTimestamp);

								return html`<li>${x.name} – ${date.toLocaleTimeString()}</li>`;
							}
						)}
					</ul>
				</div>
			</div>
		`;
	}

	renderOverlays() {
		return html`
			<!-- Debug -->
			${when(config.DEBUG, () => this.renderDebug())}

			<!-- Nav -->
			<rvt-nav .routeTitle="${this.routeTitle}" .breadcrumbs="${this.breadcrumb}"></rvt-nav>

			<!-- Alert overlay -->
			<drop-down-modal
				.active="${this.alertPanelData.active}"
				.no-dim-close="${this.alertPanelData && this.alertPanelData.noDimClose}"
				@close="${this.hideAlertPanel.bind(this)}"
			>
				<modal-body slot="body">
					<alert-panel
						.data="${this.alertPanelData}"
						@select="${this.hideAlertPanel.bind(this)}"
					></alert-panel>
				</modal-body>
			</drop-down-modal>

			<!-- Action sheet -->
			<overlay-positioning
				.active="${this.actionSheetData.active}"
				.contextElement="${this.actionSheetData.contextElement}"
				.orientation="${Orientation.TopCenter}"
				scale-animation
				offset-y="5"
				@close="${this.hideActionSheet.bind(this)}"
			>
				<action-sheet
					.options="${this.actionSheetData.options}"
					@select="${this.hideActionSheet.bind(this)}"
				></action-sheet>
			</overlay-positioning>

			<!-- Notification Layer -->
			<notification-overlay></notification-overlay>

			<!-- Tooltip -->
			<overlay-positioning
				.active="${this.tooltipData.active}"
				.contextElement="${this.tooltipData.contextElement}"
				.orientation="${Orientation.TopCenter}"
				@close="${this.hideTooltip.bind(this)}"
				no-pointer
				scale-animation
				offset-y="5"
			>
				<div id="tooltip">${this.tooltipData.text}</div>
			</overlay-positioning>

			<!-- Context menu -->
			<overlay-positioning
				manual
				.active="${this.contextMenuData.active}"
				.anchorX="${this.contextMenuData.x}"
				.anchorY="${this.contextMenuData.y}"
				.contextElement="${this.contextMenuData.contextElement}"
				.orientation="${this.contextMenuData.orientation}"
				@close="${this.hideContextMenu.bind(this)}"
			>
				${this.contextMenuData.content}
			</overlay-positioning>

			<!-- Register overlay -->
			${when(
				global.currentIdentity,
				() =>
					html`<drop-down-modal
							.active="${this.registerPanelActive}"
							@close="${this.closeRegisterPanel.bind(this)}"
						>
							<modal-body slot="body">
								<register-panel
									.active="${this.registerPanelActive}"
									light
									@close="${this.closeRegisterPanel.bind(this)}"
									autofocus
								></register-panel>
							</modal-body>
						</drop-down-modal>

						<overlay-positioning
							.active="${this.dropDownListData.active}"
							.contextElement="${this.dropDownListData.contextElement}"
							.orientation="${this.dropDownListData.orientation}"
							.alignment="${Alignment.Corner}"
							.fadeAnimation="${false}"
							@close="${this.closeDropDownList.bind(this)}"
						>
							<drop-down-list
								overlay
								.selection="${this.dropDownListData.selection}"
								.options="${this.dropDownListData.options}"
								?fixed="${this.dropDownListData.fixed}"
								.light="${this.dropDownListData.light}"
								.bgColor="${this.dropDownListData.bgColor}"
								.highlightColor="${this.dropDownListData.highlightColor}"
								@select="${this.dropDownListData.selectionCb}"
								@close="${this.closeDropDownList.bind(this)}"
							></drop-down-list>
						</overlay-positioning> `
			)}
		`;
	}
}
