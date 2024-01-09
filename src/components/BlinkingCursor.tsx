// BlinkingCursor.tsx
import React from "react";
// import "./BlinkingCursor.css";

interface BlinkingCursorProps {
  cursorIndex: number;
}

const BlinkingCursor: React.FC<BlinkingCursorProps> = ({ cursorIndex }) => {
  const cursorStyle = {
    left: `${cursorIndex * 16}px`, // Adjust the multiplier as needed
  };

  return <span className="cursor" style={cursorStyle}></span>;
};

export default BlinkingCursor;
