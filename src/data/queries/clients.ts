import {
	QueryClient,
	onlineManager,
	QueryObserver,
	QueryObserverResult,
	QueryObserverOptions,
	QueryFunction
} from '@tanstack/query-core';
import { TanstackQueryDevtools } from '@tanstack/query-devtools';
import { global } from '../../utils/global';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import * as cloud from '@rivet-gg/cloud';

export const queryClient = new QueryClient();

export const QueryDevtools = new TanstackQueryDevtools({
	client: queryClient,
	queryFlavor: 'Lit Query 🔥',
	version: '5',
	onlineManager: onlineManager
});

export const createQuery = <TData, TQueryFnData = QueryFunction<TData>>(
	opts: QueryObserverOptions<TQueryFnData>
) => {
	return class X implements ReactiveController {
		query: QueryObserverResult<TQueryFnData>;

		private observer: QueryObserver<TQueryFnData>;
		private unsubscribe: () => void;

		constructor(private host: ReactiveControllerHost) {
			host.addController(this);
		}

		hostConnected() {
			this.observer = new QueryObserver<TQueryFnData>(queryClient, opts);
			this.unsubscribe = this.observer.subscribe(this.onQueryUpdate);
		}

		hostDisconnected(): void {
			this.unsubscribe();
		}

		private onQueryUpdate = (data: QueryObserverResult<TQueryFnData>) => {
			this.query = data;
			this.host.requestUpdate();
		};
	};
};

// fixme
export const createLiveQuery = <TData, TQueryFnData = QueryFunction<TData>>(
	opts: QueryObserverOptions<TQueryFnData>
) => {
	return class Y implements ReactiveController {
		query: QueryObserverResult<TQueryFnData>;

		private observer: QueryObserver<TQueryFnData>;
		private unsubscribe: () => void;

		constructor(private host: ReactiveControllerHost) {
			host.addController(this);
		}

		hostConnected() {
			this.observer = new QueryObserver<TQueryFnData>(queryClient, opts);
			this.unsubscribe = this.observer.subscribe(this.onQueryUpdate);
		}

		hostDisconnected(): void {
			this.unsubscribe();
		}

		private onQueryUpdate = async (data: QueryObserverResult<TQueryFnData>) => {
			this.query = data;
			this.host.requestUpdate();

			if (
				typeof data.data === 'object' &&
				'watch' in data.data &&
				typeof data.data.watch === 'object' &&
				'index' in data.data.watch &&
				data.data.watch.index
			) {
				this.observer.setOptions({
					...opts,
					refetchInterval: 2000,
					meta: { watch: data.data.watch }
				});
				console.log('changed options', data.data.watch.index);
			}
		};
	};
};

export const GamesQuery = createLiveQuery({
	queryKey: ['games'],
	queryFn: ({ meta }) => {
		// @ts-ignore
		return global.cloud.getGames({ watchIndex: meta?.watch?.index });
	}
});
