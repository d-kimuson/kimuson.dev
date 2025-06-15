"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { SearchModal } from "./SearchModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border/40 h-header relative shadow-sm">
      <nav className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
        >
          {siteConfig.title}
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white"
          onClick={toggleMenu}
          aria-label="メニュー"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground hover:text-foreground min-w-[140px] justify-start"
          >
            <Search className="h-4 w-4 mr-2" />
            検索
            <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tags">Tags</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border/40 py-4 px-4 shadow-xl">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchOpen(true);
                  setIsOpen(false);
                }}
                className="justify-start"
              >
                <Search className="h-4 w-4 mr-2" />
                検索
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/blog">Blog</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/tags">Tags</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/projects">Projects</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/about">About</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
