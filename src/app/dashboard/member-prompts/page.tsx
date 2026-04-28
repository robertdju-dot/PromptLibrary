"use client";

import { useState, useEffect, useRef } from "react";
import { Prompt } from "@/lib/mockData";
import { PromptCard } from "@/components/PromptCard";
import { SmartCopyModal } from "@/components/SmartCopyModal";
import { ViewPromptModal } from "@/components/ViewPromptModal";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Upload, FileText, PlusCircle } from "lucide-react";
import { getMemberPrompts, uploadMemberPrompts } from "@/actions/prompts";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

export default function MemberPromptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin);
          const data = await getMemberPrompts();
          setPrompts(data);
        } catch (error) {
          console.error("Failed to load member prompts", error);
        }
      } else {
        setPrompts([]);
        setIsAdmin(false);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedPrompts = results.data.map((row: any) => ({
            title: row.Title || row.title || "Untitled Prompt",
            description: row.Description || row.description || "",
            content: row.Content || row.content || "",
            tags: (row.Tags || row.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
          })).filter((p) => p.content); // Only keep ones that actually have content

          if (parsedPrompts.length === 0) {
            alert("No valid prompts found in the CSV. Please ensure you have Title, Description, Content, and Tags columns.");
            setIsUploading(false);
            return;
          }

          const res = await uploadMemberPrompts(parsedPrompts);
          if (res.success) {
            alert(`Successfully uploaded ${res.count} member prompts!`);
            const data = await getMemberPrompts();
            setPrompts(data);
          }
        } catch (error) {
          console.error("Upload failed", error);
          alert("Failed to upload prompts. Please check your file format and try again.");
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        console.error("Parse error", error);
        alert("Failed to parse CSV file.");
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Prompts</h1>
          <p className="text-muted-foreground mt-1">Exclusive prompts published for members only.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or tag..." 
              className="pl-9 bg-card border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/prompt/new">
                <Button variant="outline" className="gap-2">
                  <PlusCircle className="w-4 h-4 text-primary" />
                  Create New
                </Button>
              </Link>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? <Upload className="w-4 h-4 animate-bounce" /> : <FileText className="w-4 h-4" />}
                {isUploading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPrompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            onCopy={handleCopy}
            onView={() => handleView(prompt)}
            onDownload={handleDownload}
            // Note: no onEdit or onDelete passed, so they won't appear
          />
        ))}
      </div>

      {!isLoading && filteredPrompts.length === 0 && (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl min-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground">No member prompts available</h3>
            <p className="text-sm text-muted-foreground mt-1">Admins haven't published any member-only prompts yet.</p>
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
