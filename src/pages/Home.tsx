import { VocabularyList } from "@/components/VocabularyList";
import PWABadge from "@/components/PWABadge.tsx";
import BaseLayout from "@/layouts/BaseLayout.tsx";

export default function Home() {
  return (
    <BaseLayout>
      <header className="h-24 bg-white border-b-4 border-foreground flex items-center justify-center">
        <h1 className="text-4xl text-center font-mplus-rounded font-bold">
          単語帳Webアプリ
        </h1>
      </header>
      <main className="w-full">
        <VocabularyList />
      </main>
      <PWABadge />
    </BaseLayout>
  );
}
