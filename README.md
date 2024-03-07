# Rivet Hub

_This is the source code for the [Rivet Hub](https://hub.rivet.gg) frontend_

**Also check out the [Rivet backend](https://github.com/rivet-gg/rivet) for issues, documentation, and more.**

## Requirements

-   [NodeJS](https://nodejs.org/en/) v16+
-   [Yarn](https://yarnpkg.com/)

## Getting started

Run the following command:

```bash
yarn start
```

This will open `http://localhost:5080` in your browser. By default, this will connect to Rivet's staging servers (https://staging2.gameinc.io).

## Testing

Run the following command:

```bash
yarn test
```

or use [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

## Developing with self-hosted backend

> **Where do I self-host the backend?**
>
> See our backend repo [here](https://github.com/rivet-gg/rivet).

### Configuration `RIVET_API_ENDPOINT`

To configure the hub to connect to your own server (for example, `mydomain.com`), update the `.env` file in this folder to include the following:

```
RIVET_API_ENDPOINT=https://api.mydomain.com
```

### Backend configuration

If self-hosting your own backend, the default configuration assumes the hub will be hosted at `https://hub.{your domain}`. You may want to change the following namespace config parameters:

**`dns.hub_origin`** (default: `https://hub.{main domain}`)

This configures the origin that the API will build URLs for.

For example, `identity.getProfile` returns a URL to the hub profile in `identity.external.profile`.

**`rivet.api.hub_origin_regex`** (default: `^https://hub\\.{main domain}$`)

This configurs the CORS origin regex. This allows you to secure where requests can come from to your hub.

If you are running your own cluster for development, consider updating the CORS rules to include `localhost` similar to below.

## CORS

`staging2.gameinc.io` CORS is specially configured to have the following origin regex:

```regex
^https?://(hub\\.rivet\\.gg|[^\\.]+\\.rivet-hub\\.pages\\.dev|localhost:\\d+|192\\.168\\.\\d+\\.\\d+:\\d+|0\\.0\\.0\\.0\\.:\\d+)$
```

This lets you develop with the hub using localhost.

## Filing issues

All Hub issues are managed in the [main Rivet repository](https://github.com/rivet-gg/rivet).
