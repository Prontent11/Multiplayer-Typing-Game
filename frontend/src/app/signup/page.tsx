"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { setuid } from "process";
import axios from "axios";
import Link from "next/link";
import { log } from "console";

const SignUpPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/signup", user);
      console.log("SignUp successful", response.data);
      router.push("/login");
    } catch (error) {
      console.log("Signup message error" + error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <h1> {loading ? "Processing" : "Signup"}</h1>
      <label htmlFor="username">username</label>
      <input
        className="p-2 border border-gray-300 text-black"
        type="text"
        id="username"
        value={user.username}
        onChange={(e) => {
          setUser({ ...user, username: e.target.value });
        }}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 text-black"
        type="text"
        id="email"
        value={user.email}
        onChange={(e) => {
          setUser({ ...user, email: e.target.value });
        }}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 text-black"
        type="password"
        id="password"
        value={user.password}
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        placeholder="password"
      />
      <button
        onClick={onSignUp}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none"
      >
        {buttonDisabled ? "No Signup" : "Signup"}
      </button>
      <Link href={"/login"}>Visit Login Page</Link>
    </div>
  );
};

export default SignUpPage;