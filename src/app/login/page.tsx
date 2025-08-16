
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const { toast } = useToast();

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(signInEmail, signInPassword);
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmail(signUpEmail, signUpPassword);
    } catch (error: any) {
       toast({
        title: "Sign Up Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
        toast({
        title: "Google Sign In Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  const handleSkip = async () => {
    setLoading(true);
    try {
      await signInAsGuest();
    } catch (error: any) {
      toast({
        title: "Guest Sign In Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-6">
          <Clapperboard className="w-12 h-12 text-primary" />
          <h1 className="text-3xl font-headline font-bold mt-2">CineSchedule</h1>
          <p className="text-muted-foreground">Welcome! Sign in or create an account.</p>
        </div>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <form onSubmit={handleEmailSignIn}>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your lists.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="m@example.com" required value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" required value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button" disabled={loading}>Sign in with Google</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
               <form onSubmit={handleEmailSignUp}>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Create an account to start tracking your shows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="m@example.com" required value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)}/>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                   <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-4 text-center">
          <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground underline" disabled={loading}>
            {loading ? 'Loading...' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
}
