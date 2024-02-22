"use-client";
import React from "react";

const UserProfile = ({ params }: any) => {
  return (
    <div>
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Welcome user {params.id}</p>
    </div>
  );
};

export default UserProfile;
