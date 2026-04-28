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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2 } from "lucide-react";

interface SmartCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
}

export function SmartCopyModal({ isOpen, onClose, prompt }: SmartCopyModalProps) {
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
      const matches = Array.from(prompt.content.matchAll(regex)).map(m => m[1]);
      // Remove duplicates
      const uniqueVars = Array.from(new Set(matches));
      setVariables(uniqueVars);
      
      // Initialize values
      const initialValues: Record<string, string> = {};
      uniqueVars.forEach(v => {
        initialValues[v] = "";
      });
      setValues(initialValues);
      setIsCopied(false);
    }
  }, [prompt, isOpen]);

  const handleCopy = async () => {
    if (!prompt) return;

    let finalContent = prompt.content;
    variables.forEach(v => {
      const regex = new RegExp(`#${v}#`, 'g');
      finalContent = finalContent.replace(regex, values[v] || `#${v}#`);
    });

    try {
      await navigator.clipboard.writeText(finalContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!prompt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fill in the details</DialogTitle>
          <DialogDescription>
            This prompt contains dynamic variables. Fill them out to customize your prompt before copying.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {variables.length > 0 ? (
            variables.map((variable) => (
              <div key={variable} className="flex flex-col gap-2">
                <Label htmlFor={variable} className="capitalize">
                  {variable.replace(/_/g, " ")}
                </Label>
                <Input
                  id={variable}
                  placeholder={`Enter ${variable.replace(/_/g, " ")}`}
                  value={values[variable]}
                  onChange={(e) => setValues({ ...values, [variable]: e.target.value })}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No variables found in this prompt. Ready to copy!
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCopy} disabled={isCopied} className="gap-2 min-w-[120px]">
            {isCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Final
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
