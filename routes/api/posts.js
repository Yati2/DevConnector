const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { response } = require("express");

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post(
  "/",
  [auth, [check("text", "Text is requried").not().isEmpty()]],

  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty) res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        name: user.name,
        text: req.body.text,
        avatar: user.avatar,
        user: req.user.id,
      });

      await newPost.save();
      res.json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/posts/:post_id
//@desc     Get posts by post ID
//@access   Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    console.log(req.params.post_id);
    if (!post) return res.status(404).send("Post not found!");
    return res.json(post);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId")
      return res.status(404).send("Post not found");
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/posts/:post_id
//@desc     Delete posts by post ID
//@access   Private
router.delete("/:post_id", auth, async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  console.log(post.user + "__VS__" + req.user.id);
  if (post.user != req.user.id) {
    return res.status(401).send("User is not authorised");
  }

  await post.remove();
  res.json({ msg: "Post Removed" });
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const liked =
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0;

    if (liked) return res.status(400).send("Post already liked");
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.status(200).json({ msg: "Success!", body: post.likes });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});
//@route    PUT api/posts/unlike/:id
//@desc     unlike a post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    const liked =
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0;
    console.log(
      post.likes.filter((like) => like.user.toString() == req.user.id)
    );
    console.log(liked);

    if (!liked) return res.status(400).send("Post has not been liked");

    //Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    //Remove the user from likes
    await post.likes.splice(removeIndex, 1);
    console.log(post);
    await post.save();
    return res.json({ body: post.likes, msg: "Sucessful!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

//@route    PUT api/posts/comments/:id
//@desc     Create a post
//@access   Private
router.put(
  "/comments/:id",
  [auth, [check("text", "Text is requried").not().isEmpty()]],

  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty) res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      await post.comments.unshift(newComment);
      await post.save();
      res.json({ body: post.comments, msg: "Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/posts/comments/:id
//@desc     Post a comment
//@access   Private
router.put(
  "/comments/:id",
  [auth, [check("text", "Text is requried").not().isEmpty()]],

  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty) res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      await post.comments.unshift(newComment);
      await post.save();
      res.json({ body: post.comments, msg: "Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Delete api/posts/comments/:id/:comment_id
//@desc     Delete a comment
//@access   Private
router.delete(
  "/comments/:id/:comment_id",
  auth,

  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comment = post.comments.find(
        (com) => com.id == req.params.comment_id
      );

      console.log("213 " + comment);
      console.log("214 " + req.user.id);

      if (!comment) res.status(404).json({ msg: "Comment not found" });

      if (comment.user.toString() !== req.user.id)
        res.status(401).json({ msg: "User is not authorized" });

      const removeIndex = post.comments
        .map((comment) => comment.user.toString())
        .indexOf(req.user.id);
      post.comments.splice(removeIndex, 1);
      await post.save();
      res.json({
        body: post.comments,
        msg: "Successfully deleted the comment",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
