import React, { useState } from "react";
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
import colors from "@/data/colors";
import { Button } from "@/components/ui/button";
import type { WordData } from "@/types/WordData";
import type { VocabularyData } from "@/types/VocabularyData";
import Papa from "papaparse";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const VocabularyAddPopup = ({ onClose, isOpen }: Props) => {
  const defaultColorPalette = colors[10];
  const [{ name, main }, setColor] = useState(defaultColorPalette);
  const [vocabularyName, setVocabularyName] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [jsonData, setJsonData] = useState<WordData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    };
    const prevList = loadVocabularyList();
    if (!prevList) {
      localStorage.setItem("vocabulary-list", JSON.stringify([newVocabulary]));
    } else {
      const newList = [...prevList, newVocabulary];
      localStorage.setItem("vocabulary-list", JSON.stringify(newList));
    }
    localStorage.setItem(vocabularyName, JSON.stringify(jsonData));
    onClose();
  };

  const loadVocabularyList = (): VocabularyData[] | null => {
    const prevList = localStorage.getItem("vocabulary-list");
    if (!prevList) return null;
    return JSON.parse(prevList);
  };

  return (
    <Popup popupTitle={"単語帳を追加"} onClose={onClose} isOpen={isOpen}>
      <div className={"flex flex-col gap-3"}>
        <div className={"grid w-full items-center gap-1.5"}>
          <Label htmlFor="book-title">タイトル</Label>
          <Input
            id={"book-title"}
            placeholder={"単語帳の名前"}
            onChange={(e) => setVocabularyName(e.target.value)}
          />
        </div>
        <div className={"grid w-full items-center gap-1.5"}>
          <Label htmlFor={"file"}>CSVファイル</Label>
          <Input
            id={"file"}
            type={"file"}
            accept={".csv"}
            onChange={handleFileChange}
          />
          {error && <div className={"text-red-500 text-sm"}>{error}</div>}
        </div>
        <div className={"grid w-full items-center gap-1.5"}>
          <Label>ラベルカラー</Label>
          <div className={"w-full"} id={"color-select"}>
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
