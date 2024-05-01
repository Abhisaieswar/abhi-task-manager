import React from "react";
import Input from "./Input";
import Button from "./Button";
import cloneDeep from "clone-deep";
import { allTasks } from "./Taskboard/types";

interface subNavProps {
  searchText: string;
  setTableSettingsOpen: (type: boolean) => void;
  setSearchText: (type: string) => void;
  setIsAddModalOpen: (type: boolean) => void;
  setEditColumns: any;
  tasks: allTasks[];
  spaces: any;
  space: string;
  onChangeSpace: any;
}

const SubNavbar = ({
  searchText,
  setTableSettingsOpen,
  setSearchText,
  setIsAddModalOpen,
  setEditColumns,
  tasks,
  spaces,
  space,
  onChangeSpace,
}: subNavProps) => {
  return (
    <div className="flex  items-center justify-between my-2 flex-wrap">
      <Input
        type="search"
        placeholder="Search tasks"
        value={searchText}
        size={1}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className="flex items-center gap-2 flex-wrap-reverse">
        <div className="flex items-center gap-2">
          <Input
            type="dropdown"
            options={spaces}
            value={space}
            onChange={onChangeSpace}
          />
        </div>
        <Button text="Create" onClick={() => setIsAddModalOpen(true)} />
        <Button
          text="Settings"
          onClick={() => {
            setTableSettingsOpen(true);
            setEditColumns(cloneDeep(tasks));
          }}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default SubNavbar;
