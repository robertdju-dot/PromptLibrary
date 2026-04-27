"use client";

import { useState, useEffect } from "react";
import { Prompt } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2, ShieldAlert } from "lucide-react";
import { getAllPrompts, deletePrompt } from "@/actions/prompts";
import { ViewPromptModal } from "@/components/ViewPromptModal";

export default function AdminPromptsPage() {
  const [search, setSearch] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => { async function load() { try { const data = await getAllPrompts(); setPrompts(data); } catch (error) { console.error("Failed to load all prompts", error); } } load(); }, []);

  const handleDelete = async (id: string) => { try { await deletePrompt(id); setPrompts(prompts.filter(p => p.id !== id)); } catch (error) { console.error("Delete failed", error); } };
  const handleView = (prompt: Prompt) => { setSelectedPrompt(prompt); setIsViewModalOpen(true); };
  const filteredPrompts = prompts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><ShieldAlert className="w-8 h-8 text-primary" />Content Moderation</h1></div>
      <div className="flex items-center justify-between"><div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search prompts by content or title..." className="pl-9 bg-card border-border/50" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
      <div className="rounded-md border border-border/50 bg-card">
        <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author ID</TableHead><TableHead>Visibility</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{filteredPrompts.map((prompt) => (<TableRow key={prompt.id}><TableCell className="font-medium">{prompt.title}</TableCell><TableCell className="font-mono text-xs text-muted-foreground">{prompt.userId}</TableCell><TableCell><Badge variant={prompt.isPublic ? "default" : "secondary"}>{prompt.isPublic ? "Public" : "Private"}</Badge></TableCell><TableCell className="text-muted-foreground text-sm">{new Date(prompt.createdAt).toLocaleDateString()}</TableCell><TableCell className="text-right flex justify-end gap-2"><Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleView(prompt)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(prompt.id)}><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>))}</TableBody></Table>
      </div>
      <ViewPromptModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} prompt={selectedPrompt} />
    </div>
  );
}
