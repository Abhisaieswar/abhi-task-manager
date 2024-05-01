import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./Button";
import { GrFormClose } from "react-icons/gr";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
  size?: "sm" | "md" | "lg" | "xl";
  maxHeight?: number;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  maxHeight = 600,
}: ModalProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

  const handleClose = () => {
    setIsDialogOpen(false);
    onClose();
  };

  useEffect(() => {
    setIsDialogOpen(isOpen)
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  const maxHeightStyle = maxHeight ? { maxHeight: maxHeight + "px" } : {};

  return (
    <Transition
      show={isDialogOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10  backdrop-brightness-50 px-2"
        onClose={handleClose}
        open={isDialogOpen}
      >
        <div className="flex items-start justify-center min-h-screen pt-10 ">
          <div
            className={`bg-white rounded-lg shadow-xl overflow-y-auto w-full p-6 relative ${sizeClasses[size]}`}
            style={maxHeightStyle}
          >
            <Dialog.Title className="text-lg text-black font-bold mb-2 ">
              {title}
            </Dialog.Title>
            <div className="text-gray-500 text-sm mb-4">
              {children}
            </div>

            <button
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleClose}
            >
              <GrFormClose />
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
