import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  identityTokenQueryOptions,
  selfProfileQueryOptions,
} from "../queries/identity";
import { useCallback } from "react";
import { Rivet } from "@rivet-gg/api";

export interface AuthContext {
  profile: Rivet.identity.GetProfileResponse | undefined;
  refreshToken: () => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSuccess, refetch: refetchSession } = useQuery(
    identityTokenQueryOptions(),
  );
  const { data: profile, refetch: refetchProfile } = useQuery(
    selfProfileQueryOptions({ enabled: isSuccess }),
  );

  const refreshToken = useCallback(() => {
    refetchSession();
    refetchProfile();
  }, [refetchSession, refetchProfile]);

  return (
    <AuthContext.Provider value={{ profile, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
