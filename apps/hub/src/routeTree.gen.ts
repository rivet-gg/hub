/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedLayoutImport } from './routes/_authenticated/_layout'
import { Route as AuthenticatedLayoutIndexImport } from './routes/_authenticated/_layout/index'
import { Route as AuthenticatedInviteInviteCodeImport } from './routes/_authenticated/invite.$inviteCode'
import { Route as AuthenticatedLayoutMyProfileImport } from './routes/_authenticated/_layout/my-profile'
import { Route as AuthenticatedDevicesLinkTokenImport } from './routes/_authenticated/devices.link.$token'
import { Route as AuthenticatedLayoutTeamsGroupIdImport } from './routes/_authenticated/_layout/teams/$groupId'
import { Route as AuthenticatedLayoutGamesGameIdImport } from './routes/_authenticated/_layout/games/$gameId'
import { Route as AuthenticatedLayoutTeamsGroupIdIndexImport } from './routes/_authenticated/_layout/teams/$groupId/index'
import { Route as AuthenticatedLayoutGamesGameIdIndexImport } from './routes/_authenticated/_layout/games/$gameId/index'
import { Route as AuthenticatedLayoutTeamsGroupIdSettingsImport } from './routes/_authenticated/_layout/teams/$groupId/settings'
import { Route as AuthenticatedLayoutTeamsGroupIdMembersImport } from './routes/_authenticated/_layout/teams/$groupId/members'
import { Route as AuthenticatedLayoutTeamsGroupIdBillingImport } from './routes/_authenticated/_layout/teams/$groupId/billing'
import { Route as AuthenticatedLayoutGamesGameIdTokensImport } from './routes/_authenticated/_layout/games/$gameId/tokens'
import { Route as AuthenticatedLayoutGamesGameIdSettingsImport } from './routes/_authenticated/_layout/games/$gameId/settings'
import { Route as AuthenticatedLayoutGamesGameIdBillingImport } from './routes/_authenticated/_layout/games/$gameId/billing'
import { Route as AuthenticatedLayoutGamesGameIdBackendImport } from './routes/_authenticated/_layout/games/$gameId/backend'
import { Route as AuthenticatedLayoutTeamsGroupIdSettingsIndexImport } from './routes/_authenticated/_layout/teams/$groupId/settings/index'
import { Route as AuthenticatedLayoutGamesGameIdSettingsIndexImport } from './routes/_authenticated/_layout/games/$gameId/settings/index'
import { Route as AuthenticatedLayoutGamesGameIdBackendIndexImport } from './routes/_authenticated/_layout/games/$gameId/backend/index'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId'
import { Route as AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport } from './routes/_authenticated/_layout/games/$gameId/backend/$environmentId'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdIndexImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/index'
import { Route as AuthenticatedLayoutGamesGameIdBackendEnvironmentIdIndexImport } from './routes/_authenticated/_layout/games/$gameId/backend/$environmentId/index'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdVersionsImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/versions'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdTokensImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/tokens'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdCdnImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/cdn'
import { Route as AuthenticatedLayoutGamesGameIdBackendEnvironmentIdVariablesImport } from './routes/_authenticated/_layout/games/$gameId/backend/$environmentId/variables'
import { Route as AuthenticatedLayoutGamesGameIdBackendEnvironmentIdLogsImport } from './routes/_authenticated/_layout/games/$gameId/backend/$environmentId/logs'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerIndexImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker/index'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerSettingsImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker/settings'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLobbiesImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker/lobbies'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsIndexImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker/logs/index'
import { Route as AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsLobbyIdImport } from './routes/_authenticated/_layout/games/$gameId_/namespaces/$namespaceId/matchmaker/logs/$lobbyId'

// Create/Update Routes

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedLayoutRoute = AuthenticatedLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedLayoutIndexRoute = AuthenticatedLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedLayoutRoute,
} as any)

const AuthenticatedInviteInviteCodeRoute =
  AuthenticatedInviteInviteCodeImport.update({
    path: '/invite/$inviteCode',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedLayoutMyProfileRoute =
  AuthenticatedLayoutMyProfileImport.update({
    path: '/my-profile',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedDevicesLinkTokenRoute =
  AuthenticatedDevicesLinkTokenImport.update({
    path: '/devices/link/$token',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdRoute =
  AuthenticatedLayoutTeamsGroupIdImport.update({
    path: '/teams/$groupId',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdRoute =
  AuthenticatedLayoutGamesGameIdImport.update({
    path: '/games/$gameId',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdIndexRoute =
  AuthenticatedLayoutTeamsGroupIdIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutTeamsGroupIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdIndexRoute =
  AuthenticatedLayoutGamesGameIdIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdSettingsRoute =
  AuthenticatedLayoutTeamsGroupIdSettingsImport.update({
    path: '/settings',
    getParentRoute: () => AuthenticatedLayoutTeamsGroupIdRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdMembersRoute =
  AuthenticatedLayoutTeamsGroupIdMembersImport.update({
    path: '/members',
    getParentRoute: () => AuthenticatedLayoutTeamsGroupIdRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdBillingRoute =
  AuthenticatedLayoutTeamsGroupIdBillingImport.update({
    path: '/billing',
    getParentRoute: () => AuthenticatedLayoutTeamsGroupIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdTokensRoute =
  AuthenticatedLayoutGamesGameIdTokensImport.update({
    path: '/tokens',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdSettingsRoute =
  AuthenticatedLayoutGamesGameIdSettingsImport.update({
    path: '/settings',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBillingRoute =
  AuthenticatedLayoutGamesGameIdBillingImport.update({
    path: '/billing',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendRoute =
  AuthenticatedLayoutGamesGameIdBackendImport.update({
    path: '/backend',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdRoute,
  } as any)

const AuthenticatedLayoutTeamsGroupIdSettingsIndexRoute =
  AuthenticatedLayoutTeamsGroupIdSettingsIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutTeamsGroupIdSettingsRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdSettingsIndexRoute =
  AuthenticatedLayoutGamesGameIdSettingsIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdSettingsRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendIndexRoute =
  AuthenticatedLayoutGamesGameIdBackendIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdBackendRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport.update({
    path: '/games/$gameId/namespaces/$namespaceId',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute =
  AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport.update({
    path: '/$environmentId',
    getParentRoute: () => AuthenticatedLayoutGamesGameIdBackendRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdIndexRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdIndexImport.update({
    path: '/',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendEnvironmentIdIndexRoute =
  AuthenticatedLayoutGamesGameIdBackendEnvironmentIdIndexImport.update({
    path: '/',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdVersionsRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdVersionsImport.update({
    path: '/versions',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdTokensRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdTokensImport.update({
    path: '/tokens',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport.update({
    path: '/matchmaker',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdCdnRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdCdnImport.update({
    path: '/cdn',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendEnvironmentIdVariablesRoute =
  AuthenticatedLayoutGamesGameIdBackendEnvironmentIdVariablesImport.update({
    path: '/variables',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdBackendEnvironmentIdLogsRoute =
  AuthenticatedLayoutGamesGameIdBackendEnvironmentIdLogsImport.update({
    path: '/logs',
    getParentRoute: () =>
      AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute,
  } as any)

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerIndexRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerIndexImport.update(
    {
      path: '/',
      getParentRoute: () =>
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute,
    } as any,
  )

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerSettingsRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerSettingsImport.update(
    {
      path: '/settings',
      getParentRoute: () =>
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute,
    } as any,
  )

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLobbiesRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLobbiesImport.update(
    {
      path: '/lobbies',
      getParentRoute: () =>
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute,
    } as any,
  )

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsIndexRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsIndexImport.update(
    {
      path: '/logs/',
      getParentRoute: () =>
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute,
    } as any,
  )

const AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsLobbyIdRoute =
  AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsLobbyIdImport.update(
    {
      path: '/logs/$lobbyId',
      getParentRoute: () =>
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute,
    } as any,
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/_layout': {
      id: '/_authenticated/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedLayoutImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout/my-profile': {
      id: '/_authenticated/_layout/my-profile'
      path: '/my-profile'
      fullPath: '/my-profile'
      preLoaderRoute: typeof AuthenticatedLayoutMyProfileImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/invite/$inviteCode': {
      id: '/_authenticated/invite/$inviteCode'
      path: '/invite/$inviteCode'
      fullPath: '/invite/$inviteCode'
      preLoaderRoute: typeof AuthenticatedInviteInviteCodeImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout/': {
      id: '/_authenticated/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedLayoutIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/games/$gameId': {
      id: '/_authenticated/_layout/games/$gameId'
      path: '/games/$gameId'
      fullPath: '/games/$gameId'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/teams/$groupId': {
      id: '/_authenticated/_layout/teams/$groupId'
      path: '/teams/$groupId'
      fullPath: '/teams/$groupId'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/devices/link/$token': {
      id: '/_authenticated/devices/link/$token'
      path: '/devices/link/$token'
      fullPath: '/devices/link/$token'
      preLoaderRoute: typeof AuthenticatedDevicesLinkTokenImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout/games/$gameId/backend': {
      id: '/_authenticated/_layout/games/$gameId/backend'
      path: '/backend'
      fullPath: '/games/$gameId/backend'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdImport
    }
    '/_authenticated/_layout/games/$gameId/billing': {
      id: '/_authenticated/_layout/games/$gameId/billing'
      path: '/billing'
      fullPath: '/games/$gameId/billing'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBillingImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdImport
    }
    '/_authenticated/_layout/games/$gameId/settings': {
      id: '/_authenticated/_layout/games/$gameId/settings'
      path: '/settings'
      fullPath: '/games/$gameId/settings'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdSettingsImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdImport
    }
    '/_authenticated/_layout/games/$gameId/tokens': {
      id: '/_authenticated/_layout/games/$gameId/tokens'
      path: '/tokens'
      fullPath: '/games/$gameId/tokens'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdTokensImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdImport
    }
    '/_authenticated/_layout/teams/$groupId/billing': {
      id: '/_authenticated/_layout/teams/$groupId/billing'
      path: '/billing'
      fullPath: '/teams/$groupId/billing'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdBillingImport
      parentRoute: typeof AuthenticatedLayoutTeamsGroupIdImport
    }
    '/_authenticated/_layout/teams/$groupId/members': {
      id: '/_authenticated/_layout/teams/$groupId/members'
      path: '/members'
      fullPath: '/teams/$groupId/members'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdMembersImport
      parentRoute: typeof AuthenticatedLayoutTeamsGroupIdImport
    }
    '/_authenticated/_layout/teams/$groupId/settings': {
      id: '/_authenticated/_layout/teams/$groupId/settings'
      path: '/settings'
      fullPath: '/teams/$groupId/settings'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdSettingsImport
      parentRoute: typeof AuthenticatedLayoutTeamsGroupIdImport
    }
    '/_authenticated/_layout/games/$gameId/': {
      id: '/_authenticated/_layout/games/$gameId/'
      path: '/'
      fullPath: '/games/$gameId/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdImport
    }
    '/_authenticated/_layout/teams/$groupId/': {
      id: '/_authenticated/_layout/teams/$groupId/'
      path: '/'
      fullPath: '/teams/$groupId/'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdIndexImport
      parentRoute: typeof AuthenticatedLayoutTeamsGroupIdImport
    }
    '/_authenticated/_layout/games/$gameId/backend/$environmentId': {
      id: '/_authenticated/_layout/games/$gameId/backend/$environmentId'
      path: '/$environmentId'
      fullPath: '/games/$gameId/backend/$environmentId'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdBackendImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId'
      path: '/games/$gameId/namespaces/$namespaceId'
      fullPath: '/games/$gameId/namespaces/$namespaceId'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/games/$gameId/backend/': {
      id: '/_authenticated/_layout/games/$gameId/backend/'
      path: '/'
      fullPath: '/games/$gameId/backend/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdBackendImport
    }
    '/_authenticated/_layout/games/$gameId/settings/': {
      id: '/_authenticated/_layout/games/$gameId/settings/'
      path: '/'
      fullPath: '/games/$gameId/settings/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdSettingsIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdSettingsImport
    }
    '/_authenticated/_layout/teams/$groupId/settings/': {
      id: '/_authenticated/_layout/teams/$groupId/settings/'
      path: '/'
      fullPath: '/teams/$groupId/settings/'
      preLoaderRoute: typeof AuthenticatedLayoutTeamsGroupIdSettingsIndexImport
      parentRoute: typeof AuthenticatedLayoutTeamsGroupIdSettingsImport
    }
    '/_authenticated/_layout/games/$gameId/backend/$environmentId/logs': {
      id: '/_authenticated/_layout/games/$gameId/backend/$environmentId/logs'
      path: '/logs'
      fullPath: '/games/$gameId/backend/$environmentId/logs'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdLogsImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport
    }
    '/_authenticated/_layout/games/$gameId/backend/$environmentId/variables': {
      id: '/_authenticated/_layout/games/$gameId/backend/$environmentId/variables'
      path: '/variables'
      fullPath: '/games/$gameId/backend/$environmentId/variables'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdVariablesImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/cdn': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/cdn'
      path: '/cdn'
      fullPath: '/games/$gameId/namespaces/$namespaceId/cdn'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdCdnImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker'
      path: '/matchmaker'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/tokens': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/tokens'
      path: '/tokens'
      fullPath: '/games/$gameId/namespaces/$namespaceId/tokens'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdTokensImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/versions': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/versions'
      path: '/versions'
      fullPath: '/games/$gameId/namespaces/$namespaceId/versions'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdVersionsImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
    }
    '/_authenticated/_layout/games/$gameId/backend/$environmentId/': {
      id: '/_authenticated/_layout/games/$gameId/backend/$environmentId/'
      path: '/'
      fullPath: '/games/$gameId/backend/$environmentId/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdBackendEnvironmentIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/'
      path: '/'
      fullPath: '/games/$gameId/namespaces/$namespaceId/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/lobbies': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/lobbies'
      path: '/lobbies'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker/lobbies'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLobbiesImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/settings': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/settings'
      path: '/settings'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker/settings'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerSettingsImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/'
      path: '/'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker/'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/logs/$lobbyId': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/logs/$lobbyId'
      path: '/logs/$lobbyId'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker/logs/$lobbyId'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsLobbyIdImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
    }
    '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/logs/': {
      id: '/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/matchmaker/logs/'
      path: '/logs'
      fullPath: '/games/$gameId/namespaces/$namespaceId/matchmaker/logs'
      preLoaderRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsIndexImport
      parentRoute: typeof AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedLayoutRoute: AuthenticatedLayoutRoute.addChildren({
      AuthenticatedLayoutMyProfileRoute,
      AuthenticatedLayoutIndexRoute,
      AuthenticatedLayoutGamesGameIdRoute:
        AuthenticatedLayoutGamesGameIdRoute.addChildren({
          AuthenticatedLayoutGamesGameIdBackendRoute:
            AuthenticatedLayoutGamesGameIdBackendRoute.addChildren({
              AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute:
                AuthenticatedLayoutGamesGameIdBackendEnvironmentIdRoute.addChildren(
                  {
                    AuthenticatedLayoutGamesGameIdBackendEnvironmentIdLogsRoute,
                    AuthenticatedLayoutGamesGameIdBackendEnvironmentIdVariablesRoute,
                    AuthenticatedLayoutGamesGameIdBackendEnvironmentIdIndexRoute,
                  },
                ),
              AuthenticatedLayoutGamesGameIdBackendIndexRoute,
            }),
          AuthenticatedLayoutGamesGameIdBillingRoute,
          AuthenticatedLayoutGamesGameIdSettingsRoute:
            AuthenticatedLayoutGamesGameIdSettingsRoute.addChildren({
              AuthenticatedLayoutGamesGameIdSettingsIndexRoute,
            }),
          AuthenticatedLayoutGamesGameIdTokensRoute,
          AuthenticatedLayoutGamesGameIdIndexRoute,
        }),
      AuthenticatedLayoutTeamsGroupIdRoute:
        AuthenticatedLayoutTeamsGroupIdRoute.addChildren({
          AuthenticatedLayoutTeamsGroupIdBillingRoute,
          AuthenticatedLayoutTeamsGroupIdMembersRoute,
          AuthenticatedLayoutTeamsGroupIdSettingsRoute:
            AuthenticatedLayoutTeamsGroupIdSettingsRoute.addChildren({
              AuthenticatedLayoutTeamsGroupIdSettingsIndexRoute,
            }),
          AuthenticatedLayoutTeamsGroupIdIndexRoute,
        }),
      AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute:
        AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdRoute.addChildren({
          AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdCdnRoute,
          AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute:
            AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerRoute.addChildren(
              {
                AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLobbiesRoute,
                AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerSettingsRoute,
                AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerIndexRoute,
                AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsLobbyIdRoute,
                AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdMatchmakerLogsIndexRoute,
              },
            ),
          AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdTokensRoute,
          AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdVersionsRoute,
          AuthenticatedLayoutGamesGameIdNamespacesNamespaceIdIndexRoute,
        }),
    }),
    AuthenticatedInviteInviteCodeRoute,
    AuthenticatedDevicesLinkTokenRoute,
  }),
})

/* prettier-ignore-end */
