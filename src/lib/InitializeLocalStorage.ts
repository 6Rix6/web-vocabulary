import { target1900 } from '@/data/target1900';

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vocabulary-list', JSON.stringify(vocabularyList));
  localStorage.setItem('ターゲット1900', JSON.stringify(target1900));
};

const vocabularyList = [
  {
    name: 'ターゲット1900',
    wordCount: 1900,
    color: 'oklch(66.9% 0.18368 248.8066)',
  },
];
