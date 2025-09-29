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
  { name: "入力", key: "default" },
  { name: "四択(英-日)", key: "fourChoice" },
  { name: "四択(日-英)", key: "fourChoiceReverse" },
];

export const Quiz = ({ words, storageKey, className }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [range, setRange] = useState(1);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [currentWords, setCurrentWords] = useState<WordData[]>([]);
  const [missedWord, setMissedWord] = useState<WordData[]>([]);
  const [missedChoiceIndexes, setMissedChoiceIndexes] = useState<number[]>([]);
  const [isMissed, setIsMissed] = useState<boolean>(false);
  const [showMissedWordsPopup, setShowMissedWordsPopup] = useState(false);
  const [answerMode, setAnswerMode] = useState<answerModeType>(mode[0]);
  const [choices, setChoices] = useState<WordData[]>([]);
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
    updateChoices(newWords[0]);
    setIsAnswerShown(false);
    setCurrentIndex(0);
    setMissedWord([]);
    setMissedChoiceIndexes([]);
    setIsMissed(false);
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
      case "default":
        const cleanedAnswer = answer.trim().toLowerCase();
        isCorrect =
          cleanedAnswer === currentWords[currentIndex]?.word.toLowerCase();
        break;
      case "fourChoice":
        isCorrect = answer === currentWords[currentIndex]?.japanese;
        if (!isCorrect) {
          if (!isMissed) {
            setMissedWord((prev) => [...prev, currentWords[currentIndex]]);
          }
          setIsMissed(true);
        }
        break;
      case "fourChoiceReverse":
        isCorrect = answer === currentWords[currentIndex]?.word;
        if (!isCorrect) {
          if (!isMissed) {
            setMissedWord((prev) => [...prev, currentWords[currentIndex]]);
          }
          setIsMissed(true);
        }
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

  const handleChoiceClick = (choice: WordData, i: number) => {
    if (!checkAnswer(getChoiceText(choice))) {
      setMissedChoiceIndexes((prev) => [...prev, i]);
    }
  };

  const updateChoices = (answer: WordData) => {
    const newChoices: WordData[] = [];
    const tempWords = [...words];
    const answerIndex = tempWords.indexOf(answer);
    tempWords.splice(answerIndex, 1);
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * tempWords.length);
      newChoices.push(tempWords[randomIndex]);
      tempWords.splice(randomIndex, 1);
    }
    newChoices.push(answer);
    newChoices.sort(() => Math.random() - 0.5);
    setChoices(newChoices);
  };

  const showNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    updateChoices(currentWords[nextIndex]);
    clearInput();
    setIsAnswerShown(false);
    setIsMissed(false);
    setMissedChoiceIndexes([]);
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

  const getChoiceText = (choice: WordData): string => {
    if (answerMode.key === "fourChoice") {
      return choice.japanese;
    } else {
      return choice.word;
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
          {answerMode.key === "default" ? (
            <Input
              className={"text-lg text-center"}
              onChange={(e) => checkAnswer(e.target.value)}
              ref={inputRef}
            />
          ) : (
            choices.map((choice, i) => (
              <div
                key={i}
                className={`p-2 rounded-base bg-white border-2 cursor-pointer transition-colors duration-300 ${
                  missedChoiceIndexes.includes(i)
                    ? "border-red-600"
                    : "border-border"
                }`}
                onClick={() => handleChoiceClick(choice, i)}
              >
                {getChoiceText(choice)}
              </div>
            ))
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
