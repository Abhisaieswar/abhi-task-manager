/* eslint-disable @next/next/no-img-element */
"use client";
import { Popover } from "@headlessui/react";
import Button from "./Button";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/navigation";

function MyPopover({ user }: any) {
  const route = useRouter();

  const [signOut, loading, error] = useSignOut(auth);
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Popover className="relative -my-2">
      <Popover.Button className={"outline-none"}>
        {user?.photoURL ? (
          <img
            src={user?.photoURL || ""}
            alt={"avatar"}
            referrerPolicy="no-referrer"
            className="w-10 rounded-full"
            title={user?.displayName || ""}
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-orange-500	text-white font-bold">
            {String(user?.displayName).charAt(0).toUpperCase()}
          </div>
        )}
      </Popover.Button>

      <Popover.Panel className="absolute right-4 border h-fit z-10 rounded p-4 bg-gray-100 shadow-lg flex justify-center flex-col items-center">
        <p className="leading-4 mb-2">Hello, {user?.displayName}!</p>
        <p className="mb-4 text-sm text-gray-500">{user?.email}</p>
        <Button
          text="Logout"
          variant="danger"
          onClick={async () => {
            const success = await signOut();
            if (success) {
              route.push("/login");
            }
          }}
        />
      </Popover.Panel>
    </Popover>
  );
}

export default MyPopover;
