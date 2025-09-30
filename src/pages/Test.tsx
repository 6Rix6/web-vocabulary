import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { customStrategy } from "@/lib/customStrategy";

export type Item = {
  id: number;
  text: string;
};

export default function Test() {
  const sentence = "You look pale. What is the matter with you?";

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <SortField text={sentence}></SortField>
    </div>
  );
}

const SortField = ({ text }: { text: string }) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const shuffled = text.split(" ").sort(() => 0.5 - Math.random());
    let initial = [];
    for (let i = 0; i < shuffled.length; i++) {
      initial.push({ id: i, text: shuffled[i] });
    }
    setItems(initial);
  }, [text]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((v) => v.id === active.id);
      const newIndex = items.findIndex((v) => v.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      const sortedSentence = [...newItems]
        .map((item) => item.text) // textだけ取り出す
        .join(" ");
      console.log(sortedSentence === text);
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={customStrategy}>
        <ul className="flex flex-wrap justify-center">
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  item: Item;
};

export const SortableItem: FC<Props> = ({ item }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    cursor: "move",
    listStyle: "none",
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "p-2 border-2 border-foreground rounded-md bg-white m-1 touch-none"
      }
      {...attributes}
      {...listeners}
    >
      {item.text}
    </div>
  );
};
