"use client";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import UserPopover from "./Popover";
import MyPopover from "./Popover";

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex items-center justify-between py-4 border-b bg-white">
      <div>
        <Link href={"/"} className="text-2xl text-bold">
          Taskboard
        </Link>
      </div>
      {user?.uid && window.location.pathname === "/" && (
        <MyPopover user={user} />
      )}
    </nav>
  );
}
