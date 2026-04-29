import { useAppSession } from "@/contexts/AppSessionContext";
import { useUser } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { Redirect } from "wouter";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: PropsWithChildren<{ adminOnly?: boolean }>) {
  const { isLoaded, isSignedIn } = useUser();
  const { appUser, isLoading } = useAppSession();

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbff] text-[#62598a]">
        Loading workspace...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  if (adminOnly && appUser?.role !== "admin") {
    return <Redirect to="/runs" />;
  }

  return <>{children}</>;
}
