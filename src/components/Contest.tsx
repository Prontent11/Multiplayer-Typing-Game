import { useContest } from "@/app/context/ContestContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
interface createContest {
  name: string;
  contestName: string;
  timer: number;
}
interface joinContest {
  name: string;
  contestId: string;
}
const generateRandomRoomId = () => {
  return uuidv4();
};

const ContestComponent = ({ onClose }: any) => {
  const router = useRouter();
  const [createContest, setCreateContest] = useState<createContest | null>();
  const [joinContest, setJoinContest] = useState<joinContest | null>();
  const { contestId, setContest, setUserName, socket } = useContest();

  const handleCreateContest = () => {
    const contestCode = generateRandomRoomId();
    setContest(contestCode);
    setUserName(createContest!.name);
    const userName = createContest!.name;
    const newContestName = createContest?.contestName;
    console.log(userName + " " + newContestName + " " + contestCode);
    socket.emit("new-contest", { userName, newContestName, contestCode });
    setCreateContest({
      name: "",
      contestName: "",
      timer: 0,
    });
    router.push("/game");
  };

  const handleJoinContest = () => {
    const userName = createContest?.name;
    const joinContestCode = joinContest?.contestId;
    socket.emit("join-contest", { userName, joinContestCode });
    setContest(joinContestCode!);
    setUserName(userName!);
    setJoinContest({
      name: "",
      contestId: "",
    });
    router.push("/game");
  };
  return (
    <div className="bg-gray-900 min-h-[84vh] flex justify-center items-center">
      {/* Create contest */}
      <div className="contest-section bg-gray-800 p-8 rounded-md shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-6">Create Contest</h2>
        <div className="input-group mb-4">
          <label htmlFor="username" className="text-white block mb-2">
            Name
          </label>
          <input
            value={createContest?.name}
            onChange={(e) =>
              setCreateContest({ ...createContest!, name: e.target!.value })
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
            type="text"
            value={createContest?.contestName}
            onChange={(e) =>
              setCreateContest({
                ...createContest!,
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
            value={createContest?.timer}
            onChange={(e) =>
              setCreateContest({
                ...createContest!,
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
          onClick={handleCreateContest}
        >
          Create Contest
        </button>
      </div>
      {/* Join contest */}
      <div className="contest-section bg-gray-800 p-8 rounded-md shadow-lg text-white ml-8">
        <h2 className="text-3xl font-bold mb-6">Join Contest</h2>
        <div className="input-group mb-4">
          <label htmlFor="username" className="text-white block mb-2">
            Name
          </label>
          <input
            type="text"
            value={joinContest?.name}
            onChange={(e) =>
              setJoinContest({ ...joinContest!, name: e.target.value })
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
            type="text"
            value={joinContest?.contestId}
            onChange={(e) =>
              setJoinContest({ ...joinContest!, contestId: e.target.value })
            }
            id="contestCode"
            className="text-black input-field py-2 px-2 rounded-md text-xl"
            placeholder="Enter contest code"
          />
        </div>
        <button
          className="button bg-green-500 text-white px-6 py-2 rounded-md"
          onClick={handleJoinContest}
        >
          Join Contest
        </button>
      </div>
    </div>
  );
};

export default ContestComponent;
