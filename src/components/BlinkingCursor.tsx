// BlinkingCursor.tsx
import React from "react";
// import "./BlinkingCursor.css";

interface BlinkingCursorProps {
  textLen: number;
}

const BlinkingCursor: React.FC<BlinkingCursorProps> = ({ textLen }) => {
  const cursorStyle = {
    left: `${textLen - 1}ch`, // Adjust the multiplier as needed
  };

  return <span className="cursor" style={cursorStyle}></span>;
};

export default BlinkingCursor;
