
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

    if (!user && pathname !== '/login') {
      router.push('/login');
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

  if (!user && pathname !== '/login') {
    // While redirecting, show a loading state
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Clapperboard className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-muted-foreground mt-4">Redirecting to login...</p>
      </div>
    );
  }

  // If user is not logged in, login page will be rendered directly by Next.js
  if (!user && pathname === '/login') {
      return <>{children}</>;
  }
  
  // If user is logged in, but on the login page, redirect them to home
  if (user && pathname === '/login') {
      router.push('/');
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Clapperboard className="w-12 h-12 text-primary animate-pulse" />
            <p className="text-muted-foreground mt-4">Redirecting to home...</p>
        </div>
    );
  }

  // If user is logged in and not on the login page, show the content
  if (user && pathname !== '/login') {
      return <>{children}</>;
  }
  
  return null;
}

    