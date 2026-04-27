import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, FolderOpen, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">PromptLibrary</span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>

          <Link href="/login">
            <Button variant="default" size="sm" className="rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 text-sm font-medium border border-primary/20">
            <span className="flex w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            The ultimate workspace for your AI workflows
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Organize, retrieve, and execute your best prompts.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            Stop copy-pasting from messy documents. Store your AI prompts centrally, use dynamic variables, and share them with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-full gap-2 text-base h-14 px-8">
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-accent/30 border-y border-border/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Supercharge your AI productivity</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Centralized Library</h3>
                <p className="text-muted-foreground">Keep all your ChatGPT, Claude, and Midjourney prompts in one organized, easily searchable place.</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dynamic Variables</h3>
                <p className="text-muted-foreground">Use #hashtags# in your prompts. When you copy, we'll ask you to fill them in automatically.</p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; 2026 PromptLibrary. All rights reserved.</p>
      </footer>
    </div>
  );
}
