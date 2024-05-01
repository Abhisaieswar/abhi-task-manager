import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

interface listProps {
  list: { id: number; title: string }[];
  index: number;
  name: string;
  onViewTask: (id: string, name: string) => void;
  onMarkImportant: (id: string, name: string) => void;
}

const ListContainer = ({
  list,
  name,
  index,
  onViewTask,
  onMarkImportant,
}: listProps) => {
  return (
    <div className="min-w-[280px] p-2 bg-gray-50 pb-14 shadow-lg rounded-lg border w-full  max-w-md">
      <div className="flex px-3 py-2 items-center rounded-t-lg justify-between sticky top-0 backdrop-blur">
        <h2 className="text-lg font-bold text-[#AAAAAA]">
          {name.toUpperCase()}
        </h2>
        <p className="text-lg opacity-50 ml-4">{list.length}</p>
      </div>
      <Droppable droppableId={index.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${
              snapshot.isDraggingOver ? "bg-gray-200" : ""
            } p-2 rounded-lg h-full overflow-x-hidden overflow-y-auto`}
          >
            {list.map((item, index) => (
              <Task
                item={item}
                index={index}
                key={index}
                onViewTask={onViewTask}
                name={name}
                onMarkImportant={onMarkImportant}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ListContainer;
