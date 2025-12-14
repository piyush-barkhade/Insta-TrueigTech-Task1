import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  const post = await Post.create({ user: req.user, ...req.body });
  res.json(post);
};

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    } else {
      await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: userId },
        },
        { new: true }
      );
    }

    res.status(200).json({ message: "Like toggled successfully" });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const feed = async (req, res) => {
  const user = await User.findById(req.user);
  const posts = await Post.find({ user: { $in: user.following } })
    .populate("user", "username")
    .populate("comments.user", "username");
  res.json(posts);
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user,
    text: req.body.text,
  });

  await post.save();

  const updatedPost = await Post.findById(post._id).populate(
    "comments.user",
    "username"
  );

  res.json(updatedPost);
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic")
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).select("comments").populate({
      path: "comments.user",
      select: "username profilePic",
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("user", "username profilePic")
      .populate("likes", "username")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({ message: "Server error while fetching post" });
  }
};
