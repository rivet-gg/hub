// DEPRECATED
//
// Use @rivet-gg/api instead

import * as portal from '@rivet-gg/portal';
import * as identity from '@rivet-gg/identity';
import * as group from '@rivet-gg/group';
import * as kv from '@rivet-gg/kv';
import * as auth from '@rivet-gg/auth';

export const requestHandlerMiddleware = portal.common.middleware.requestHandlerMiddleware;

export { portal, identity, group, auth, kv };

//
//
//

import { fetcher, apiResponse } from '@rivet-gg/api';
import { GlobalState } from './global';
import logging from './logging';

/**
 * Modifies the Fern arguments to remove headers that are not whitelisted in our CORS policy.
 */
export function modifyFernArgs(args: fetcher.Fetcher.Args) {
	// Remove headers starting with `x-fern-` since this is not white listed in our CORS policy
	for (let key in args.headers) {
		if (key.toLowerCase().startsWith('x-fern-')) delete args.headers[key];
	}
}

export function refreshFetcher(global: GlobalState) {
	return async (args: fetcher.Fetcher.Args) => {
		modifyFernArgs(args);

		// Make initial request
		let response = await customFetcher<any>(args);

		// Check for auth expired error
		let error = (response as apiResponse.FailedResponse<fetcher.Fetcher.Error>).error;
		if (
			error &&
			error.reason == 'status-code' &&
			(error.body as any).code == 'CLAIMS_ENTITLEMENT_EXPIRED'
		) {
			logging.debug('Auth expired, refreshing token from middleware');

			// The Fern API client doesn't re-fetch the token from the fetcher, we have to set it manually
			let { token } = await global.authManager.fetchToken(true);
			args.headers['Authorization'] = `Bearer ${token}`;

			// Retry request after refreshing auth
			return await customFetcher<any>(args);
		}

		return response;
	};
}

export function basicFetcher() {
	return async (args: fetcher.Fetcher.Args) => {
		modifyFernArgs(args);

		return await customFetcher<any>(args);
	};
}

// NOTE: fetcher copied and modified from Fern
var INITIAL_RETRY_DELAY = 1;
var MAX_RETRY_DELAY = 60;
var DEFAULT_MAX_RETRIES = 2;
async function customFetcher<R = unknown>(
	args: fetcher.Fetcher.Args
): Promise<apiResponse.APIResponse<R, fetcher.Fetcher.Error>> {
	let headers: Record<string, string | undefined> = {};

	// Add content type header
	if (args.body !== undefined && args.contentType != null) {
		headers['Content-Type'] = args.contentType;
	}

	// Add argument headers
	if (args.headers != null) {
		for (let [key, value] of Object.entries(args.headers)) {
			if (value != null) {
				headers[key] = value;
			}
		}
	}

	// Format query parameters
	let url: string;
	if (args.queryParameters && Object.keys(args.queryParameters).length) {
		let query = Object.entries(args.queryParameters)
			.flatMap(([k, v]) => {
				if (v instanceof Array) {
					return v.map(vi => `${k}=${encodeURIComponent(vi)}`);
				} else {
					return [`${k}=${encodeURIComponent(v)}`];
				}
			})
			.join('&');
		url = `${args.url}?${query}`;
	} else {
		url = args.url;
	}

	let body = JSON.stringify(args.body);

	let makeRequest = async () => {
		let controller = new AbortController();
		let abortId;
		if (args.timeoutMs != null) {
			abortId = setTimeout(() => controller.abort(), args.timeoutMs);
		}

		let response = await fetch(url, {
			method: args.method,
			headers,
			body,
			signal: controller.signal,
			// NOTE: This was originally the only change made to the stock Fern fetcher. In newer versions,
			// Fern sets `credentials` to "include" so this is unnecessary but it is good to keep this custom
			// fetcher if future changes are required.
			credentials: 'include'
		});

		if (abortId != null) clearTimeout(abortId);

		return response;
	};

	try {
		let response = await makeRequest();

		// Retry loop
		for (let i = 0; i < (args.maxRetries ?? DEFAULT_MAX_RETRIES); ++i) {
			if (
				response.status === 408 ||
				response.status === 409 ||
				response.status === 429 ||
				response.status >= 500
			) {
				const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(i, 2), MAX_RETRY_DELAY);

				await new Promise(resolve => setTimeout(resolve, delay));
				response = await makeRequest();
			} else {
				break;
			}
		}

		let resBody;
		if (response.body != null && args.responseType === 'blob') {
			resBody = await response.blob();
		} else if (response.body != null && args.responseType === 'streaming') {
			resBody = response.body;
		} else if (response.body != null) {
			try {
				resBody = await response.json();
			} catch (err) {
				return {
					ok: false,
					error: {
						reason: 'non-json',
						statusCode: response.status,
						rawBody: await response.text()
					}
				};
			}
		}
		if (response.status >= 200 && response.status < 400) {
			return {
				ok: true,
				body: resBody,
				headers: response.headers
			};
		} else {
			return {
				ok: false,
				error: {
					reason: 'status-code',
					statusCode: response.status,
					body: resBody
				}
			};
		}
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			return {
				ok: false,
				error: {
					reason: 'timeout'
				}
			};
		} else if (error instanceof Error) {
			return {
				ok: false,
				error: {
					reason: 'unknown',
					errorMessage: error.message
				}
			};
		}
		return {
			ok: false,
			error: {
				reason: 'unknown',
				errorMessage: JSON.stringify(error)
			}
		};
	}
}
