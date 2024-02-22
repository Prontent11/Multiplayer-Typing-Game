import { set } from "mongoose";
import React, { useEffect, useState } from "react";

interface UserData {
  user: string;
  speed: number;
  socket?: string;
}

interface UserTableProps {
  usersDetails: UserData[] | undefined;
}

const UserDetails: React.FC<UserTableProps> = ({ usersDetails }) => {
  // const data = usersDetails;

  const [winner, setWinner] = useState<string | null>("");
  console.log(usersDetails);
  useEffect(() => {
    let username = "";
    let highestSpeed = 0;
    if (usersDetails?.length) {
      for (let i = 0; i < usersDetails!.length; i++) {
        if (usersDetails![i].speed > highestSpeed) {
          username = usersDetails![i].user;
          highestSpeed = usersDetails![i].speed;
        }
      }
    }
    setWinner(username);
    // determineWinner();
  }, [usersDetails]);
  return (
    <div className="bg-gray-900 lg:flex-row prose prose-md lg:prose-lg xl:prose-xl w-full flex-col mb-5 flex justify-center items-center">
      <table className="table-auto bg-gray-800 border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="p-3 border-r border-gray-700">Username</th>
            <th className="p-3 border-r border-gray-700">Speed (wpm)</th>
            <th className="p-3">Winner</th>
          </tr>
        </thead>
        <tbody>
          {usersDetails?.map((user: UserData) => (
            <tr key={user.user} className="bg-gray-700 text-white">
              <td className="p-3 border-r border-gray-800">{user.user}</td>
              <td className="p-3 border-r border-gray-800">{user.speed}</td>
              <td className="p-3">
                {user.speed === Math.max(...usersDetails.map((u) => u.speed))
                  ? "Winner"
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-900 text-white">
            <td colSpan={2} className="p-3 border-r border-gray-700">
              Winner:
            </td>
            <td className="p-3">{winner}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default UserDetails;
