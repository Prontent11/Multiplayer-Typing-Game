// GameComp.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useContest } from "@/app/context/ContestContext";
import Retry from "@/components/Retry";
import BlinkingCursor from "@/components/BlinkingCursor";
import UsersSpeedDisplay from "@/components/UserDetails";
import ContestCode from "@/components/ContestCode";
import wordString from "@/helpers/getRandomWords";
import UserDetails from "@/components/UserDetails";
// import selectedWords from "@/helpers/getRandomWords";

interface AllUserDetails {
  userDetails: UserDetails[];
}
interface UserDetails {
  user: string;
  speed: number;
  socketid?: string;
}

const wordArray = wordString.toLowerCase().split("");

const GameComp: React.FC = () => {
  const [wordArray, setWordArray] = useState<String[]>();
  const [showContent, setShowContent] = useState(true);
  const { socket, contestData, setContestData } = useContest();
  const { userName, contestCode, contestCreator, contestName, contestTimer } =
    contestData;
  const [text, setText] = useState<string>("");
  const [correctness, setCorrectness] = useState<boolean[]>(
    new Array(500).fill(true)
  );
  const [time, setTime] = useState<number>(30);
  const [timer, setTimer] = useState<number>(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [usersDetails, setUsersDetails] = useState<UserDetails[]>();
  const [showTable, setShowTable] = useState<Boolean>(false);
  const calculateAccuracy = (): number => {
    let correctCount = 0;
    wordArray?.forEach((char, i) => {
      if (i < text.length && text[i] === char) {
        correctCount++;
      }
    });
    return (correctCount / text.length) * 100;
  };

  useEffect(() => {
    setWordArray(wordString.toLowerCase().split(""));
  }, []);
  useEffect(() => {
    const handleWinnerEvent = ({
      highestSpeed,
      winnerName,
      allusersData,
    }: any) => {
      setShowTable(true);
      console.log("alluserData", allusersData);

      setUsersDetails(allusersData);

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
      if (!contestCreator) setShowContent(true);
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
    if (contestCode) {
      setShowContent(false);
      setTime(contestTimer!);
    }
  }, [contestTimer, contestCode]);
  function Delay(delay: number) {
    return new Promise((res) => {
      setTimeout(() => {
        res("delay");
      }, delay);
    });
  }
  async function SubmitSpeed() {
    const elapsedTimeInSeconds = time;
    let inCorrectCount = 0;
    wordArray?.forEach((char, i) => {
      if (i < text.length && text[i] !== char) {
        inCorrectCount++;
      }
    });
    const wordsPerMinute = text.length
      ? parseFloat(
          (
            ((text.split(" ").length - inCorrectCount < 0
              ? 0
              : text.split(" ").length - inCorrectCount) /
              (time - timer)) *
            60
          ).toFixed(2)
        )
      : 0;

    const accuracyValue = calculateAccuracy().toFixed(2);
    setAccuracy(parseFloat(accuracyValue));
    setSpeed(wordsPerMinute);
    if (timer === 0 && contestCode) {
      console.log(userName);
      setSpeed(wordsPerMinute);
      await Delay(2000);
      socket.emit("typing-speed", {
        contestCode,
        userName,
        speed: wordsPerMinute,
      });
    }
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
    setShowTable(false);
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

    if (/^[a-zA-Z,..'"]$/.test(key) || event.keyCode === 32) {
      const newText = text + key;
      if (showContent) setText(newText);

      const newCorrectness = wordArray?.map(
        (char, index) => char === newText[index]
      );
      setCorrectness(newCorrectness!);

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
      const newCorrectness = wordArray!.map(
        (char, index) => char === newText[index]
      );
      setCorrectness(newCorrectness);

      if (startTime === null && !contestCode) {
        setStartTime(Date.now());
        startTimer();
      }
    }
  };
  const handleStartContest = () => {
    socket.emit("start-contest");
    setShowContent(true);
  };
  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [text, startTime]);

  return (
    <div className="sm:min-h-[83.5vh] min-h-[87vh]   bg-gray-900 flex items-center justify-center text-white ">
      <div className="max-w-full p-8  rounded-md shadow-lg">
        {!showContent ? (
          contestCreator && contestCode ? (
            <div>
              <ContestCode textToCopy={contestCode} />
              <button onClick={handleStartContest}>Start Contest</button>
            </div>
          ) : (
            <div>The Contest is yet to start...</div>
          )
        ) : (
          <>
            <div className="text-center flex justify-between items-center">
              <div className="text-white  text-xl mb-4">
                Time remaining: {timer}s | Speed: {speed ? speed : 0} WPM |
                Accuracy: {accuracy || 0}%
              </div>
              {!contestCode && timer ? (
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
              ) : (
                ""
              )}
            </div>
            <div className="mt-8  max-w-prose text-2xl  tracking-widest  text-justify ">
              {timer ? (
                wordArray?.map((char, i) =>
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
                  {showTable && (
                    <UsersSpeedDisplay usersDetails={usersDetails} />
                  )}
                  Time's Up.{" "}
                  <button onClick={RetryButton}>
                    <Retry />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameComp;
