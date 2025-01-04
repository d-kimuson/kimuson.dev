import { AboutMeCard } from "@/components/AboutMeCard";
import { HomePageContent } from "@/app/blog/page-content";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>

        <HomePageContent />
      </div>
      <div className="sticky top-[80px] self-start">
        <AboutMeCard />
      </div>
    </div>
  );
}
