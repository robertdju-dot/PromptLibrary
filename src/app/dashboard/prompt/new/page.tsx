"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPrompt } from "@/actions/prompts";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewPromptPage() {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMemberOnly, setIsMemberOnly] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    if (!title || !content) return;
    
    setIsSaving(true);
    try {
      const finalTags = [...tags];
      if (tagInput.trim() && !finalTags.includes(tagInput.trim())) {
        finalTags.push(tagInput.trim());
      }

      await createPrompt({
        title,
        description,
        content,
        tags: finalTags,
        isPublic: false, // Defaulting to private initially
        isMemberOnly,
      });
      
      if (isMemberOnly) {
        router.push("/dashboard/member-prompts");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Failed to save prompt", error);
      if (error.message === "PROMPT_LIMIT_REACHED") {
        alert("You've reached the limit of 10 prompts for free users. Please upgrade to Premium for unlimited prompts!");
      } else {
        alert("Failed to save prompt. Please try again.");
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Prompt</h1>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={isSaving || !title || !content}>
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Prompt"}
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>
            Use #hashtags# in your content to create dynamic variables (e.g. "Write an email to #name#").
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Cold Email Outreach" className="bg-muted/50" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input id="description" placeholder="Briefly describe what this prompt does" className="bg-muted/50" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2 py-2">
              <Checkbox 
                id="memberOnly" 
                checked={isMemberOnly} 
                onCheckedChange={(checked) => setIsMemberOnly(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="memberOnly" className="text-sm font-medium cursor-pointer">
                  Publish as Member-Only Prompt
                </Label>
                <p className="text-xs text-muted-foreground">
                  This prompt will be visible to all registered members in the Member Prompts section.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input 
                id="tags" 
                placeholder="Add a tag..." 
                className="bg-muted/50"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button type="button" variant="secondary" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive text-muted-foreground rounded-full ml-1 focus:outline-none">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea 
              id="content" 
              placeholder="Enter your prompt here..." 
              className="min-h-[200px] resize-y bg-muted/50 font-mono text-sm leading-relaxed" 
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


