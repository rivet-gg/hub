import { CancelGameLinkCommandInput, CancelGameLinkCommandOutput } from "../commands/CancelGameLinkCommand";
import { CompleteGameLinkCommandInput, CompleteGameLinkCommandOutput } from "../commands/CompleteGameLinkCommand";
import { CompleteIdentityAvatarUploadCommandInput, CompleteIdentityAvatarUploadCommandOutput } from "../commands/CompleteIdentityAvatarUploadCommand";
import { FollowIdentityCommandInput, FollowIdentityCommandOutput } from "../commands/FollowIdentityCommand";
import { GetGameLinkCommandInput, GetGameLinkCommandOutput } from "../commands/GetGameLinkCommand";
import { GetIdentityHandlesCommandInput, GetIdentityHandlesCommandOutput } from "../commands/GetIdentityHandlesCommand";
import { GetIdentityProfileCommandInput, GetIdentityProfileCommandOutput } from "../commands/GetIdentityProfileCommand";
import { GetIdentitySelfProfileCommandInput, GetIdentitySelfProfileCommandOutput } from "../commands/GetIdentitySelfProfileCommand";
import { GetIdentitySummariesCommandInput, GetIdentitySummariesCommandOutput } from "../commands/GetIdentitySummariesCommand";
import { ListActivitiesCommandInput, ListActivitiesCommandOutput } from "../commands/ListActivitiesCommand";
import { ListFollowersCommandInput, ListFollowersCommandOutput } from "../commands/ListFollowersCommand";
import { ListFollowingCommandInput, ListFollowingCommandOutput } from "../commands/ListFollowingCommand";
import { ListFriendsCommandInput, ListFriendsCommandOutput } from "../commands/ListFriendsCommand";
import { ListMutualFriendsCommandInput, ListMutualFriendsCommandOutput } from "../commands/ListMutualFriendsCommand";
import { ListRecentFollowersCommandInput, ListRecentFollowersCommandOutput } from "../commands/ListRecentFollowersCommand";
import { MarkDeletionCommandInput, MarkDeletionCommandOutput } from "../commands/MarkDeletionCommand";
import { PrepareGameLinkCommandInput, PrepareGameLinkCommandOutput } from "../commands/PrepareGameLinkCommand";
import { PrepareIdentityAvatarUploadCommandInput, PrepareIdentityAvatarUploadCommandOutput } from "../commands/PrepareIdentityAvatarUploadCommand";
import { RecentFollowerIgnoreCommandInput, RecentFollowerIgnoreCommandOutput } from "../commands/RecentFollowerIgnoreCommand";
import { RemoveIdentityGameActivityCommandInput, RemoveIdentityGameActivityCommandOutput } from "../commands/RemoveIdentityGameActivityCommand";
import { ReportIdentityCommandInput, ReportIdentityCommandOutput } from "../commands/ReportIdentityCommand";
import { SearchIdentitiesCommandInput, SearchIdentitiesCommandOutput } from "../commands/SearchIdentitiesCommand";
import { SetIdentityGameActivityCommandInput, SetIdentityGameActivityCommandOutput } from "../commands/SetIdentityGameActivityCommand";
import { SetupIdentityCommandInput, SetupIdentityCommandOutput } from "../commands/SetupIdentityCommand";
import { SignupForBetaCommandInput, SignupForBetaCommandOutput } from "../commands/SignupForBetaCommand";
import { UnfollowIdentityCommandInput, UnfollowIdentityCommandOutput } from "../commands/UnfollowIdentityCommand";
import { UnmarkDeletionCommandInput, UnmarkDeletionCommandOutput } from "../commands/UnmarkDeletionCommand";
import { UpdateIdentityProfileCommandInput, UpdateIdentityProfileCommandOutput } from "../commands/UpdateIdentityProfileCommand";
import { UpdateIdentityStatusCommandInput, UpdateIdentityStatusCommandOutput } from "../commands/UpdateIdentityStatusCommand";
import { ValidateIdentityProfileCommandInput, ValidateIdentityProfileCommandOutput } from "../commands/ValidateIdentityProfileCommand";
import { WatchEventsCommandInput, WatchEventsCommandOutput } from "../commands/WatchEventsCommand";
import { HttpRequest as __HttpRequest, HttpResponse as __HttpResponse } from "@aws-sdk/protocol-http";
import { SerdeContext as __SerdeContext } from "@aws-sdk/types";
export declare const serializeAws_restJson1CancelGameLinkCommand: (input: CancelGameLinkCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1CompleteGameLinkCommand: (input: CompleteGameLinkCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1CompleteIdentityAvatarUploadCommand: (input: CompleteIdentityAvatarUploadCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1FollowIdentityCommand: (input: FollowIdentityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetGameLinkCommand: (input: GetGameLinkCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetIdentityHandlesCommand: (input: GetIdentityHandlesCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetIdentityProfileCommand: (input: GetIdentityProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetIdentitySelfProfileCommand: (input: GetIdentitySelfProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetIdentitySummariesCommand: (input: GetIdentitySummariesCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListActivitiesCommand: (input: ListActivitiesCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListFollowersCommand: (input: ListFollowersCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListFollowingCommand: (input: ListFollowingCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListFriendsCommand: (input: ListFriendsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListMutualFriendsCommand: (input: ListMutualFriendsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ListRecentFollowersCommand: (input: ListRecentFollowersCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1MarkDeletionCommand: (input: MarkDeletionCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1PrepareGameLinkCommand: (input: PrepareGameLinkCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1PrepareIdentityAvatarUploadCommand: (input: PrepareIdentityAvatarUploadCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1RecentFollowerIgnoreCommand: (input: RecentFollowerIgnoreCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1RemoveIdentityGameActivityCommand: (input: RemoveIdentityGameActivityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ReportIdentityCommand: (input: ReportIdentityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SearchIdentitiesCommand: (input: SearchIdentitiesCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetIdentityGameActivityCommand: (input: SetIdentityGameActivityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetupIdentityCommand: (input: SetupIdentityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SignupForBetaCommand: (input: SignupForBetaCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1UnfollowIdentityCommand: (input: UnfollowIdentityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1UnmarkDeletionCommand: (input: UnmarkDeletionCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1UpdateIdentityProfileCommand: (input: UpdateIdentityProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1UpdateIdentityStatusCommand: (input: UpdateIdentityStatusCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ValidateIdentityProfileCommand: (input: ValidateIdentityProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1WatchEventsCommand: (input: WatchEventsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const deserializeAws_restJson1CancelGameLinkCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<CancelGameLinkCommandOutput>;
export declare const deserializeAws_restJson1CompleteGameLinkCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<CompleteGameLinkCommandOutput>;
export declare const deserializeAws_restJson1CompleteIdentityAvatarUploadCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<CompleteIdentityAvatarUploadCommandOutput>;
export declare const deserializeAws_restJson1FollowIdentityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<FollowIdentityCommandOutput>;
export declare const deserializeAws_restJson1GetGameLinkCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetGameLinkCommandOutput>;
export declare const deserializeAws_restJson1GetIdentityHandlesCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetIdentityHandlesCommandOutput>;
export declare const deserializeAws_restJson1GetIdentityProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetIdentityProfileCommandOutput>;
export declare const deserializeAws_restJson1GetIdentitySelfProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetIdentitySelfProfileCommandOutput>;
export declare const deserializeAws_restJson1GetIdentitySummariesCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetIdentitySummariesCommandOutput>;
export declare const deserializeAws_restJson1ListActivitiesCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListActivitiesCommandOutput>;
export declare const deserializeAws_restJson1ListFollowersCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListFollowersCommandOutput>;
export declare const deserializeAws_restJson1ListFollowingCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListFollowingCommandOutput>;
export declare const deserializeAws_restJson1ListFriendsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListFriendsCommandOutput>;
export declare const deserializeAws_restJson1ListMutualFriendsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListMutualFriendsCommandOutput>;
export declare const deserializeAws_restJson1ListRecentFollowersCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ListRecentFollowersCommandOutput>;
export declare const deserializeAws_restJson1MarkDeletionCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<MarkDeletionCommandOutput>;
export declare const deserializeAws_restJson1PrepareGameLinkCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PrepareGameLinkCommandOutput>;
export declare const deserializeAws_restJson1PrepareIdentityAvatarUploadCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PrepareIdentityAvatarUploadCommandOutput>;
export declare const deserializeAws_restJson1RecentFollowerIgnoreCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<RecentFollowerIgnoreCommandOutput>;
export declare const deserializeAws_restJson1RemoveIdentityGameActivityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<RemoveIdentityGameActivityCommandOutput>;
export declare const deserializeAws_restJson1ReportIdentityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ReportIdentityCommandOutput>;
export declare const deserializeAws_restJson1SearchIdentitiesCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SearchIdentitiesCommandOutput>;
export declare const deserializeAws_restJson1SetIdentityGameActivityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetIdentityGameActivityCommandOutput>;
export declare const deserializeAws_restJson1SetupIdentityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetupIdentityCommandOutput>;
export declare const deserializeAws_restJson1SignupForBetaCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SignupForBetaCommandOutput>;
export declare const deserializeAws_restJson1UnfollowIdentityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<UnfollowIdentityCommandOutput>;
export declare const deserializeAws_restJson1UnmarkDeletionCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<UnmarkDeletionCommandOutput>;
export declare const deserializeAws_restJson1UpdateIdentityProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<UpdateIdentityProfileCommandOutput>;
export declare const deserializeAws_restJson1UpdateIdentityStatusCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<UpdateIdentityStatusCommandOutput>;
export declare const deserializeAws_restJson1ValidateIdentityProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ValidateIdentityProfileCommandOutput>;
export declare const deserializeAws_restJson1WatchEventsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<WatchEventsCommandOutput>;
