"use client";
import ResultComponent from "@/components/ResultComponent";
import React from "react";

const Result = () => {
  return (
    <div>
      <ResultComponent
        data={[
          { username: "User1", speed: 60 },
          { username: "User2", speed: 45 },
          { username: "User3", speed: 55 },
          { username: "User4", speed: 70 },
          { username: "User5", speed: 50 },
        ]}
      />
    </div>
  );
};

export default Result;
