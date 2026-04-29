import { apiRequest, setApiTokenProvider } from "@/lib/api";
import type { AppUser } from "@/types/app";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppSessionContextValue = {
  appUser: AppUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
};

const AppSessionContext = createContext<AppSessionContextValue | undefined>(undefined);

export function AppSessionProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn } = useUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setApiTokenProvider(async () => (await getToken()) || null);
    return () => setApiTokenProvider(null);
  }, [getToken]);

  const refreshSession = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setAppUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest<AppUser>("/api/me");
      setAppUser(response);
    } catch (error) {
      console.error("Failed to load app session", error);
      setAppUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      appUser,
      isLoading,
      refreshSession,
    }),
    [appUser, isLoading, refreshSession],
  );

  return (
    <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const value = useContext(AppSessionContext);
  if (!value) {
    throw new Error("useAppSession must be used inside AppSessionProvider");
  }
  return value;
}
