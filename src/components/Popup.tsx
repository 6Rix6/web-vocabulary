import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  popupTitle: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const Popup = ({ isOpen, onClose, popupTitle, children }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 少し遅延させてからフェードイン開始
      document.body.classList.add("popup-open");
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.classList.remove("popup-open");
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 100);
  };

  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-100 ${
        isVisible
          ? "bg-opacity-50 backdrop-blur-lg"
          : "bg-opacity-0 backdrop-blur-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"w-full flex items-center justify-between gap-3 mb-4"}>
          <h2 className={"text-xl"}>{popupTitle}</h2>
          <Button size="sm" onClick={handleClose} className="text-black">
            ×
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
