import type { VocabularyData } from "@/types/VocabularyData";
import { addVocabulary, setVocabularyList } from "./storeVocabularyList";
import { WordData } from "@/types/WordData";
import colors from "@/data/colors";

import { target1900 } from "@/data/target1900";
import { target1000 } from "@/data/target1000";

export const initializeLocalStorage = () => {
  if (typeof window === "undefined") return;
  setVocabularyList([]);
  for (const item of initialVocabularyList) {
    addVocabulary(item.vocabulary);
    localStorage.setItem(item.vocabulary.name, JSON.stringify(item.data));
  }
};

type ListItem = {
  vocabulary: VocabularyData;
  data: WordData[];
};

const initialVocabularyList: ListItem[] = [
  {
    vocabulary: {
      name: "ターゲット1900",
      wordCount: 1900,
      color: colors[10].main,
      kind: "word",
    },
    data: target1900,
  },
  {
    vocabulary: {
      name: "ターゲット1000",
      wordCount: 1000,
      color: colors[3].main,
      kind: "word",
    },
    data: target1000,
  },
];
