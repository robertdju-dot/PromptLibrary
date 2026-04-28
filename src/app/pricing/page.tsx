import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="text-xl font-bold tracking-tight">PromptLibrary</span>
        </Link>
      </header>

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start for free, upgrade when you need more power and unlimited prompt storage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="flex flex-col border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for casual users</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <ul className="space-y-3">
                  {["Store up to 10 personal prompts", "Basic dynamic variables", "Community access", "Standard support"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Monthly Tier */}
            <Card className="flex flex-col border-primary/50 shadow-md relative scale-105 z-10 bg-card">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Pro Monthly</CardTitle>
                <CardDescription>For power users and professionals</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3">
                  {["Unlimited prompt storage", "Advanced variables & nesting", "Priority sharing options", "Analytics dashboard", "24/7 Premium support"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full">Subscribe Monthly</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Lifetime Tier */}
            <Card className="flex flex-col border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Lifetime</CardTitle>
                <CardDescription>Pay once, use forever</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$199</span>
                  <span className="text-muted-foreground">/one-time</span>
                </div>
                <ul className="space-y-3">
                  {["Everything in Pro", "One-time payment", "Early access to new features", "Exclusive community badge"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Get Lifetime Deal</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
