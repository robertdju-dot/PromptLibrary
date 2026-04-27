"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to create session");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-accent/20">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
        <span className="text-xl font-bold tracking-tight">PromptLibrary</span>
      </Link>
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base mt-2">Sign in to access your personal prompts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full gap-3 h-14 text-base font-medium" variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
            <LogIn className="w-5 h-5 text-muted-foreground" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>By clicking continue, you agree to our <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
