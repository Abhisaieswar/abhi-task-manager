"use client";
import Layout from "@/components/Layout";
import Taskboard from "@/components/Taskboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebase";
import Button from "@/components/Button";
import Loading from "./loading";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  if (loading) {
    return  <Loading />;
  }
  if (!user) {
    return (
      <div className="m-32 self-center">
        <p className="my-4">Please login to continue</p>
        <Button text="back to login" onClick={() => route.push("/login")} />
      </div>
    );
  }

  return (
    <Layout>
      <Taskboard data={[]} />
    </Layout>
  );
}
