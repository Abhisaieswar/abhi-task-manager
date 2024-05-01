"use client";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdOutlineDelete, MdDragHandle, MdDelete } from "react-icons/md";
import Input from "../Input";
import Button from "../Button";
import { allTasks, dropdowns } from "../Taskboard/types";
import { Tab } from "@headlessui/react";
import { getUserDocs, updateSpaces } from "../../../utils/firebaseUtils";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "clone-deep";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Modal3Props {
  tableSettingsOpen: boolean;
  handleModalClose: () => void;
  handleDragEnd2: (result: any) => void;
  onUpdateColumns: (e: React.FormEvent<HTMLFormElement>) => void;
  editColumns: allTasks[];
  onEditColumn: (e: any, name: number) => void;
  onAddColumn: () => void;
  onDeleteColumn: (index: number) => void;
  user: any;
  spaces: dropdowns[];
  refreshTables: () => void;
}

const tabs = ["Table", "Space"];

const EditColumModal = ({
  tableSettingsOpen,
  handleModalClose,
  handleDragEnd2,
  onUpdateColumns,
  editColumns,
  onEditColumn,
  onAddColumn,
  onDeleteColumn,
  user,
  spaces,
  refreshTables,
}: Modal3Props) => {
  const [color, setColor] = useState();
  const [spaceName, setSpaceName] = useState("");
  const [allSpaces, setAllSpaces] = useState(cloneDeep(spaces));

  useEffect(() => {
    setAllSpaces(cloneDeep(spaces));
  }, [spaces]);

  const onCreateSpace = async (e: any) => {
    e.preventDefault();
    const d: any = await getUserDocs(user?.uid);
    if (d?.tasks.length >= 3) {
      alert("Maximum spaces limit exceeded");
      return;
    }
    const newTask = [
      {
        space_id: uuidv4(),
        space_name: spaceName,
        last_id: 0,
        users: [],
        tasks: [
          {
            name: "Todo",
            list: [],
          },
          {
            name: "Progress",
            list: [],
          },
          {
            name: "Completed",
            list: [],
          },
        ],
      },
    ];
    const updatedTasks = [...d?.tasks, ...newTask];
    await updateSpaces(user?.uid, updatedTasks);
    refreshTables();
  };
  const onDeleteSpace = (idx: number) => {
    const isOk = window.confirm("are you sure?");
    if (!isOk) {
      return;
    }
    setAllSpaces(allSpaces.filter((i: any, index: number) => idx !== index));
  };

  function onEditSpace(event: any, index: number) {
    const { value } = event.target;

    setAllSpaces((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].label = value;
      return newColumns;
    });
  }
  const onSubmitEditSpace = async (e: any) => {
    e.preventDefault();
    const data: any = await getUserDocs(user?.uid);
    let newTasks = data.tasks.filter((i: any) => {
      let k = allSpaces.find((j) => j.value === i.space_id);
      if (
        i.space_id === k?.value &&
        i.space_name.trim().toLowerCase() !== k?.label.trim().toLowerCase()
      ) {
        i.space_name = k?.label;
      }
      return k && i;
    });
    await updateSpaces(user?.uid, newTasks);
    refreshTables();
    closeModal();
  };
  const closeModal = () => {
    setAllSpaces(spaces);
    setSpaceName("")
    handleModalClose();
  };
  return (
    <Modal
      isOpen={tableSettingsOpen}
      onClose={closeModal}
      title={`Settings`}
      size="md"
    >
      <div className="w-full max-w-md px-2 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((item, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 ",
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                {item}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
              key={0}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400"
              )}
            >
              <DragDropContext onDragEnd={handleDragEnd2}>
                <form onSubmit={onUpdateColumns}>
                  <Droppable droppableId="columns" direction="vertical">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {editColumns.map((column, index) => (
                          <Draggable
                            key={column.name}
                            draggableId={column.name}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                // {...provided.dragHandleProps}
                                // className="flex-1 mx-4"
                                className="flex items-center gap-1 w-full"
                              >
                                <div
                                  title={"move column"}
                                  {...provided.dragHandleProps}
                                  className="text-xl  hover:bg-gray-200 p-2 rounded cursor-pointer border"
                                >
                                  <MdDragHandle />
                                </div>
                                <div className="w-full">
                                  <Input
                                    type="text"
                                    value={column.name}
                                    required
                                    maxLength={100}
                                    onChange={(e) => onEditColumn(e, index)}
                                    placeholder="Column name"
                                    autoFocus
                                  />
                                </div>
                                <div
                                  title={"delete column"}
                                  className="text-xl hover:bg-gray-200 p-2 rounded cursor-pointer text-red-600 border"
                                  onClick={() => onDeleteColumn(index)}
                                >
                                  <MdOutlineDelete />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      text="Add column"
                      type="button"
                      variant="secondary"
                      onClick={onAddColumn}
                    />
                    <Button text="Update" />
                  </div>
                </form>
              </DragDropContext>
            </Tab.Panel>
            <Tab.Panel
              key={1}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400"
              )}
            >
              <form onSubmit={onCreateSpace} className="flex items-end gap-2">
                <div className="w-full">
                  <Input
                    placeholder="Enter new space name"
                    onChange={(e: any) => setSpaceName(e.target.value)}
                    value={spaceName}
                    required={true}
                    minLength={4}
                    min={4}
                    max={50}
                    maxLength={50}
                    label="Crete new space"
                  />
                </div>
                <div className="flex gap-4 mb-[10px]">
                  <Button text="create" type="submit" />
                </div>
              </form>
              <form className="my-2" onSubmit={onSubmitEditSpace}>
                <h3 className="font-bold">Spaces</h3>
                {allSpaces?.map((item, idx) => (
                  <div
                    key={item.value}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="w-full">
                      <Input
                        type="text"
                        value={item.label}
                        required={true}
                        maxLength={50}
                        placeholder="space name"
                        onChange={(e) => onEditSpace(e, idx)}
                      />
                    </div>
                    {idx !== 0 && (
                      <div
                        title={"delete space"}
                        className="text-xl hover:bg-gray-200 p-2 rounded cursor-pointer text-red-600 border"
                        onClick={() => onDeleteSpace(idx)}
                      >
                        <MdOutlineDelete />
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-4 mb-2">
                  <Button text="Update" type="submit" />
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  );
};

export default EditColumModal;
