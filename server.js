// Chat server
import net from "net";

const PORT = 8080;

const server = net.createServer((socket) => {});

// An array of client sockets
const clients = [];

// Making use of connection event, we get a socket object in the callback
server.on("connection", (socket) => {
  console.log("A new connection made to the server");
  // Assigning a client id
  const clientId = clients.length + 1;

  clients.map((client) => {
    // Broadcasting a message to everyone when someone joins the chat
    client.socket.write(`User ${clientId} joined!`);
  });

  // pushing every client socket with id to the array
  clients.push({ id: clientId, socket });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    // Write the message from each client to the socket of each single client. Then in all clients we can read the message
    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });

    socket.on("end", () => {
      // Remove the client that has disconnected
      const index = clients.findIndex((client) => client.id === clientId);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });

    // Handle socket error (e.g., if the client unexpectedly closes the connection)
    socket.on("error", (err) => {
      console.error(`Error with client ${clientId}:`, err);
      // Remove client from the array if there's an error
      const index = clients.findIndex((client) => client.id === clientId);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });

    // Handle socket close (both error and normal disconnect)
    socket.on("close", () => {
      console.log(`Client ${clientId} disconnected`);
      // Clean up after client disconnect
      const index = clients.findIndex((client) => client.id === clientId);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      // map over clients
      clients.map((client) => {
        // Broadcasting a message to everyone when someone leaves the chat
        client.socket.write(`User ${clientId} disconnected!`);
      });
    });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Server running on:
    http://${server.address().address}:${server.address().port}`
  );
});
