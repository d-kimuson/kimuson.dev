"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, FileText, User } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30">
        <div className="absolute inset-0 animate-pulse opacity-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+Cjwvc3ZnPgo=')] opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x leading-tight">
            kimuson.dev
          </h1>

          {/* Subtitle */}
          <div className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground mb-4">
            <span className="inline-block animate-typewriter">
              Web技術 & TypeScript Enthusiast
            </span>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            技術的な洞察、日々の学び、モダンWeb開発の深い探究を共有する個人ブログへようこそ。
            TypeScriptと革新的なソリューションに焦点を当てた、Node.jsエコシステムの世界を探索します。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/blog" className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Explore Articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm px-8 py-6 text-lg font-semibold hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/about" className="flex items-center gap-2">
                <User className="w-5 h-5" />
                About
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-accent/20 hover:border-accent/40 bg-background/50 backdrop-blur-sm px-8 py-6 text-lg font-semibold hover:bg-accent/5 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/projects" className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Projects
              </Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
