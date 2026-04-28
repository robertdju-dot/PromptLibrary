"use client";

import { useState, useEffect } from "react";
import { Prompt } from "@/lib/mockData";
import { PromptCard } from "@/components/PromptCard";
import { SmartCopyModal } from "@/components/SmartCopyModal";
import { ViewPromptModal } from "@/components/ViewPromptModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getPrompts } from "@/actions/prompts";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/actions/users";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userTier, setUserTier] = useState<string>("FREE");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin);
          
          const data = await getPrompts(user.uid);
          setPrompts(data);
          
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserTier(profile.tier);
          }
        } catch (error) {
          console.error("Failed to load prompts or profile", error);
        }
      } else {
        setPrompts([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPrompts = prompts.filter(p => {
    const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch = p.tags?.some(t => {
      const tagName = typeof t === "string" ? t : t.name;
      return tagName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return titleMatch || tagsMatch;
  });

  const handleCopy = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsCopyModalOpen(true);
  };

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/prompt/${id}/edit`;
  };

  const handleDownload = (prompt: Prompt) => {
    const textContent = `Title: ${prompt.title}\n\nDescription: ${prompt.description || "N/A"}\n\nTags: ${prompt.tags?.map(t => typeof t === 'string' ? t : t.name).join(", ")}\n\nContent:\n${prompt.content}`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    try {
      const { deletePrompt } = await import("@/actions/prompts");
      await deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete prompt", error);
      alert("Failed to delete prompt");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
          {!isAdmin && userTier === "FREE" && (
            <p className="text-sm text-muted-foreground mt-1">
              You've used <span className="font-medium text-foreground">{prompts.length}/10</span> free prompt slots.
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={userTier === "PREMIUM" ? "default" : "secondary"}>
            {userTier} Plan
          </Badge>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts or tags..." 
              className="pl-9 bg-card border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPrompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            onCopy={handleCopy}
            onEdit={handleEdit}
            onView={() => handleView(prompt)}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!isLoading && filteredPrompts.length === 0 && (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl min-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground">No prompts found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query or create a new prompt.</p>
          </div>
        </div>
      )}

      <SmartCopyModal 
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        prompt={selectedPrompt}
      />
      
      <ViewPromptModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        prompt={selectedPrompt}
      />
    </div>
  );
}
