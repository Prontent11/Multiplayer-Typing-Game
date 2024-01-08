"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const [data, setData] = useState("");
  const Logout = async () => {
    try {
      await axios.get("/api/logout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/me/");
      if (!data) setData(response.data.data.username);
      else setData("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <h1>{data ? <Link href={`/profile/${data}`}>{data}</Link> : ""}</h1>
      <button
        onClick={Logout}
        className="rounded-xl text-center text-white bg-red-600 px-5 py-2"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="rounded-xl text-center text-white bg-blue-600 px-5 py-2"
      >
        User Details
      </button>
    </div>
  );
};

export default ProfilePage;
