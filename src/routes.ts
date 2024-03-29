import { html, TemplateResult } from 'lit';
import * as pathToRegexp from 'path-to-regexp';
import global from './utils/global';
import utils from './utils/utils';
import { RivetError } from '@rivet-gg/api';
import { Breadcrumb } from './elements/common/rvt-breadcrumbs';
import { GameSettingsRootConfig } from './elements/pages/dev/game/settings/game-settings';
import { GroupSettingsRootConfig } from './elements/pages/dev/group/settings/group-settings';
import { DevGameRootConfig } from './elements/pages/dev/game/pages/rvt-game-dashboard';
import config from './config';
import { computeError } from './elements/common/rvt-error';

export type RenderResult = RenderResultTemplate | RenderResultRedirect;

export interface RenderResultTemplate {
	title: string;
	breadcrumb: Breadcrumb;
	template: TemplateResult;
}

export interface RenderResultRedirect {
	redirect: string;
}

type RouteRender<P, S> = (params: P, search: S) => RenderResult;

type RouteParameters = { [key: string]: string };
type SearchParameters = { [key: string]: string };

type Middleware<P extends RouteParameters, S extends SearchParameters> = (
	params: P,
	search: S
) => null | RenderResult;

type AnyMiddleware = Middleware<any, any>;
type ParametiredMiddleware<Args extends any[], P extends RouteParameters, S extends SearchParameters> = (
	...args: Args
) => Middleware<P, S>;
type AnyParametiredMiddleware = ParametiredMiddleware<any[], any, any>;

type MiddlewaresCreator<P extends RouteParameters, S extends SearchParameters> = () => Middleware<P, S>[];

export class Route<P extends RouteParameters = {}, S extends SearchParameters = {}> {
	path: string;
	render: RouteRender<P, S>;

	pathFunction: pathToRegexp.PathFunction<P>;

	middlewaresCreator?: MiddlewaresCreator<P, S>;

	pathKeys: pathToRegexp.Key[];
	pathRegex: RegExp;

	constructor({
		path,
		render,
		middlewares
	}: {
		path: string;
		render: RouteRender<P, S>;
		middlewares?: MiddlewaresCreator<P, S>;
	}) {
		// Save the properties
		this.path = path;
		this.render = render;

		// Compile path to path builder
		this.pathFunction = pathToRegexp.compile(path);

		// Convert the path to regex
		this.pathKeys = [];
		this.pathRegex = pathToRegexp.pathToRegexp(this.path, this.pathKeys);

		// Append requireConsent as default middleware
		this.middlewaresCreator = middlewares;
	}

	build(params: P, search?: S): string {
		// Get the path
		let path = this.pathFunction(params);

		// Build URL
		return `${window.location.origin}${path}${
			search ? `?${new URLSearchParams(search).toString()}` : ''
		}`;
	}
}

const MIDDLEWARES = {
	validateUuid:
		<const T extends string>(param: T) =>
		(params: Record<T, string>) => {
			if (!utils.validateUuid(params[param])) return responses.notFound();
			return null;
		}
} satisfies Record<string, AnyMiddleware | AnyParametiredMiddleware>;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace routes {
	export let home = new Route({
		path: '/',
		render() {
			return {
				title: 'Home',
				breadcrumb: { type: 'Home' },
				template: html`
					<rvt-user-dashboard .identity="${global.currentIdentity}"></rvt-user-dashboard>
				`
			};
		}
	});

	// Link removed
	export let homeRedirect = new Route({
		path: '/home',
		render() {
			return {
				redirect: routes.home.build({})
			};
		}
	});

	// Moved developer path
	export let developerRedirect = new Route<{ path: string }>({
		path: '/developer/:path*',
		render({ path }, search) {
			return {
				redirect: `${window.location.origin}/${path}${
					search ? `?${new URLSearchParams(search).toString()}` : ''
				}`
			};
		}
	});

	export let groupSettingsRedirect = new Route<{ groupId: string }>({
		path: '/groups/:groupId/settings',
		render({ groupId }) {
			return {
				redirect: routes.groupSettings.build({ groupId, tab: 'general' })
			};
		}
	});

	export let groupSettings = new Route<{ groupId: string; tab?: string }>({
		path: '/groups/:groupId/settings/:tab?',
		render({ groupId, tab }) {
			let tabNames: Record<string, string> = {
				general: 'General',
				members: 'Members'
			};
			return {
				title: 'Settings',
				breadcrumb: { type: 'GroupSettings', groupId: groupId, title: tabNames[tab] },
				template: responses.groupSettings(groupId, {
					general: tab.toLowerCase() === 'general' || tab === undefined,
					members: tab.toLowerCase() === 'members'
				})
			};
		}
	});

	export let groupOverview = new Route<{ id: string }>({
		path: '/groups/:id',
		middlewares: () => [MIDDLEWARES.validateUuid('id')],
		render({ id }) {
			return {
				title: 'Group',
				breadcrumb: { type: 'Group', groupId: id },
				template: html` <page-group .groupId="${id}"></page-group>`
			};
		}
	});

	export let analyticsOverview = new Route<{ groupId: string }>({
		path: '/groups/:groupId/analytics',
		middlewares: () => [MIDDLEWARES.validateUuid('groupId')],
		render({ groupId }) {
			return {
				title: `Analytics`,
				breadcrumb: {
					type: 'Group',
					groupId,
					title: 'Analytics'
				},
				template: html`<page-analytics-overview .groupId=${groupId}></page-analytics-overview>`
			};
		}
	});

	export let groupInvite = new Route<{ code: string }>({
		path: '/invite/:code?',
		render({ code }) {
			return {
				title: 'Group Invite',
				breadcrumb: { type: 'Custom', title: 'Group Invite' },
				template: html`<page-group-invite .code=${code}></page-group-invite>`
			};
		}
	});

	export let settings = new Route<{ tab?: string }>({
		path: '/settings/:tab?',
		render({ tab }) {
			return {
				title: `Settings`,
				breadcrumb: { type: 'Custom', title: 'Settings' },
				template: html`<page-settings .tabId=${tab}></page-settings>`
			};
		}
	});

	export let linkGame = new Route<{ token: string }>({
		path: '/link/:token',
		render({ token }) {
			return {
				title: `Link account`,
				breadcrumb: { type: 'Custom', title: 'Link game' },
				template: html`<page-link-game .token=${token}></page-link-game>`
			};
		}
	});

	export let devDeviceLink = new Route<{ token: string }>({
		path: '/devices/link/:token',
		render({ token }) {
			return {
				title: 'Link Device',
				breadcrumb: { type: 'Custom', title: 'Link device' },
				template: html`<page-dev-device-link .deviceLinkToken=${token}></page-dev-device-link>`
			};
		}
	});

	export let accessTokenLink = new Route<{ token: string }>({
		path: '/access-token/:token',
		render({ token }) {
			return {
				title: `Access Token`,
				breadcrumb: { type: 'Custom', title: 'Access token' },
				template: html`<page-access-token .token=${token}></page-access-token>`
			};
		}
	});

	export let devGame = new Route<{ gameId: string }>({
		path: '/games/:gameId',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId')],
		render({ gameId }) {
			return {
				title: 'Game',
				breadcrumb: { type: 'Game', gameId, title: 'Overview' },
				template: html`<game-overview .gameId="${gameId}"></game-overview> `
			};
		}
	});

	// TODO --> Move this to `/games/:gameId/`
	export let devGameOverview = new Route<{ gameId: string }>({
		path: '/games/:gameId/overview',
		render({ gameId }) {
			return {
				redirect: `${window.location.origin}/games/${gameId}`
			};
		}
	});

	export let devGameSettingsRedirect = new Route<{ gameId: string }>({
		path: '/games/:gameId/settings',
		render({ gameId }) {
			return {
				redirect: routes.devGameSettings.build({ gameId, tab: 'general' })
			};
		}
	});

	export let devGameSettings = new Route<{ gameId: string; tab?: string }>({
		path: '/games/:gameId/settings/:tab?',
		render({ gameId, tab }) {
			let tabNames: Record<string, string> = {
				general: 'General',
				tokens: 'Tokens',
				billing: 'Billing'
			};
			return {
				title: 'Settings',
				breadcrumb: { type: 'GameSettings', gameId: gameId, title: tabNames[tab] },
				template: responses.gameSettings(gameId, {
					general: tab === 'general',
					tokens: tab === 'tokens',
					billing: tab === 'billing'
				})
			};
		}
	});

	export let devNamespace = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Game Namespace',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Overview' },
				template: responses.game(gameId, namespaceId, {
					summary: true,
					namespace: { namespaceId }
				})
			};
		}
	});

	export let devVersionSummary = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/versions',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Namespace Versions',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Version' },
				template: responses.game(gameId, namespaceId, { versionSummary: true })
			};
		}
	});

	export let devVersionSettings = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/settings',
		render({ gameId, namespaceId }) {
			if (!utils.validateUuid(gameId) || !utils.validateUuid(namespaceId)) return responses.notFound();

			return {
				title: 'Game Version Settings',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Settings' },
				template: responses.game(gameId, namespaceId, {
					versionSettings: true,
					namespaceId
				})
			};
		}
	});

	export let devTokens = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/api',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Namespace Tokens',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Tokens' },
				template: responses.game(gameId, namespaceId, { tokens: true, namespaceId })
			};
		}
	});

	export let devLogs = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/logs',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Game Logs',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Logs' },
				template: responses.game(gameId, namespaceId, { logs: true, namespaceId })
			};
		}
	});

	export let devLogLobby = new Route<{ gameId: string; namespaceId: string; lobbyId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/logs/:lobbyId',
		middlewares: () => [
			MIDDLEWARES.validateUuid('gameId'),
			MIDDLEWARES.validateUuid('namespaceId'),
			MIDDLEWARES.validateUuid('lobbyId')
		],
		render({ gameId, namespaceId, lobbyId }) {
			return {
				title: 'Game Logs',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Lobby Logs' },
				template: responses.game(gameId, namespaceId, {
					logs: true,
					namespaceId,
					logsLobbyId: lobbyId
				})
			};
		}
	});

	export let devLobbies = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/lobbies',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Game Lobbies',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'Lobbies' },
				template: responses.game(gameId, namespaceId, { lobbies: true, namespaceId })
			};
		}
	});

	export let devKv = new Route<{ gameId: string; namespaceId: string }>({
		path: '/games/:gameId/namespaces/:namespaceId/kv',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId'), MIDDLEWARES.validateUuid('namespaceId')],
		render({ gameId, namespaceId }) {
			return {
				title: 'Game KV',
				breadcrumb: { type: 'Namespace', gameId, namespaceId, title: 'KV' },
				template: responses.game(gameId, namespaceId, { kv: true, namespaceId })
			};
		}
	});

	export let devBilling = new Route<{ gameId: string }>({
		path: '/games/:gameId/billing',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId')],
		render({ gameId }) {
			return {
				title: 'Game Billing',
				breadcrumb: { type: 'Game', gameId, title: 'Billing' },
				template: responses.game(gameId, null, { sites: true })
			};
		}
	});

	export let kitchenSink = new Route({
		path: '/kitchen-sink',
		render() {
			if (!config.DEBUG) {
				return responses.notFound();
			}
			return {
				title: 'Kitchen Sink',
				breadcrumb: { type: 'Custom', title: 'Kitchen Sink' },
				template: html` <rvt-kitchen-sink></rvt-kichen-sink>`
			};
		}
	});

	export let devBuilds = new Route<{ gameId: string }>({
		path: '/games/:gameId/builds',
		middlewares: () => [MIDDLEWARES.validateUuid('gameId')],
		render({ gameId }) {
			// TODO:
			return responses.notFound();

			return {
				title: 'Game Builds',
				breadcrumb: { type: 'Game', gameId, title: 'Builds' },
				template: responses.game(gameId, null, { builds: true })
			};
		}
	});
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace responses {
	export function forbidden(): RenderResult {
		return {
			title: 'Forbidden',
			breadcrumb: {
				type: 'Custom',
				title: 'Forbidden'
			},

			template: html`<rvt-page-error message="Forbidden"></rvt-page-error>`
		};
	}

	export function badRequest(): RenderResult {
		return {
			title: 'Bad Request',
			breadcrumb: {
				type: 'Custom',
				title: 'Bad request'
			},
			template: html`<rvt-page-error message="Bad Request"></rvt-page-error>`
		};
	}

	export function notFound(): RenderResult {
		return {
			title: 'Not Found',
			breadcrumb: {
				type: 'Custom',
				title: 'Not found'
			},
			template: html`
				<div class="text-center fixed w-full h-32 m-auto left-0 right-0 top-0 bottom-0">
					<h1 class="text-red-500 font-bold text-8xl pr-2">404</h1>
					<h4 class="pb-4 font-semibold">Page Not Found</h4>
					<stylized-button
						class="mx-auto"
						right-icon="solid/arrow-right"
						color="var(--rvt-color-raised-bg)"
						border-color="var(--rvt-color-raised-bg-border-color)"
						border-width=".75px"
						href=${routes.home.build({})}
						>Go Home</stylized-button
					>
				</div>
			`
		};
	}

	export function renderError(error: Error): TemplateResult {
		if (error && Object.prototype.hasOwnProperty.call(error, 'statusText')) {
			let err = error as any as Response;

			if (err.status == 403) return (forbidden() as RenderResultTemplate).template;
		}
		let { title, message, stack } = computeError(error);
		return html`<rvt-page-error .title=${title} .message=${message} .stack=${stack}></rvt-page-error>`;
	}

	export function renderEeOnly(): TemplateResult {
		return html`Enterprise only`;
	}

	export function gameSettings(gameId: string, config: GameSettingsRootConfig) {
		return html`<page-dev-game-settings
			.gameId="${gameId}"
			.config="${config}"
		></page-dev-game-settings>`;
	}

	export function game(gameId: string, namespaceId: string, config: DevGameRootConfig) {
		return html`<rvt-game-dashboard
			.gameId="${gameId}"
			.namespaceId="${namespaceId}"
			.config="${config}"
		></rvt-game-dashboard>`;
	}

	export function groupSettings(groupId: string, config?: GroupSettingsRootConfig) {
		return html` <page-group-settings .groupId="${groupId}" .config="${config}"></page-group-settings>`;
	}
}

export default routes;

// Convert to array so it can be iterated over faster
export const routesArray: Route<any>[] = Object.keys(routes).map(k => (routes as any)[k]);
