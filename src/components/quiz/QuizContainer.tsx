import { useEffect, useState } from "react";
import { WordQuiz } from "./WordQuiz";
import { SentenceQuiz } from "./SentenceQuiz";
import type { WordData } from "@/types/WordData";
import { defaultColor } from "@/data/colors";
import { getVocabularyList } from "@/lib/storeVocabularyList";
import { VocabularyData } from "@/types/VocabularyData";

type Status = "loading" | "error" | "ready";

export const QuizContainer = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [query, setQuery] = useState<string | null>(null);
  const [words, setWords] = useState<WordData[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storageKey = params.get("name");

    if (!storageKey) {
      setErrorMessage("クエリパラメータ 'name' が見つかりません。");
      setStatus("error");
      return;
    }

    setQuery(storageKey);

    const VList = getVocabularyList();
    if (VList) {
      const vocabulary = VList.find((item) => item.name === storageKey);
      if (vocabulary) {
        setVocabulary(vocabulary);
      } else {
        setErrorMessage(`"${storageKey}" に対応するデータが見つかりません。`);
        setStatus("error");
        return;
      }
    }

    const wordData = localStorage.getItem(storageKey);
    if (!wordData) {
      setErrorMessage(`"${storageKey}" に対応するデータが見つかりません。`);
      setStatus("error");
      return;
    }

    try {
      const parsed = JSON.parse(wordData) as WordData[];
      if (parsed.length === 0) {
        setErrorMessage(`"${storageKey}" のデータは空です。`);
        setStatus("error");
        return;
      }
      setWords(parsed);
      document.documentElement.style.setProperty(
        "--main",
        getColor(storageKey)
      );
      setStatus("ready");
    } catch {
      setErrorMessage("データの読み込みに失敗しました。");
      setStatus("error");
    }
  }, []);

  const getColor = (key: string) => {
    const list = getVocabularyList();
    if (list) {
      const vocabulary = list.find((item) => item.name === key);
      if (vocabulary) {
        return vocabulary.color;
      } else {
        return defaultColor.main;
      }
    } else {
      return defaultColor.main;
    }
  };

  // 各ステートによる切り分け
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-red-500 h-screen flex justify-center items-center text-2xl">
        {errorMessage}
      </div>
    );
  }

  if (vocabulary?.kind === "word")
    return <WordQuiz storageKey={query!} words={words} />;
  else return <SentenceQuiz storageKey={query!} words={words} />;
};
