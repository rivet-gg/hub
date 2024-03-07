import { Rivet } from '@rivet-gg/api';
import posthog from 'posthog-js';

export const identifyUser = (
	id: string,
	identity?: Pick<Rivet.identity.common.Profile, 'displayName' | 'linkedAccounts' | 'avatarUrl'>
) => {
	throw new Error();
	let properties = {
		name: identity?.displayName,
		email: identity?.linkedAccounts[0].email.email,
		avatar: identity?.avatarUrl
	};

	posthog.identify(`user:${id}`, identity ? properties : undefined);
};
