import { VocabularyData } from "@/types/VocabularyData";

const strageKey = "vocabulary-list";

export const getVocabularyList = (): VocabularyData[] | null => {
  const vocabularyList = localStorage.getItem(strageKey);
  if (!vocabularyList) return null;
  return JSON.parse(vocabularyList) as VocabularyData[];
};

export const addVocabulary = (vocabulary: VocabularyData) => {
  const vocabularyList = getVocabularyList();
  if (!vocabularyList) return;
  vocabularyList.push(vocabulary);
  localStorage.setItem(strageKey, JSON.stringify(vocabularyList));
};

export const setVocabularyList = (vocabularyList: VocabularyData[]) => {
  localStorage.setItem(strageKey, JSON.stringify(vocabularyList));
};
