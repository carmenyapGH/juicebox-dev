const { client } = require("./db");
client.connect();

// const { secret } = require("./pwd");
// console.log("My secret --", secret);

const dotenv = require("dotenv");
dotenv.config();

// Building & Starting a Web Server
// npm install express
// const PORT = 3000;
const PORT = process.env.PORT;
const express = require("express");
const server = express();

//start the server
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);
