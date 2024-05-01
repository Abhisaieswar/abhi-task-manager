import React from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { dropdowns, task } from "../Taskboard/types";
import QuillComponent from "../Quill";
import parse from "html-react-parser";

interface Modal2Props {
  viewModal: boolean;
  handleModalClose: () => void;
  viewTask: task;
  onSubmitEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  enableEdit: boolean;
  errors: any;
  onInputChange: (e: any, name: string) => void;
  dropdownOptions: dropdowns[];
  onDeleteTask: () => void;
  setEnableEdit: (type: boolean) => void;
}

const ViewTaskModal = ({
  viewModal,
  handleModalClose,
  viewTask,
  onSubmitEdit,
  enableEdit,
  errors,
  onInputChange,
  dropdownOptions,
  onDeleteTask,
  setEnableEdit,
}: Modal2Props) => {
  return (
    <Modal
      isOpen={viewModal}
      onClose={handleModalClose}
      title={`#${viewTask?.id}`}
      size="xl"
    >
      <form onSubmit={onSubmitEdit}>
        {enableEdit ? (
          <>
            <Input
              label="Title"
              type="text"
              required
              value={viewTask?.title}
              onChange={(e) => onInputChange(e, "title")}
              maxLength={120}
              minLength={5}
              error={errors?.title}
              autoFocus
            />
            {/* <Input
              label="Description"
              type="textarea"
              required
              value={viewTask?.description}
              onChange={(e) => onInputChange(e, "description")}
              error={errors?.description}
            /> */}
            <QuillComponent
              label="Description"
              value={viewTask?.description}
              onChange={(e: any) => onInputChange(e, "description")}
              error={errors?.description}
            />
            <Input
              label="Status"
              type="dropdown"
              options={dropdownOptions}
              value={viewTask?.status}
              required
              onChange={(e) => onInputChange(e, "status")}
              error={errors?.status}
            />
          </>
        ) : (
          <div className="border p-2 rounded">
            {/* <label className="block font-bold text-xs">Title</label> */}
            <p className="mb-2 font-bold subpixel-antialiased	">
              {viewTask?.title}
            </p>
            <label className="block font-bold text-xs">Description</label>
            <div className="">{parse(viewTask?.description)}</div>
            <label className="block font-bold text-xs">Status</label>
            <p className="mb-2">{viewTask?.status}</p>
          </div>
        )}
        <p className="mb-2">
          {viewTask?.createdAt && (
            <span className="text-xs mr-2">
              created: {new Date(viewTask?.createdAt).toLocaleString()}
            </span>
          )}
          {viewTask?.updatedAt && (
            <span className="text-xs">
              | last updated: {new Date(viewTask?.updatedAt).toLocaleString()}
            </span>
          )}
        </p>
        <div className="flex items-center justify-between">
          {enableEdit ? (
            <>
              <div>
                <Button
                  text="Cancel"
                  variant="secondary"
                  onClick={() => setEnableEdit(false)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  text="Delete"
                  variant="danger"
                  type={"button"}
                  onClick={onDeleteTask}
                />
                <Button text="Update" />
              </div>
            </>
          ) : (
            <Button
              text="Edit"
              size="small"
              onClick={() => setEnableEdit(true)}
            />
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ViewTaskModal;
