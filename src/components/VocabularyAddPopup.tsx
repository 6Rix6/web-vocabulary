import React, { useState, useEffect } from "react";
import { Popup } from "@/components/Popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import colors, { defaultColor } from "@/data/colors";
import { Button } from "@/components/ui/button";
import type { WordData } from "@/types/WordData";
import Papa from "papaparse";
import {
  addVocabulary,
  getVocabularyList,
  setVocabularyList,
} from "@/lib/storeVocabularyList";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const VocabularyAddPopup = ({ onClose, isOpen }: Props) => {
  const [{ name, main }, setColor] = useState(defaultColor);
  const [vocabularyName, setVocabularyName] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [vocabularyKind, setVocabularyKind] = useState<"word" | "sentence">(
    "word"
  );
  const [jsonData, setJsonData] = useState<WordData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setColor(defaultColor);
    setVocabularyName(null);
    setWordCount(null);
    setJsonData(null);
    setError(null);
  }, [isOpen]);

  /**
   * CSVファイルを読み込み、JSONに変換する関数
   * @param file CSVファイル
   */
  const convertCsvToJson = (file: File) => {
    setError(null);

    Papa.parse(file, {
      complete: (results) => {
        try {
          // 各行を WordData に変換
          const data: WordData[] = results.data.map((row: any, idx: number) => {
            if (row.length < 3) {
              throw new Error(`CSVのフォーマットが不正です。(行 ${idx + 1})`);
            }

            const number = parseInt(row[0], 10);
            const word = row[1]?.trim();
            const japanese = row[2]?.trim();

            if (isNaN(number) || !word || !japanese) {
              throw new Error(`不正なデータ行 (行 ${idx + 1}): ${row}`);
            }

            return {
              number,
              word,
              japanese,
            };
          });

          setJsonData(data);
          setWordCount(data.length);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          }
          setJsonData(null);
        }
      },
      error: () => {
        setError("ファイルの読み込み中にエラーが発生しました。");
        setJsonData(null);
      },
      skipEmptyLines: true, // 空行を無視
    });
  };

  /**
   * ファイルが選択されたときのハンドラ
   * @param e ファイル入力イベント
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertCsvToJson(file);
    }
  };

  const updateColor = (value: string) => {
    const color = colors.find((color) => color.name === value)!;
    setColor(color);
  };

  const handleAddVocabulary = () => {
    if (!main || !vocabularyName || !wordCount || !jsonData) return;
    const newVocabulary = {
      name: vocabularyName,
      wordCount,
      color: main,
      kind: vocabularyKind,
    };
    const prevList = getVocabularyList();
    if (!prevList) {
      setVocabularyList([newVocabulary]);
    } else {
      const isExsist = prevList.some((item) => item.name === vocabularyName);
      if (isExsist) {
        setError("同じ名前の単語帳が存在します。");
        return;
      }
      addVocabulary(newVocabulary);
    }
    localStorage.setItem(vocabularyName, JSON.stringify(jsonData));
    onClose();
  };

  return (
    <Popup popupTitle={"単語帳を追加"} onClose={onClose} isOpen={isOpen}>
      <div className={"flex flex-col gap-3"}>
        {error && <div className={"text-red-500 text-sm"}>{error}</div>}
        <div className={"grid grid-cols-4 w-full items-center gap-1.5"}>
          <Label htmlFor="book-title">タイトル</Label>
          <Input
            id={"book-title"}
            className={"col-span-3"}
            placeholder={"単語帳の名前"}
            onChange={(e) => setVocabularyName(e.target.value)}
          />
        </div>
        <div className={"grid grid-cols-4 w-full items-center gap-1.5"}>
          <Label htmlFor={"file"}>CSVファイル</Label>
          <Input
            className="col-span-3"
            id={"file"}
            type={"file"}
            accept={".csv"}
            onChange={handleFileChange}
          />
        </div>
        <div className={"grid grid-cols-4 w-full items-center gap-1.5"}>
          <Label htmlFor="kind-select">種類</Label>
          <div className={"col-span-3 flex justify-end"} id={"kind-select"}>
            <div className="min-w-40">
              <Select
                value={vocabularyKind}
                onValueChange={(value) =>
                  setVocabularyKind(value as "word" | "sentence")
                }
              >
                <SelectTrigger
                  id="color"
                  className="bg-secondary-background text-foreground"
                >
                  <SelectValue placeholder="ラベルカラーを選択" />
                </SelectTrigger>
                <SelectContent className="bg-secondary-background text-foreground">
                  <SelectItem value={"word"}>単語帳</SelectItem>
                  <SelectItem value={"sentence"}>例文集</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className={"grid grid-cols-4 w-full items-center gap-1.5"}>
          <Label htmlFor="color-select">ラベルカラー</Label>
          <div className={"col-span-3 flex justify-end"} id={"color-select"}>
            <div className="min-w-40">
              <Select value={name} onValueChange={updateColor}>
                <SelectTrigger
                  id="color"
                  className="bg-secondary-background text-foreground"
                >
                  <SelectValue placeholder="ラベルカラーを選択" />
                </SelectTrigger>
                <SelectContent className="bg-secondary-background text-foreground">
                  {colors.map(({ name, main }) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-4 rounded-full border-2 border-border"
                          style={{ backgroundColor: main }}
                        />
                        {name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className={"flex justify-center items-center"}>
          <Button
            onClick={handleAddVocabulary}
            disabled={!main || !vocabularyName || !wordCount || !jsonData}
          >
            追加
          </Button>
        </div>
      </div>
    </Popup>
  );
};
