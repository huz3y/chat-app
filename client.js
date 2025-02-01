// Anyone who can connect to the server
import net from "net";
import readline from "readline/promises";

// creating and interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Clears the current line
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

// Moves the cursor to a spceific position
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

// variable to store for id
let id;

// prompts question, get the message, write the message while keeping UI clean
const ask = async () => {
  // using rl.question to get a message from user to node process
  const message = await rl.question("Enter a message > ");
  // move the cursor one line up
  await moveCursor(0, -1);
  // clear the cursor line before writing the message
  await clearLine(0);
  // writing that message and we will get that message in the server
  socket.write(`${id}-message-${message}`);
};

const socket = net.createConnection(
  { host: "127.0.0.1", port: 8080 },
  async () => {
    // connection made
    console.log("connected to server");
    // prompt
    await ask();
  }
);

// Reading the message we get from the clients through server
socket.on("data", async (data) => {
  // Go to next line
  console.log();
  // move the cursor one line up
  await moveCursor(0, -1);
  // clear the cursor line before writing the message
  await clearLine(0);
  // check if data is id
  if (data.toString("utf-8").substring(0, 2) === "id") {
    // We are getting the id:
    // assigning the extracted id
    id = data.toString("utf-8").substring(3); // grab everything from third index to end
    console.log(`Your id is ${id}\n`);
  } else {
    // We are getting a message
    // Display the message
    console.log(data.toString("utf-8"));
  }
  // prompt
  await ask();
});

socket.on("error", (err) => {
  console.error("An error occured:", err);
});

socket.on("end", () => {
  console.log("Connection has ended");
});

socket.on("close", (hadError) => {
  if (hadError) {
    console.error("Connection ended because of an error!");
  } else {
    console.log("Connection normally ended");
  }
});
