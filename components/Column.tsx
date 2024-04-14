import { Draggable, Droppable } from "@hello-pangea/dnd";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import TaskCard from "./TaskCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import handleAddTodo from "@/utility/handleAddTodo";

type Props = {
  id: TypedColumn;
  tasks: Tasks[];
  index: number;
};

const idToColumnHeading: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, tasks, index }: Props) => {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);

  const openModal = useModalStore((state) => state.openModal);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render droppable tasks in the column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnHeading[id]}

                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                    {tasks.length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {tasks.map((task, index) => {
                    if (
                      searchString &&
                      !task.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;

                    return (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TaskCard
                            task={task}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      onClick={() =>
                        handleAddTodo({ id, setNewTaskType, openModal })
                      }
                      className="text-green-500 hover:text-green-600"
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
