"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import Link from "next/link";
import Layout from "@/components/Layout";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const sendResetPasswordLink = async () => {
    if (!email) {
      toast.error("Email required");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      toast.success("Reset password link sent!");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <Layout>
      <div className="flex items-center justify-start mt-20 h-[100vh] flex-col">
        <ToastContainer />
        <div className="shadow-xl bg-white text-gray-700 w-[90%] md:w-[35%] rounded-xl border p-8 m-4 backdrop-blur">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h1>
          <div>
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              text="Send reset password link"
              onClick={sendResetPasswordLink}
              loading={loading}
              float="right"
            />
          </div>
        </div>
        <Link href={"/login"} className="cursor-pointer underline">
          Go Back
        </Link>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
