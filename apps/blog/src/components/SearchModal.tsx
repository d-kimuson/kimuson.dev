"use client";

import { FC, useState, useMemo, useCallback, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { searchArticles } from "@kimuson.dev/articles";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getCategoryEmoji = (tags: string[], category?: string) => {
  if (tags.includes("zenn")) return "🔷";
  if (
    category?.includes("フロントエンド") ||
    tags.some((tag) =>
      ["React", "Vue.js", "Next", "Gatsby", "TypeScript"].includes(tag)
    )
  )
    return "💻";
  if (
    category?.includes("バックエンド") ||
    tags.some((tag) => ["Django", "Python", "Node.js"].includes(tag))
  )
    return "⚙️";
  if (
    category?.includes("インフラ") ||
    tags.some((tag) => ["Docker", "AWS", "Ubuntu"].includes(tag))
  )
    return "🛠️";
  if (tags.some((tag) => ["shell", "bash"].includes(tag))) return "🔧";
  if (tags.includes("VSCode")) return "📝";
  if (tags.includes("GAS")) return "📊";
  if (category?.includes("雑記")) return "📖";
  return "📄";
};

export const SearchModal: FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchArticles({
      text: searchTerm,
    }).slice(0, 10);
  }, [searchTerm]);

  const handleSelectArticle = useCallback(
    (article: (typeof searchResults)[0]) => {
      onOpenChange(false);
      if ("slug" in article) {
        const href = article.slug.startsWith("/")
          ? `/blog${article.slug as `/${string}`}/`
          : `/blog/${article.slug}/`;
        window.location.href = href;
      } else {
        window.open(article.url, "_blank", "noopener noreferrer");
      }
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-2xl top-[20vh] translate-y-0 h-[500px] flex flex-col">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 h-full">
          <CommandInput
            placeholder="記事を検索..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="flex-1 min-h-0">
            <CommandEmpty>記事が見つかりませんでした。</CommandEmpty>
            <CommandGroup heading="記事">
              {searchResults.map((article) => {
                const categoryEmoji = getCategoryEmoji(
                  article.tags,
                  "slug" in article ? article.slug?.split("/")[1] : undefined
                );

                return (
                  <CommandItem
                    key={"slug" in article ? article.slug : article.url}
                    onSelect={() => handleSelectArticle(article)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className="text-lg">{categoryEmoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <h3 className="font-medium text-sm leading-tight flex-1">
                          {article.title}
                        </h3>
                        {"url" in article && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {article.date.toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 h-auto"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 h-auto"
                          >
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
