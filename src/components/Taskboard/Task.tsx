import { Draggable } from "react-beautiful-dnd";
import parse from "html-react-parser";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Task = ({ item, index, onViewTask, name, onMarkImportant }: any) => {
  return (
    <div>
      <Draggable
        key={item.id.toString()}
        draggableId={item.id.toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${
              snapshot.isDragging ? "bg-white shadow border" : ""
            } mb-2 py-2 px-4  rounded-lg cursor-move border p-2 bg-white ${
              item?.important && "border-amber-400"
            }
            `}
            title={item.title}
          >
            <div onClick={() => onViewTask(item.id, name)}>
              <p className="text-lg font-sans text-gray-700 font-bold">
                {item.title}
              </p>
              <div className="text-xs max-h-12 opacity-80 text-ellipsis overflow-hidden">
                {parse(item.description)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs truncate text-slate-500	mt-1">#{item?.id}</p>
              {item?.important ? (
                <AiFillStar
                  className="cursor-pointer text-amber-400"
                  onClick={() => onMarkImportant(item?.id, name)}
                  title="Important"
                />
              ) : (
                <AiOutlineStar
                  className="cursor-pointer text-[#d0d9ec]"
                  onClick={() => onMarkImportant(item?.id, name)}
                  title="Mark as important"
                />
              )}
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default Task;
