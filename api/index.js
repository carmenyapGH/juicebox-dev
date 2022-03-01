// api/index.js
const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./users");

// Before we start attaching our routers
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    // const token = auth.slice(prefix.length);
    const [, token] = auth.split(" ");
    try {
      //decrypting the token back to a user object and grabbing the user id
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  console.log("I am in the api routes");
  console.log(req.user);
  // res.send({ message: 'hello from /api!' })
  next();
});

// Attach routers below here
apiRouter.use("/users", usersRouter);

const postsRouter = require("./posts");
apiRouter.use("/posts", postsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

// all routers attached ABOVE here
apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;

// let token = jwt.sign(userData, process.env.JWT_SECRET);
