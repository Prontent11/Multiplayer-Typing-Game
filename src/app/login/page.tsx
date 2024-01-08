"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { setuid } from "process";
import axios from "axios";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/login", user);
      console.log("Login successful", response.data);
      router.push("/profile");
    } catch (error) {
      console.log("Login failed " + error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1> {loading ? "Processing" : "Login"}</h1>

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
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none"
      >
        {buttonDisabled ? "No Login" : "Login"}
      </button>
      <Link href={"/signup"}>Visit Signup Page</Link>
    </div>
  );
};

export default LoginPage;
