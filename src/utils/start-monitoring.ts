import posthog from 'posthog-js';
import * as Sentry from '@sentry/browser';
import config from '../config';

posthog.init('phc_6kfTNEAVw7rn1LA51cO3D69FefbKupSWFaM7OUgEpEo', {
	api_host: 'https://ph.rivet.gg',
	loaded: posthog => {
		if (config.DEBUG) posthog.debug();
	}
});

Sentry.init({
	dsn: 'https://66a566505cfb4341732a3d350f2b87e2@o4504307129188352.ingest.sentry.io/4506435887366144',
	environment: config.RIVET_NAMESPACE,
	tracePropagationTargets: ['localhost', 'api.staging2.gameinc.io', 'api.rivet.gg'],
	integrations: [
		new posthog.SentryIntegration(posthog, 'rivet-gg', 4506435887366144),
		new Sentry.Replay(),
		new Sentry.BrowserTracing()
	]
});
