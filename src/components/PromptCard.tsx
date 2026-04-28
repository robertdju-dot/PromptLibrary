import { Prompt } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Eye, Globe, Trash2, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onEdit?: (promptId: string) => void;
  onView?: (promptId: string) => void;
  onDelete?: (promptId: string) => void;
  onDownload?: (prompt: Prompt) => void;
  isAdmin?: boolean;
}

export function PromptCard({ prompt, onCopy, onEdit, onView, onDelete, onDownload, isAdmin }: PromptCardProps) {
  return (
    <Card className="flex flex-col h-full group transition-all duration-300 hover:shadow-md hover:border-primary/50 bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg leading-tight font-semibold group-hover:text-primary transition-colors">
            {prompt.title}
          </CardTitle>
          {prompt.isPublic && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="px-1.5 py-0.5">
                  <Globe className="w-3 h-3 text-muted-foreground" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Publicly Shared</TooltipContent>
            </Tooltip>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground mt-1">
          {prompt.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <Badge key={typeof tag === 'string' ? tag : tag.id} variant="outline" className="text-xs bg-muted/50 font-normal">
              {typeof tag === 'string' ? tag : tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border/50 flex gap-2 flex-wrap">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 gap-1.5 shadow-sm transition-transform active:scale-95 min-w-[80px]"
          onClick={() => onCopy(prompt)}
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
        {onEdit && (
          <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => onEdit(prompt.id)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>
        )}
        {onView && (
          <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => onView(prompt.id)}>
            <Eye className="w-4 h-4" />
            <span className="sr-only">View</span>
          </Button>
        )}
        {onDownload && (
          <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => onDownload(prompt)}>
            <Download className="w-4 h-4" />
            <span className="sr-only">Download</span>
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="icon" className="h-9 w-9 flex-shrink-0 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border-transparent" onClick={() => onDelete(prompt.id)}>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
