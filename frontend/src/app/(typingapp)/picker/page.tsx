"use client";
import User from "@/models/userModel";
import React, { useEffect, useState } from "react";

type UserList = {
  name: string;
  email?: string;
};

const Users: UserList[] = [
  { name: "yash", email: "yash@gmail.com" },
  { name: "yash1", email: "yash1@gmail.com" },
  { name: "yash2", email: "yash2@gmail.com" },
  { name: "yash3", email: "yash3@gmail.com" },
  { name: "yash4", email: "yash4@gmail.com" },
  { name: "yash5", email: "yash5@gmail.com" },
  { name: "yash6", email: "yash6@gmail.com" },
];

const UserPicker = () => {
  const [userList, setUserList] = useState<UserList[]>(Users);
  const [displayList, setDisplayList] = useState<UserList[] | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [userName, setUserName] = useState<UserList[]>();
  const removeUser = (email: string | undefined) => {
    const newDisplayList = displayList?.filter((user) => {
      if (user.email !== email) {
        return user;
      }
    });
    setDisplayList(newDisplayList!);
  };
  const addUser = (email: string | undefined) => {
    const displayUser = userList.find((user) => {
      return user.email == email;
    });

    console.log("display:user", displayUser);
    if (displayUser)
      setDisplayList((prevDisplayList) =>
        prevDisplayList ? [...prevDisplayList, displayUser] : [displayUser]
      );
  };
  useEffect(() => {
    console.log("displayList", displayList);
  }, [displayList]);
  useEffect(() => {
    console.log("enterend inputext change");
    const newUserNames: UserList[] = userList.filter((user) => {
      return user.name.startsWith(inputText!);
    });
    console.log("newusernames", newUserNames);
    setUserName(newUserNames);
  }, [inputText]);
  return (
    <div className="flex h-screen w-full justify-center item-center text-white bg-black">
      <div className="grid grid-cols-3">
        {/* Display List */}
        <div className="col-span-2 space-y-2">
          {displayList?.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 p-2 rounded-md"
            >
              <div>{user.name}</div>
              <button
                onClick={() => removeUser(user.email)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* User Search Input and Suggestions */}
        <div className="flex flex-col w-[200px] space-y-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Search users"
            className="border-black border-1 text-black p-2 rounded-md"
          />

          {/* User Suggestions */}
          {userName?.map((user, index) => {
            if (!displayList?.includes(user)) {
              return (
                <div
                  key={user.email}
                  onClick={() => addUser(user.email)}
                  className="p-2 rounded-md cursor-pointer hover:bg-gray-800"
                >
                  {user.name}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default UserPicker;
