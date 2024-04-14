"use client";

import { useBoardStore } from "@/store/BoardStore";
import getUrl from "@/utility/getUrl";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  task: Tasks;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TaskCard = ({
  task,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) => {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (task.image) {
      const fetchImage = async () => {
        const url = await getUrl(task.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
    }
  }, [task]);

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{task.title}</p>
        <button
          onClick={() => deleteTask(index, task, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
