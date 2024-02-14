import { Props } from "next/script";
import React, { useRef } from "react";

const ContestCode = ({ textToCopy }: any) => {
  const textRef = useRef<HTMLInputElement | null>(null);

  const copyToClipboard = () => {
    textRef.current!.select();
    document.execCommand("copy");
  };

  return (
    <div className="fixed top-14 right-4 text-left p-5 border-white border border-solid bg-gray-800 text-white p-4 rounded shadow sm:top-8 sm:right-8">
      <input
        type="text"
        value={textToCopy}
        readOnly
        ref={textRef}
        style={{ position: "absolute", left: "-9999px" }}
      />
      <button onClick={copyToClipboard}>Copy Contest Code</button>
    </div>
  );
};

export default ContestCode;
