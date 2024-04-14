import { FormEvent } from "react";

type Props = {
  newTaskInput: string;
  image: File | null;
  e: FormEvent<HTMLFormElement>;
  setImage: (image: File | null) => void;
  closeModal: () => void;
  addTask: (
    task: string,
    columnId: TypedColumn,
    image?: File | null | undefined
  ) => void;
  newTaskType: TypedColumn;
};

const handleAddTaskSubmit = ({
  newTaskInput,
  image,
  e,
  setImage,
  closeModal,
  addTask,
  newTaskType,
}: Props) => {
  e.preventDefault();

  if (!newTaskInput) return;

  //add Task
  addTask(newTaskInput, newTaskType, image);
  setImage(null);
  closeModal();
};

export default handleAddTaskSubmit;
