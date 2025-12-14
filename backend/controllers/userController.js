import User from "../models/User.js";
import Post from "../models/Post.js";

export const toggleFollow = async (req, res) => {
  const currentUser = await User.findById(req.user);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) return res.status(404).json({ msg: "User not found" });

  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    currentUser.following.pull(targetUser._id);
    targetUser.followers.pull(currentUser._id);
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({ following: !isFollowing });
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers following", "username profilePic name");

  const posts = await Post.find({ user: user._id });

  res.json({ user, posts });
};

export const getSuggestedUsers = async (req, res) => {
  const loggedInUserId = req.user._id;

  try {
    const loggedInUser = await User.findById(loggedInUserId).select(
      "following"
    );

    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found." });
    }

    const usersToExclude = [loggedInUserId, ...loggedInUser.following];

    const suggestedUsers = await User.find({
      _id: { $nin: usersToExclude },
    })
      .select("_id username name profilePic")
      .limit(5);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching suggestions." });
  }
};

export const updateProfilePic = async (req, res) => {
  const userId = req.user._id;
  const { imageUrl } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl || "" },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile picture updated successfully.",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res
      .status(500)
      .json({ message: "Server error while updating profile picture." });
  }
};
