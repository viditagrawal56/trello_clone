type Props = {
  id: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  openModal: () => void;
};

const handleAddTodo = ({ id, setNewTaskType, openModal }: Props) => {
  setNewTaskType(id);
  openModal();
};

export default handleAddTodo;
