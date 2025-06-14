import { CompactProfileCard } from "@/components/CompactProfileCard";
import { HomePageContent } from "@/app/blog/page-content";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>

        <HomePageContent />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-[80px] self-start">
          <CompactProfileCard />
        </div>
      </div>
    </div>
  );
}
