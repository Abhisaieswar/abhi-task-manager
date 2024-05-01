"use client";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
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

export default function Login() {
  const [user, loading] = useAuthState(auth);
  const [signOut, error] = useSignOut(auth);

  const route = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
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
        route.push("/");
      }
    } catch (error: any) {
      toast.error(mapAuthCodeToMessage(error.code));
    }
  };

  useEffect(() => {
    if (user?.emailVerified) {
      route.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setLoading(false);
      if (!res.user.emailVerified) {
        toast.error("please verify your email");
        signOut();
        return;
      }
      toast.success("Login successful");
      route.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error(mapAuthCodeToMessage(error.code));
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-start pt-10 h-[80vh] flex-col ">
        <ToastContainer />
        <div className="shadow-xl bg-white text-gray-700 w-[90%] md:w-[35%] rounded-xl border p-8 m-4 backdrop-blur">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <form onSubmit={onLogin}>
            <Input
              label="Email"
              type="email"
              required={true}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value.trim() })
              }
            />
            <div className="flex justify-between items-center mt-4">
              <Link
                href={"/forgot-password"}
                className="underline cursor-pointer"
              >
                Forgot password?
              </Link>
              <Button text="Login" float="right" loading={isLoading} />
            </div>
          </form>
          <div
            className="flex justify-between w-full"
            style={{ marginTop: "50px" }}
          ></div>
          <h3 className="py-2 text-center">Or</h3>
          <div className="flex flex-col gap-4">
            <button
              onClick={googleLogin}
              className="p-3 border gap-2 flex items-center justify-center font-medium rounded-lg"
            >
              <FcGoogle className="text-2xl" /> Sign in with Google
            </button>
          </div>
        </div>
        <Link href={"/signup"} className="underline cursor-pointer">
          Create an account
        </Link>
      </div>
    </Layout>
  );
}
