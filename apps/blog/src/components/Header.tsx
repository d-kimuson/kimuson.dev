"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gray-800 h-header relative">
      <nav className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
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
        <div className="hidden lg:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog">Blog</Link>
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link href="/blog">Blog</Link>
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
    </header>
  );
};

export default Header;
