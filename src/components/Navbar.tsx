"use client";

import { useState } from "react";
import ContestComponent from "./Contest";
import Link from "next/link";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const handleClick = () => {
    setToggle(!toggle);
  };
  return (
    <nav className="bg-gray-800 p-4 flex  text-white ">
      <div className="container flex items-center gap-4 ">
        <Link href="/game" className="text-2xl font-bold">
          ProntentType
        </Link>
        <Link href="/contest" className="text-xl" onClick={handleClick}>
          Contest
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
