import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MissedWordsPopup } from "./MissedWordsPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "../Header";
import { SortField } from "./fields/SortField";

import type { WordData } from "@/types/WordData.ts";

interface Props {
  words: WordData[];
  storageKey: string;
  className?: string;
}

interface answerModeType {
  name: string;
  key: string;
}

const mode: answerModeType[] = [
  { name: "並び替え", key: "sort" },
  { name: "入力", key: "input" },
];

export const SentenceQuiz = ({ words, storageKey, className }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [range, setRange] = useState(1);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [currentWords, setCurrentWords] = useState<WordData[]>([]);
  const [missedWord, setMissedWord] = useState<WordData[]>([]);
  const [showMissedWordsPopup, setShowMissedWordsPopup] = useState(false);
  const [answerMode, setAnswerMode] = useState<answerModeType>(mode[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initQuiz(loadRange());
  }, []);

  const initQuiz = ({
    startIndex,
    endIndex,
  }: {
    startIndex: number;
    endIndex: number;
  }) => {
    const newRange = endIndex - startIndex + 1;
    setRange(newRange);

    // wordsを範囲で切り出してシャッフル
    const newWords = [...words]
      .splice(startIndex, newRange)
      .sort(() => Math.random() - 0.5);
    setCurrentWords(newWords);
    setIsAnswerShown(false);
    setCurrentIndex(0);
    setMissedWord([]);
    clearInput();
  };

  const handleSubmitButtonClick = () => {
    saveRange();
    initQuiz({ startIndex, endIndex });
  };

  const saveRange = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      `${storageKey}-range`,
      JSON.stringify({ startIndex, endIndex })
    );
  };

  const loadRange = (): { startIndex: number; endIndex: number } => {
    const range = localStorage?.getItem(`${storageKey}-range`);
    if (range) {
      const { startIndex, endIndex } = JSON.parse(range);
      setStartIndex(startIndex);
      setEndIndex(endIndex);
      return { startIndex, endIndex };
    } else {
      return { startIndex: 0, endIndex: 0 };
    }
  };

  const checkAnswer = (answer: string) => {
    let isCorrect = false;
    switch (answerMode.key) {
      case "input":
        const cleanedAnswer = answer.trim().toLowerCase();
        isCorrect =
          cleanedAnswer === currentWords[currentIndex]?.word.toLowerCase();
        break;
      case "sort":
        isCorrect = answer === currentWords[currentIndex]?.word;
        break;
    }
    if (isCorrect && currentIndex < range - 1) {
      showNextQuestion();
      return true;
    } else if (isCorrect && currentIndex === range - 1) {
      quizCompleted();
      return true;
    }
    return false;
  };

  const showNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    clearInput();
    setIsAnswerShown(false);
  };

  const quizCompleted = () => {
    setShowMissedWordsPopup(true);
    clearInput();
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showAnswer = () => {
    setIsAnswerShown(true);
    setMissedWord((prev) => [...prev, currentWords[currentIndex]]);
  };

  const toggleAnswerMode = (value: string) => {
    console.log(value);
    const newAnswerMode = mode.find((mode) => mode.name === value);
    if (newAnswerMode) {
      setAnswerMode(newAnswerMode);
    }
  };

  const handleCloseMissedWordsPopup = () => {
    setShowMissedWordsPopup(false);
    initQuiz({ startIndex, endIndex });
  };

  return (
    <div className={"w-full"}>
      <Header
        showRangeInput
        onSubmit={handleSubmitButtonClick}
        words={words}
        startIndex={startIndex}
        endIndex={endIndex}
        setStartIndex={setStartIndex}
        setEndIndex={setEndIndex}
        className="py-2"
      >
        <h1 className="text-3xl text-center font-mplus-rounded font-bold">
          {storageKey}
        </h1>
      </Header>
      <div
        className={`w-full text-center container mx-auto p-6 py-12 space-y-6 ${className}`}
      >
        <div className={"w-full space-y-2"}>
          <div className={"text-2xl md:text-3xl font-bold"}>
            {answerMode.key === "fourChoice"
              ? currentWords[currentIndex]?.word
              : currentWords[currentIndex]?.japanese}
          </div>
          <div className={"text-xl md:text-2xl"}>
            {currentIndex + 1}/{range}
          </div>
          {isAnswerShown && (
            <div className={"text-xl md:text-2xl"}>
              {answerMode.key === "fourChoice"
                ? currentWords[currentIndex]?.japanese
                : currentWords[currentIndex].word}
            </div>
          )}
        </div>
        <div className={"max-w-xl mx-auto space-y-2"}>
          {answerMode.key === "sort" ? (
            <div>
              <SortField
                text={currentWords[currentIndex]?.word || ""}
                onChange={checkAnswer}
              ></SortField>
            </div>
          ) : (
            <Input
              className={"text-lg text-center"}
              onChange={(e) => checkAnswer(e.target.value)}
              ref={inputRef}
            />
          )}
        </div>
        <div className={"flex justify-center items-center space-x-6"}>
          <Button className={"font-black"} onClick={() => showAnswer()}>
            答え
          </Button>
          <Select value={answerMode.name} onValueChange={toggleAnswerMode}>
            <SelectTrigger className="font-bold max-w-[150px]">
              <SelectValue placeholder="モードを選択" />
            </SelectTrigger>
            <SelectContent className="bg-secondary-background text-foreground">
              {mode.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  <div className="flex items-center gap-2">{name}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <MissedWordsPopup
        isOpen={showMissedWordsPopup}
        onClose={handleCloseMissedWordsPopup}
        missedWords={missedWord}
      />
    </div>
  );
};
