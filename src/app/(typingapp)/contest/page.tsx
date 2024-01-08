"use client";
import ContestComponent from "@/components/Contest";
import React, { useState } from "react";

const ContestPage = () => {
  const [toggle, setToogle] = useState(true);
  const onClose = () => setToogle(!toggle);
  return <div>{toggle ? <ContestComponent onClose={onClose} /> : ""}</div>;
};

export default ContestPage;
