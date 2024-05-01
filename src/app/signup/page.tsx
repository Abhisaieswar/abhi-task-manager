"use client";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addNewUser, checkIfUserExists, mapAuthCodeToMessage } from "../../../utils/firebaseUtils";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import Loading from "../loading";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import Layout from "@/components/Layout";

const newTask = [
  {
    space_id: uuidv4(),
    space_name: "my space",
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
    last_id: 0
  },
];

export default function Signup() {
  const [user, loading] = useAuthState(auth);
  const [signOut, error] = useSignOut(auth);
  const [isLoading, setLoading] = useState(false);
  const route = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const googleAuthProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const isExist = await checkIfUserExists(result.user.uid);
      let addUser;
      if (!isExist) {
        addUser = await addNewUser({
          user_id: result?.user?.uid,
          display_name: result.user.displayName,
          email: result.user.email,
          tasks: newTask,
        });
      }
      if (isExist || addUser) {
        toast.success("Sigin successful");
        route.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "");
    }
  };

  useEffect(() => {
    if (user?.emailVerified) {
      route.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      let a = await sendEmailVerification(auth.currentUser!);
      let addUser;
      if (user) {
        addUser = await addNewUser({
          user_id: user?.user?.uid,
          display_name: data.name,
          email: user.user.email,
          tasks: newTask,
        });
      }
      await updateProfile(auth?.currentUser!, {
        displayName: data.name,
      });
      signOut();
      setLoading(false);
      if (addUser) {
        route.push("/verify-email");
      }
    } catch (error: any) {
      toast.error(mapAuthCodeToMessage(error.code));
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-start pt-5 h-[80vh] flex-col ">
        <ToastContainer />
        <div className="shadow-xl bg-white text-gray-700 w-[90%] md:w-[35%] rounded-xl border p-8 m-4 backdrop-blur">
          <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>
          <form onSubmit={onSignup}>
            <Input
              label="Full name"
              type="text"
              maxLength={50}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required={true}
            />
            <Input
              label="Email"
              type="email"
              maxLength={120}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required={true}
            />
            <Input
              label="Password"
              type="password"
              maxLength={30}
              value={data.password}
              minLength={5}
              min={5}
              onChange={(e) =>
                setData({ ...data, password: e.target.value.trim() })
              }
              required={true}
            />
            <Button
              text="Sign up"
              float="right"
              type="submit"
              loading={isLoading || loading}
            />
          </form>
          <div
            className="flex justify-end w-full"
            style={{ marginTop: "50px" }}
          ></div>
          <h3 className="py-2 text-center">Or</h3>
          <div className="flex flex-col gap-4">
            <button
              onClick={googleLogin}
              className="p-3 border gap-2 flex items-center justify-center font-medium rounded-lg"
            >
              <FcGoogle className="text-2xl" /> Sign up with Google
            </button>
          </div>
        </div>
        <Link href={"/login"} className="underline cursor-pointer float-right">
          Login
        </Link>
      </div>
    </Layout>
  );
}
