// api/tags.js
const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const Tags = await getAllTags();
  res.send({
    Tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const tagName = req.params.tagName;
  // read the tagname from the params
  try {
    const postsByTagName = await getPostsByTagName(tagName);
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
    res.send({ posts: postsByTagName });
  } catch ({ name, message }) {
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;
