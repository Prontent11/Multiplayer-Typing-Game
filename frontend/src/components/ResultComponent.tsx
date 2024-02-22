import React from "react";

interface UserData {
  username: string;
  speed: number;
}

interface UserTableProps {
  data: UserData[];
}

const ResultComponent: React.FC<UserTableProps> = ({ data }) => {
  const determineWinner = () => {
    const maxSpeed = Math.max(...data.map((user) => user.speed));
    return data.find((user) => user.speed === maxSpeed)?.username || "";
  };

  return (
    <div className="bg-gray-900 lg:flex-row prose prose-md lg:prose-lg xl:prose-xl w-full flex-col min-h-[84vh] flex justify-center items-center">
      <table className="table-auto bg-gray-800 border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="p-3 border-r border-gray-700">Username</th>
            <th className="p-3 border-r border-gray-700">Speed (mph)</th>
            <th className="p-3">Winner</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user: UserData) => (
            <tr key={user.username} className="bg-gray-700 text-white">
              <td className="p-3 border-r border-gray-800">{user.username}</td>
              <td className="p-3 border-r border-gray-800">{user.speed}</td>
              <td className="p-3">
                {user.speed === Math.max(...data.map((u) => u.speed))
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
            <td className="p-3">{determineWinner()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResultComponent;
