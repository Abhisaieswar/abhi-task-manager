"use client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import React from "react";

const VerifyEmail = () => {
  const route = useRouter();
  return (
    <div className="flex items-center justify-start pt-15 h-[100vh] flex-col ">
      <div className="shadow-xl bg-white text-gray-700 rounded-xl border p-8 m-4 backdrop-blur">
        <h1 className="text-3xl font-bold mb-4 text-center">Taskboard</h1>
        <div className="flex items-center justify-center flex-col gap-4">
          <h3>
            Verification link sent to your email, please verify your account.
          </h3>
          <div>
            <p className="mb-2">Already verified?</p>
            <Button text="Back to login" onClick={() => route.push("/login")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
