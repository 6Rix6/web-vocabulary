import { Button } from "@/components/ui/button";
import type { WordData } from "@/types/WordData.ts";
import { Popup } from "@/components/Popup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  missedWords: WordData[];
}

export const MissedWordsPopup = ({ isOpen, onClose, missedWords }: Props) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose} popupTitle={"間違えた単語"}>
      {missedWords.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p className="text-lg">🎉 全問正解！</p>
          <p>間違えた単語はありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            間違えた単語: {missedWords.length}個
          </p>
          {missedWords.map((word, index) => (
            <div
              key={`${word.number}-${index}`}
              className="border rounded-lg p-3 bg-red-50"
            >
              <div className="font-semibold text-lg">{word.japanese}</div>
              <div className="text-blue-600 font-medium">{word.word}</div>
              <div className="text-xs text-gray-500">No. {word.number}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button onClick={onClose} className="px-6">
          閉じる
        </Button>
      </div>
    </Popup>
  );
};
