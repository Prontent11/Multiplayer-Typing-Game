// ContestComponent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContest } from "@/app/context/ContestContext";
import { v4 as uuidv4 } from "uuid";

interface CreateContest {
  name: string;
  contestName: string;
  timer: number;
}

interface JoinContest {
  name: string;
  contestId: string;
}

const generateRandomRoomId = () => {
  return uuidv4();
};

const ContestComponent: React.FC = () => {
  const router = useRouter();
  const [createContest, setCreateContest] = useState<CreateContest>({
    name: "",
    contestName: "",
    timer: 30,
  });
  const [joinContest, setJoinContest] = useState<JoinContest>({
    name: "",
    contestId: "",
  });

  const { setContestData, socket, contestData } = useContest();

  const handleCreateContest = (e: any) => {
    e.preventDefault();
    const contestCode = generateRandomRoomId();
    setContestData({
      userName: createContest.name,
      contestName: createContest.contestName,
      contestCode,
      contestTimer: createContest.timer,
      contestCreator: true,
    });

    socket.emit("new-contest", {
      userName: createContest.name,
      contestName: createContest.contestName,
      contestCode,
      contestTimer: createContest.timer,
    });

    setCreateContest({
      name: "",
      contestName: "",
      timer: 0,
    });
    router.push("/game");
  };

  useEffect(() => {
    socket.on("contest-created", ({ contestCode }) => {
      console.log("contest created" + contestCode);
    });

    socket.on(
      "joined-contest",
      ({ contestName, contestCode, contestTimer, userName }) => {
        console.log(
          "joined contest" +
            contestCode +
            " " +
            contestName +
            " " +
            contestTimer
        );
        setContestData({
          userName,
          contestTimer,
          contestName,
          contestCode,
          contestCreator: false,
        });
        setJoinContest({
          name: "",
          contestId: "",
        });
      }
    );

    return () => {
      socket.off("joined-contest");
      socket.off("contest-created");
    };
  }, [socket]);

  const handleJoinContest = (e: any) => {
    e.preventDefault();
    console.log("hello from joined contest");
    const userName = joinContest?.name;
    const contestCode = joinContest?.contestId;
    console.log("contestcode", contestCode);

    socket.emit("join-contest", {
      userName,
      contestCode: joinContest?.contestId,
    });
    router.push("/game");
  };

  return (
    <div
      className="bg-gray-900 
    lg:flex-row
    prose prose-md lg:prose-lg xl:prose-xl
   w-full
    flex-col min-h-[84vh] flex justify-center items-center"
    >
      {/* Create contest */}
      <form
        onSubmit={handleCreateContest}
        className="contest-section bg-gray-800 mb-4 p-8 mt-10 lg:mt-0 lg:mb-0 rounded-md shadow-lg text-white"
      >
        <h2 className="text-3xl font-bold mb-6">Create Contest</h2>
        <div className="input-group mb-4">
          <label htmlFor="username" className="text-white block mb-2">
            Name
          </label>
          <input
            required
            value={createContest.name}
            onChange={(e) =>
              setCreateContest({ ...createContest, name: e.target!.value })
            }
            type="text"
            id="username"
            className="text-black input-field py-2 px-2 rounded-md text-xl"
            placeholder="Enter your name"
          />
        </div>
        <div className="input-group mb-4">
          <label htmlFor="contestName" className="text-white block mb-2">
            Contest Name
          </label>
          <input
            required
            type="text"
            value={createContest.contestName}
            onChange={(e) =>
              setCreateContest({
                ...createContest,
                contestName: e.target.value,
              })
            }
            id="contestName"
            className="text-black input-field py-2 px-2 rounded-md text-xl"
            placeholder="Enter contest name"
          />
        </div>
        <div className="input-group mb-4">
          <label htmlFor="timer" className="text-white block mb-2">
            Timer
          </label>
          <select
            value={createContest.timer}
            onChange={(e) =>
              setCreateContest({
                ...createContest,
                timer: parseInt(e.target.value),
              })
            }
            id="timer"
            className="select-field text-black px-2 py-2 rounded-lg"
          >
            <option value="15">15s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
          </select>
        </div>
        <button
          className="button bg-blue-500 text-white px-6 py-2 rounded-md"
          type="submit"
        >
          Create Contest
        </button>
      </form>
      {/* Join contest */}
      <form
        onSubmit={handleJoinContest}
        className="contest-section bg-gray-800 p-8 rounded-md shadow-lg text-white lg:ml-8 lg:mb-0 mb-10"
      >
        <h2 className="text-3xl font-bold mb-6">Join Contest</h2>
        <div className="input-group mb-4">
          <label htmlFor="username" className="text-white block mb-2">
            Name
          </label>
          <input
            required
            type="text"
            value={joinContest?.name}
            onChange={(e) =>
              setJoinContest({ ...joinContest, name: e.target.value })
            }
            id="username"
            className="text-black input-field py-2 px-2 rounded-md text-xl"
            placeholder="Enter your name"
          />
        </div>
        <div className="input-group mb-4">
          <label htmlFor="contestCode" className="text-white block mb-2">
            Contest Code
          </label>
          <input
            required
            type="text"
            value={joinContest?.contestId}
            onChange={(e) =>
              setJoinContest({ ...joinContest, contestId: e.target.value })
            }
            id="contestCode"
            className="text-black input-field py-2 px-2 rounded-md text-xl"
            placeholder="Enter contest code"
          />
        </div>
        <button
          className="button bg-green-500 text-white px-6 py-2 rounded-md"
          type="submit"
        >
          Join Contest
        </button>
      </form>
    </div>
  );
};

export default ContestComponent;
