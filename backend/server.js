// server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Enable CORS for all routes
app.use(cors());

// Map to store users' typing speed for each contest
const activeUsers = new Map();

// Map to store the association between socket ID and contest code
const socketToroom = new Map();

// Check if any speed is zero
function checkAllSpeedSubmitted(key) {
  const userSet = activeUsers.get(key);
  return !Array.from(userSet).some(({ speed }) => speed === -1);
}

// Give highest speed
function findHighestSpeed(key) {
  const userSet = activeUsers.get(key);
  let highestSpeed = 0;
  let winnerName = "";

  userSet.forEach(({ speed, user }) => {
    console.log(user + " " + speed);
    if (speed > highestSpeed) {
      highestSpeed = speed;
      winnerName = user;
    }
  });

  console.log(highestSpeed + " " + winnerName);
  return { highestSpeed, winnerName };
}

// Add user to contestId
function addUserToMap(key, user, speed, socketid, timer) {
  if (!activeUsers.has(key)) {
    activeUsers.set(key, new Set());
  }

  const userSet = activeUsers.get(key);
  const existingUser = Array.from(userSet).find((entry) => entry.user === user);

  if (existingUser) {
    existingUser.speed = speed;
    existingUser.id = socketid;
    existingUser.timer = timer;
  } else {
    userSet.add({ user, speed, socketid, timer });
  }
}
const contestDetails = new Map();
function insertContestDetails(
  contestcode,
  contestTimer,
  contestName,
  totaluser
) {
  contestDetails.set(contestcode, { contestTimer, contestName, totaluser });
}
// Socket.io connection handling
io.on("connection", (socket) => {
  // Create a new contest
  socket.on(
    "new-contest",
    ({ userName, contestName, contestCode, contestTimer }) => {
      console.log("username " + userName);
      console.log("contestName " + contestName);
      console.log("roomId " + contestCode);
      console.log("timer" + contestTimer);
      console.log("newcont socketid" + socket.id);
      socket.join(contestCode);
      socketToroom.set(socket.id, contestCode);

      insertContestDetails(contestCode, contestTimer, contestName, 0);
      addUserToMap(contestCode, userName, -1, socket.id, contestTimer); // Initialize speed as -1

      console.log(activeUsers.get(contestCode));
      socket.emit("contest-created", { contestCode });
    }
  );

  // Join an existing contest
  socket.on("join-contest", ({ userName, contestCode }) => {
    console.log("username " + userName);
    console.log("roomId " + contestCode);

    socket.join(contestCode);
    socketToroom.set(socket.id, contestCode);

    addUserToMap(contestCode, userName, -1, socket.id);

    const details = contestDetails.get(contestCode);
    console.log("Details", details);
    const { contestTimer, contestName } = details;
    console.log(details.contestTimer);
    socket.emit("joined-contest", {
      userName,
      contestName,
      contestCode,
      contestTimer,
    });
  });

  // Collecting typing speed
  socket.on("typing-speed", ({ contestCode, userName, speed }) => {
    console.log("Received typing speed:", userName, contestCode, speed);
    addUserToMap(contestCode, userName, speed.toFixed(2), socket.id, 0);
    console.log("all submitted" + checkAllSpeedSubmitted(contestCode));
    if (checkAllSpeedSubmitted(contestCode)) {
      const { highestSpeed, winnerName } = findHighestSpeed(contestCode);
      console.log("Winner:", winnerName, "with WPM of", highestSpeed);
      console.log("typing socket id" + socket.id);
      console.log("Emitting winner event to room:", contestCode);
      const id = socketToroom.get(socket.id);
      console.log("Emitting winner event to room:", id);
      let allusersData = activeUsers.get(contestCode);
      allusersData = Array.from(allusersData).map(
        ({ user, speed, socketid }) => {
          console.log(user, speed, socketid);
          return { user, speed, socketid };
        }
      );
      console.log(allusersData);

      io.to(contestCode).emit("winner", {
        highestSpeed,
        winnerName,
        allusersData,
      });
    }
  });
  socket.on("start-contest", () => {
    const id = socketToroom.get(socket.id);
    io.to(id).emit("contest-started");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const contestId = socketToroom.get(socket.id);
    socket.leave(contestId);
    socketToroom.delete(socket.id);
    activeUsers.delete(contestId);
    contestDetails.delete(contestId);
    console.log("User disconnected");
  });
});
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
