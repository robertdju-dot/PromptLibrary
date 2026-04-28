"use client";

import { useState, useEffect } from "react";
import { Prompt } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Download } from "lucide-react";

interface ViewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
}

export function ViewPromptModal({ isOpen, onClose, prompt }: ViewPromptModalProps) {
  const [variables, setVariables] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (prompt && isOpen) {
      if (!prompt.content) {
        setVariables([]);
        setValues({});
        setIsCopied(false);
        return;
      }
      // Extract all words between # (e.g. #variable_name#)
      const regex = /#([a-zA-Z0-9_]+)#/g;
      const matches = Array.from(prompt.content.matchAll(regex)).map((m) => m[1]);
      // Remove duplicates
      const uniqueVars = Array.from(new Set(matches));
      setVariables(uniqueVars);

      // Initialize values
      const initialValues: Record<string, string> = {};
      uniqueVars.forEach((v) => {
        initialValues[v] = "";
      });
      setValues(initialValues);
      setIsCopied(false);
    }
  }, [prompt, isOpen]);

  if (!prompt) return null;

  let finalContent = prompt.content || "";
  variables.forEach((v) => {
    const regex = new RegExp(`#${v}#`, "g");
    finalContent = finalContent.replace(regex, values[v] || `#${v}#`);
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([finalContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4 pr-6">
            <DialogTitle className="text-2xl font-bold">{prompt.title}</DialogTitle>
          </div>
          {prompt.description && (
            <DialogDescription className="text-base mt-2">{prompt.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4 space-y-6 flex-1">
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={typeof tag === 'string' ? tag : tag.id} variant="secondary">
                  {typeof tag === 'string' ? tag : tag.name}
                </Badge>
              ))}
            </div>
          )}

          {variables.length > 0 && (
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dynamic Variables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {variables.map((variable) => (
                  <div key={variable} className="flex flex-col gap-2">
                    <Label htmlFor={variable} className="capitalize">
                      {variable.replace(/_/g, " ")}
                    </Label>
                    <Input
                      id={variable}
                      placeholder={`Enter ${variable.replace(/_/g, " ")}`}
                      value={values[variable]}
                      onChange={(e) => setValues({ ...values, [variable]: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Preview
            </h4>
            <div className="bg-muted p-4 rounded-xl font-mono text-sm whitespace-pre-wrap border border-border/50 min-h-[150px] text-foreground/90 leading-relaxed relative group">
              {finalContent || "No content provided."}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0 sm:justify-between w-full">
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download .txt
            </Button>
            <Button
              type="button"
              onClick={handleCopy}
              disabled={isCopied}
              className="gap-2 min-w-[140px]"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Final Prompt
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
