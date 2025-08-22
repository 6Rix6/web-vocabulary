import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabularyAddPopup } from "@/components/VocabularyAddPopup";
import { initializeLocalStorage } from "@/lib/InitializeLocalStorage.ts";
import type { VocabularyData } from "@/types/VocabularyData.ts";

interface Props {
  className?: string;
}

export const VocabularyList = ({ className }: Props) => {
  const [vocabularyList, setVocabularyList] = useState<VocabularyData[]>([]);
  const [isInitialized, setIsInitialized] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("vocabulary-list");
    if (data) {
      const vocabularyList = JSON.parse(data) as VocabularyData[];
      setVocabularyList(vocabularyList);
      setIsInitialized(true);
    } else {
      initializeLocalStorage();
      setIsInitialized(false);
    }
  }, [isInitialized]);

  const handlePopupClose = () => {
    setShowPopup(false);
    updateVocabularyList();
  };

  const updateVocabularyList = () => {
    const data = localStorage.getItem("vocabulary-list");
    if (data) {
      const vocabularyList = JSON.parse(data) as VocabularyData[];
      setVocabularyList(vocabularyList);
    }
  };

  if (vocabularyList.length === 0) return null;
  return (
    <div
      className={cn(
        "flex w-full gap-3 p-6 flex-nowrap md:grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center md:container mx-auto overflow-auto",
        className
      )}
    >
      {vocabularyList.map((item, i) => (
        <a
          key={i}
          href={`/vocabulary?name=${item.name}`}
          className="w-full max-w-sm shrink-0"
        >
          <Card className="w-full relative overflow-hidden">
            <CardHeader
              className={"text-3xl font-bold z-20"}
              style={{ backgroundColor: item.color }}
            >
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className={"h-[50vh]"}>
              <div
                className={
                  "absolute top-24 -left-12 w-[40vh] h-[40vh] rounded-full z-10 flex items-center justify-center"
                }
                style={{ backgroundColor: item.color }}
              >
                <div className={"font-bold text-xl"}>
                  単語数：{item.wordCount}
                </div>
              </div>
              <div
                className={
                  "absolute -bottom-10 -right-10 w-64 h-64 bg-gray-300 rounded-full z-0 flex items-center justify-center gap-3"
                }
              >
                {/*<a>*/}
                {/*  <Pen />*/}
                {/*</a>*/}
                {/*<a>*/}
                {/*  <Trash color={"red"} />*/}
                {/*</a>*/}
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
      <Card className="w-full max-w-sm shrink-0">
        <CardHeader />
        <CardContent
          className={"flex flex-col items-center justify-center gap-6 h-[50vh]"}
        >
          <div className={"text-2xl font-bold"}>単語帳を追加</div>
          <button
            className={
              "bg-gray-200 hover:bg-gray-300 transition-colors duration-300 cursor-pointer rounded-full w-16 h-16 flex items-center justify-center"
            }
            onClick={() => setShowPopup(true)}
          >
            <Plus />
          </button>
        </CardContent>
      </Card>
      <VocabularyAddPopup onClose={handlePopupClose} isOpen={showPopup} />
    </div>
  );
};
