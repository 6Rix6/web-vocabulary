import { useEffect, useState } from "react";
import { Quiz } from "./Quiz";
import type { WordData } from "@/types/WordData";
import type { VocabularyData } from "@/types/VocabularyData";

type Status = "loading" | "error" | "ready";

export const QuizContainer = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [query, setQuery] = useState<string | null>(null);
  const [words, setWords] = useState<WordData[]>([]);
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

    const data = localStorage.getItem(storageKey);
    if (!data) {
      setErrorMessage(`"${storageKey}" に対応するデータが見つかりません。`);
      setStatus("error");
      return;
    }

    try {
      const parsed = JSON.parse(data) as WordData[];
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
    const list = localStorage.getItem("vocabulary-list");
    if (list) {
      const parsed = JSON.parse(list) as VocabularyData[];
      const vocabulary = parsed.find((item) => item.name === key);
      if (vocabulary) {
        return vocabulary.color;
      } else {
        return "oklch(0.79 0.051 238.249)";
      }
    } else {
      return "oklch(0.628 0.25 4.421)";
    }
  };

  // 各ステートによる切り分け
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div style={{ color: "red" }}>{errorMessage}</div>;
  }

  return <Quiz storageKey={query!} words={words} />;
};
