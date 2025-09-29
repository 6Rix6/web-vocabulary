import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { WordData } from "@/types/WordData";
import { cn } from "@/lib/utils";

type BaseProps = {
  className?: string;
  children?: React.ReactNode;
};

type Props =
  | (BaseProps & {
      showRangeInput?: false;
      setStartIndex?: undefined;
      setEndIndex?: undefined;
    })
  | (BaseProps & {
      showRangeInput: true;
      words: WordData[];
      startIndex: number;
      endIndex: number;
      setStartIndex: (index: number) => void;
      setEndIndex: (index: number) => void;
      onSubmit: () => void;
    });

export const Header = (props: Props) => {
  const checkIsRangeValid = (): boolean => {
    if (!props.showRangeInput) return false;
    if (props.startIndex > props.endIndex) {
      return false;
    }
    if (props.startIndex < 0) {
      return false;
    }
    return props.endIndex < props.words.length;
  };
  return (
    <header
      className={cn(
        "w-full bg-white border-b-4 border-foreground",
        props.className
      )}
    >
      <div className={"w-full p-2"}>{props.children}</div>
      {props.showRangeInput && (
        <div className={"w-full h-16 flex items-center justify-center"}>
          <div className={"font-bold mr-2"}>範囲:</div>
          <div className={"w-20"}>
            <Input
              inputMode={"numeric"}
              type={"number"}
              min={1}
              max={props.words.length}
              value={props.startIndex + 1}
              onChange={(e) => props.setStartIndex(Number(e.target.value) - 1)}
            />
          </div>
          <div>～</div>
          <div className={"w-20"}>
            <Input
              inputMode={"numeric"}
              type={"number"}
              min={1}
              max={props.words.length}
              value={props.endIndex + 1}
              onChange={(e) => props.setEndIndex(Number(e.target.value) - 1)}
            />
          </div>
          <Button
            className={"ml-2"}
            onClick={() => props.onSubmit()}
            disabled={!checkIsRangeValid()}
          >
            決定
          </Button>
        </div>
      )}
    </header>
  );
};
