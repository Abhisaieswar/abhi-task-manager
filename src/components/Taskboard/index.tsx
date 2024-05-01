"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ListContainer from "./TaskList";
import Input from "../Input";
import Button from "../Button";
import { allTasks, dropdowns, initialState, task } from "./types";
import cloneDeep from "clone-deep";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";
import { getUserDocs, updateUserDocs } from "../../../utils/firebaseUtils";
import AddTaskModal from "../Modal/AddTaskModal";
import ViewTaskModal from "../Modal/ViewTaskModal";
import EditColumModal from "../Modal/EditColumModal";
import SubNavbar from "../SubNavbar";

type Data = {
  name: string;
  list: { id: number; title: string }[];
};

type Props = {
  data: Data[];
};

const DragAndDrop: React.FC<Props> = () => {
  const [user, loading] = useAuthState(auth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tasks, setTasks] = useState<allTasks[] | []>([]);
  const [data, setData] = useState<task>(initialState);
  const [errors, setErrors] = useState<task>();
  const [dropdownOptions, setDropdownOptions] = useState<dropdowns[] | []>([]);
  const [viewTask, setViewTask] = useState<task>(initialState);
  const [viewModal, setViewModal] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [tableSettingsOpen, setTableSettingsOpen] = useState(false);
  const [editColumns, setEditColumns] = useState<allTasks[] | []>([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState("");
  const [allData, setAllData] = useState<any>();
  const [lastId, setLastId] = useState<number>(0);

  const getUserInfo = async () => {
    let d: any = await getUserDocs(user?.uid);
    let a = localStorage.getItem("s_id") || null;
    let currentSpace =
      d?.tasks.find((i: any) => i?.space_id === a)?.tasks || d?.tasks[0].tasks;
    setDropdownOptions(
      currentSpace?.map((i: allTasks) => {
        return {
          label: i.name,
          value: i.name,
        };
      }) || []
    );
    setAllData(d);
    setLastId(
      d?.tasks.find((i: any) => i?.space_id === a)?.last_id ||
        d?.tasks[0].last_id
    );
    setSpaces(
      d?.tasks?.map((i: any) => ({ label: i.space_name, value: i.space_id }))
    );
    setSelectedSpace(a || d?.tasks[0].space_id);
    setTasks(currentSpace);
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchText, setSearchText] = useState("");
  const searchResults = useMemo(() => {
    if (searchText.trim().length === 0) {
      getUserInfo();
      return [];
    }
    let results: allTasks[] = cloneDeep(tasks);
    return results.map((i: allTasks) => {
      i.list = i.list.filter(
        (j: task) =>
          j.title
            .trim()
            .toLowerCase()
            .includes(searchText.trim().toLowerCase()) ||
          j.id.trim().toLowerCase().includes(searchText.trim().toLowerCase())
      );
      return i;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    setTasks(searchResults || []);
  }, [searchResults]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result;

    // If the item was not dropped in a droppable area, return early
    if (!destination) {
      return;
    }

    // If the item was dropped in the same position, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the type of the droppable area is "list-container"
    if (type === "list-container") {
      // Get the source and destination index
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      // Remove the source list from the data
      const sourceList = tasks.splice(sourceIndex, 1)[0];

      // Insert the source list to the destination index
      tasks.splice(destinationIndex, 0, sourceList);

      // Update the state
      updateUserDocs(user?.uid, tasks, selectedSpace, allData);
      setTasks([...tasks]);
    } else {
      // Find the source and destination lists based on their droppableId
      const sourceListIndex = parseInt(source.droppableId);
      const destinationListIndex = parseInt(destination.droppableId);

      const sourceList = tasks[sourceListIndex].list;
      const destinationList = tasks[destinationListIndex].list;

      // Find the item that was dragged
      let item: any = sourceList.find(
        (i: any) => i.id.toString() === draggableId
      );

      // Remove the item from the source list
      sourceList.splice(source.index, 1);

      // Add the item to the destination list
      item.status = tasks[destinationListIndex].name;
      destinationList.splice(destination.index, 0, item);
      // Update the state of your application to reflect the new position of the item
      updateUserDocs(user?.uid, tasks, selectedSpace, allData);
      setTasks([...tasks]);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setViewModal(false);
    setViewTask(initialState);
    setEnableEdit(false);
    setTableSettingsOpen(false);
  };

  const validate = (input: task) => {
    let errors: any = {};
    if (!input.title.trim()) {
      errors.title = "Title required";
    }
    // if (!input.description.trim()) {
    //   errors.description = "Description required";
    // }
    if (!input.status.trim()) {
      errors.status = "Status required";
    }
    setErrors(errors);
    return errors;
  };

  const onSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let cData = data;

    const isErrors = validate(cData);
    if (Object.keys(isErrors).length) {
      return false;
    }

    cData.createdAt = `${new Date()}`;
    cData.updatedAt = `${new Date()}`;
    let len = 0;
    tasks.forEach((i) => (len += i.list.length));
    cData.id = `${lastId + 1}`;
    let tasks1 = cloneDeep(tasks);

    tasks1 = tasks1.map((i: allTasks) => {
      if (i.name.toLowerCase() === cData.status.toLowerCase()) {
        i.list.push(cData);
      }
      return i;
    });
    setTasks(tasks1);
    updateUserDocs(user?.uid, tasks1, selectedSpace, allData, lastId + 1);
    setLastId((id) => id + 1);
    setData(initialState);
    handleModalClose();
  };

  const onSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isErrors = validate(viewTask || initialState);
    if (Object.keys(isErrors).length) {
      return false;
    }
    let arr = cloneDeep(tasks);
    let index = arr.findIndex(
      (obj) => obj.name.toLowerCase() === viewTask?.status.toLowerCase()
    );
    let index2 = arr.findIndex(
      (obj) => obj.name.toLowerCase() === viewTask?.from?.toLowerCase()
    );

    if (index !== -1) {
      // if a matching object was found, remove the old viewTask (if it exists) and push the viewTask
      arr[index].list = arr[index].list.filter(
        (task: task) => task.id !== viewTask?.id
      );
      arr[index2].list = arr[index2].list.filter(
        (task: task) => task.id !== viewTask?.id
      );
      let { from, ...rest } = viewTask;
      arr[index].list.push(rest);
    }
    setTasks(arr);
    updateUserDocs(user?.uid, arr, selectedSpace, allData);
    setViewTask(initialState);
    handleModalClose();
  };

  const onViewTask = (id: string, name: string) => {
    tasks.forEach((item: any) => {
      if (item.name === name) {
        item.list.map((i: task) => {
          if (i.id === id) {
            setViewTask({ ...i, from: i.status, updatedAt: `${new Date()}` });
          }
        });
      }
    });
    setViewModal(true);
  };

  const onDeleteTask = () => {
    let confirm = window.confirm("are you sure?");
    if (!confirm) return;
    let arr = [...tasks];
    let index2 = arr.findIndex(
      (obj) => obj.name.toLowerCase() === viewTask?.from?.toLowerCase()
    );
    arr[index2].list = arr[index2].list.filter(
      (task: task) => task.id !== viewTask.id
    );
    setTasks(arr);
    updateUserDocs(user?.uid, arr, selectedSpace, allData);
    setViewTask(initialState);
    handleModalClose();
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    if (viewModal) {
      setViewTask({
        ...viewTask,
        [name]: name === "description" ? e : e.currentTarget?.value,
      });
    } else {
      setData({
        ...data,
        [name]: name === "description" ? e : e.currentTarget?.value,
      });
    }
  };

  const onAddColumn = () => {
    setEditColumns([
      ...editColumns,
      {
        name: "",
        list: [],
      },
    ]);
  };

  const onDeleteColumn = (idx: number) => {
    const isOk = window.confirm("are you sure?");
    if (!isOk) {
      return;
    }
    setEditColumns(
      editColumns.filter((i: any, index: number) => idx !== index)
    );
  };

  function onEditColumn(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const { value } = event.target;

    setEditColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].name = value;
      return newColumns;
    });
  }

  const onUpdateColumns = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTasks(editColumns);
    updateUserDocs(user?.uid, editColumns, selectedSpace, allData);
    handleModalClose();
    setEditColumns([]);
    setDropdownOptions(
      editColumns?.map((i: any) => {
        return {
          label: i.name,
          value: i.name,
        };
      })
    );
  };

  function handleDragEnd2(result: any) {
    if (!result.destination) return;

    const items = Array.from(editColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newColumns = items.map((col) => {
      return {
        ...col,
      };
    });

    setEditColumns(newColumns);
  }

  const onChangeSpace = async (e: any) => {
    const val = e.target.value;
    setSelectedSpace(val);
    localStorage.setItem("s_id", val);
    setTasks(allData?.tasks?.find((i: any) => i.space_id === val).tasks || []);
    setLastId(Number(allData?.tasks?.find((i: any) => i.space_id === val).last_id || []))
    let d: any = await getUserDocs(user?.uid);
    let a = localStorage.getItem("s_id") || null;
    let currentSpace =
      d?.tasks.find((i: any) => i?.space_id === a)?.tasks || d?.tasks[0].tasks;
    setDropdownOptions(
      currentSpace?.map((i: allTasks) => {
        return {
          label: i.name,
          value: i.name,
        };
      }) || []
    );
  };

  const refreshTables = () => {
    getUserInfo();
    window.localStorage.removeItem("s_id");
    setLastId(0)
  };

  const onMarkImportant = (id: string, name: string) => {
    let arr = cloneDeep(tasks);
    let index2 = arr.findIndex(
      (obj) => obj.name.toLowerCase() === name?.toLowerCase()
    );
    arr[index2].list = arr[index2].list.filter((task: task) => {
      if (task.id === id) {
        task.important = !task.important;
      }
      return task;
    });
    setTasks(arr);
    updateUserDocs(user?.uid, arr, selectedSpace, allData);
  };

  return (
    <>
      <AddTaskModal
        isAddModalOpen={isAddModalOpen}
        handleModalClose={handleModalClose}
        onSubmitAdd={onSubmitAdd}
        errors={errors}
        data={data}
        onInputChange={onInputChange}
        dropdownOptions={dropdownOptions}
      />
      <ViewTaskModal
        viewModal={viewModal}
        handleModalClose={handleModalClose}
        viewTask={viewTask}
        onSubmitEdit={onSubmitEdit}
        enableEdit={enableEdit}
        errors={errors}
        onInputChange={onInputChange}
        dropdownOptions={dropdownOptions}
        onDeleteTask={onDeleteTask}
        setEnableEdit={setEnableEdit}
      />
      <EditColumModal
        tableSettingsOpen={tableSettingsOpen}
        handleModalClose={handleModalClose}
        handleDragEnd2={handleDragEnd2}
        onUpdateColumns={onUpdateColumns}
        editColumns={editColumns}
        onEditColumn={onEditColumn}
        onAddColumn={onAddColumn}
        onDeleteColumn={onDeleteColumn}
        user={user}
        spaces={spaces}
        refreshTables={refreshTables}
      />
      <SubNavbar
        searchText={searchText}
        setTableSettingsOpen={setTableSettingsOpen}
        setSearchText={setSearchText}
        setIsAddModalOpen={setIsAddModalOpen}
        setEditColumns={setEditColumns}
        tasks={tasks}
        spaces={spaces}
        onChangeSpace={onChangeSpace}
        space={selectedSpace}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-2 scroll-snap-type-x mandatory h-[73vh] scroll-snap-type-x mandatory overflow-y-hidden">
          {tasks?.length !== 0 ? (
            tasks?.map((d: any, index: number) => (
              <ListContainer
                list={d.list}
                index={index}
                name={d.name}
                key={index}
                onViewTask={onViewTask}
                onMarkImportant={onMarkImportant}
              />
            ))
          ) : (
            <div className="border rounded w-full h-[80px] flex items-center justify-center">
              <h3 className="text-center">Start creating tasks</h3>
            </div>
          )}
        </div>
      </DragDropContext>
    </>
  );
};

export default DragAndDrop;
