// GameComp.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useContest } from "@/app/context/ContestContext";
import Retry from "@/components/Retry";

const wordString: string =
  "This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else This is test string only used for description and nothing else";
const wordArray = wordString.split("");

const GameComp: React.FC = () => {
  const { socket, contestData, setContestData } = useContest();
  const { userName, contestCode, contestCreator, contestName, contestTimer } =
    contestData;
  const [text, setText] = useState<string>("");
  const [correctness, setCorrectness] = useState<boolean[]>(
    new Array(wordArray.length).fill(true)
  );
  const [time, setTime] = useState<number>(30);
  const [timer, setTimer] = useState<number>(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [cursorIndex, setCursorIndex] = useState(0);

  const calculateAccuracy = (): number => {
    let correctCount = 0;
    wordArray.forEach((char, i) => {
      if (i < text.length && text[i] === char) {
        correctCount++;
      }
    });
    return (correctCount / text.length) * 100;
  };

  useEffect(() => {
    const handleWinnerEvent = ({ highestSpeed, winnerName }: any) => {
      console.log("Received winner event:", { highestSpeed, winnerName });
      setContestData({
        contestCode: "",
        userName: "",
        contestName: "",
        contestTimer: 0,
        contestCreator: false,
      });
      alert(
        winnerName + " is the winner with speed of " + highestSpeed + " WPM"
      );
    };

    // Register the event listener

    socket.on("winner", handleWinnerEvent);
    socket.on("contest-started", () => {
      setStartTime(Date.now());
      startTimer();
    });
    // Clean up the event listener when the component unmounts
    return () => {
      console.log("Cleaning up event listener");
      socket.off("winner", handleWinnerEvent);
      socket.off("contest-started");
      // Optionally disconnect the socket when the component unmounts
    };
  }, [socket]);

  useEffect(() => {
    SubmitSpeed();
  }, [timer]);

  useEffect(() => {
    if (contestCode) setTime(contestTimer!);
  }, [contestTimer, contestCode]);

  function SubmitSpeed() {
    const elapsedTimeInSeconds = time;
    const wordsPerMinute = text.length
      ? (text.split(" ").length / elapsedTimeInSeconds) * 60
      : 0;

    const accuracyValue = calculateAccuracy().toFixed(2);

    if (timer === 0 && contestCode) {
      console.log(userName);
      setTimeout(() => {
        socket.emit("typing-speed", { contestCode, userName, speed });
      }, 2000);
    }

    setSpeed(wordsPerMinute);
    setAccuracy(parseFloat(accuracyValue));
  }

  useEffect(() => {
    setTimer(time);
    setSpeed(0);
    setAccuracy(0);
    setText("");
    setCursorIndex(0);
  }, [time]);

  const RetryButton = () => {
    setStartTime(null);
    const newTime = time === 30 ? 15 : 30;
    setTime(newTime);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    if (/^[a-zA-Z]$/.test(key) || event.keyCode === 32) {
      const newText = text + key;
      setText(newText);

      const newCorrectness = wordArray.map(
        (char, index) => char === newText[index]
      );
      setCorrectness(newCorrectness);

      if (startTime === null && !contestCode) {
        setStartTime(Date.now());
        startTimer();
      }
      setCursorIndex((prevIndex) => prevIndex + 1);
    }

    if (key === "Backspace") {
      const newText = text.slice(0, -1);
      setText(newText);
      setCursorIndex((prevIndex) => Math.max(0, prevIndex - 1));
      const newCorrectness = wordArray.map(
        (char, index) => char === newText[index]
      );
      setCorrectness(newCorrectness);

      if (startTime === null) {
        setStartTime(Date.now());
        startTimer();
      }
    }
  };
  const handleStartContest = () => {
    socket.emit("start-contest");
  };
  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [startTime]);

  return (
    <div className="min-h-[84vh] bg-gray-900 flex items-center justify-center text-white ">
      <div className="max-w-full p-8  rounded-md shadow-lg">
        <div className="text-center flex justify-between items-center">
          <div className="text-white  text-xl mb-4">
            Time remaining: {timer}s | Speed: {speed ? speed.toFixed(2) : 0} WPM
            | Accuracy: {accuracy || 0}%
          </div>
          {!contestCode && (
            <div className="mb-4">
              <label className="text-white mr-2">Select Timer:</label>
              <select
                className="bg-gray-700 text-white p-2 rounded-md"
                value={time}
                onChange={(e) => {
                  setTime(parseInt(e.target.value));
                  setContestData({
                    ...contestData!,
                    contestTimer: parseInt(e.target.value),
                  });
                }}
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            </div>
          )}
          {contestCreator && (
            <div>
              <button onClick={handleStartContest}>Start Contest</button>
            </div>
          )}
        </div>
        <div className="mt-8  max-w-prose text-2xl  text-justify ">
          {timer ? (
            wordArray.map((char, i) =>
              i < text.length + 300 ? (
                <span
                  key={i}
                  className={
                    i < text.length && timer > 0
                      ? char === text[i]
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-gray-500"
                  }
                >
                  {char}
                </span>
              ) : (
                ""
              )
            )
          ) : (
            <div className="text-center flex flex-col items-center gap-3">
              Time's Up.{" "}
              <button onClick={RetryButton}>
                <Retry />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameComp;
