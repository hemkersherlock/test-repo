
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Clapperboard } from "lucide-react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait for the auth state to be determined
    }

    // If user is not logged in and not on the login page, redirect to login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }

    // If user is logged in but on the login page, redirect to home
    if (user && pathname === '/login') {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Clapperboard className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-muted-foreground mt-4">Loading your schedule...</p>
      </div>
    );
  }

  // While redirecting or determining state, show a loading screen
  if ((!user && pathname !== '/login') || (user && pathname === '/login')) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Clapperboard className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-muted-foreground mt-4">Redirecting...</p>
      </div>
    );
  }

  // If user is not logged in, render the login page children
  if (!user && pathname === '/login') {
      return <>{children}</>;
  }
  
  // If user is logged in and not on the login page, render the app children
  if (user && pathname !== '/login') {
      return <>{children}</>;
  }
  
  return null;
}

    