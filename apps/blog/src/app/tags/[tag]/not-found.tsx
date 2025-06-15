import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hash, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <Hash className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">タグが見つかりません</CardTitle>
            <CardDescription>
              指定されたタグの記事が見つかりませんでした。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild variant="default">
                <Link href="/tags" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  タグ一覧に戻る
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/blog">記事一覧を見る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
