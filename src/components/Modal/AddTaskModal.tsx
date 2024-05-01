import React from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { dropdowns, task } from "../Taskboard/types";
import "react-quill/dist/quill.snow.css";
import QuillComponent from "../Quill";

interface Modal1Props {
  isAddModalOpen: boolean;
  handleModalClose: () => void;
  onSubmitAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: any;
  data: task;
  onInputChange: (e: any, name: string) => void;
  dropdownOptions: dropdowns[];
}

const AddTaskModal = ({
  isAddModalOpen,
  handleModalClose,
  onSubmitAdd,
  errors,
  data,
  onInputChange,
  dropdownOptions,
}: Modal1Props) => {
  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={handleModalClose}
      title="Add a task"
      size="xl"
    >
      <form onSubmit={onSubmitAdd}>
        <Input
          label="Title"
          type="text"
          required
          value={data.title}
          onChange={(e) => onInputChange(e, "title")}
          maxLength={120}
          minLength={5}
          error={errors?.title}
        />
        {/* <Input
          label="Description"
          type="textarea"
          required
          value={data.description}
          onChange={(e) => onInputChange(e, "description")}
          error={errors?.description}
        /> */}
        <QuillComponent
          label="Description"
          value={data.description}
          onChange={(e: any) => onInputChange(e, "description")}
        />
        <div className="flex items-end justify-between">
          <Input
            label="Status"
            type="dropdown"
            options={dropdownOptions}
            value={data.status}
            required
            onChange={(e) => onInputChange(e, "status")}
            error={errors?.status}
          />
          <Button text="Submit" float="right" />
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
