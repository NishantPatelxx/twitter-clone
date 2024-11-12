const Notification = require("../model/notificationModel");
const Post = require("../model/postModel");
const cloudinary = require("cloudinary").v2;
const User = require("../model/userModel");

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { image } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    if (!text || !image) {
      return res.status(401).json({
        message: "Image and text both are required",
      });
    }
    if (image) {
      const uplosdResponse = await cloudinary.uploader.upload(image);
      image = uplosdResponse.secure_url;
    }
    const newPost = new Post({
      users: userId,
      text,
      image,
    });
    await newPost.save();
    return res.status(200).json({
      message: "Post created succesfully",
      post: newPost,
    });
  } catch (error) {
    console.log("error in createPost is", error);
    return res.status(500).json({
      message: "internal Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not Found",
      });
    }
    if (post.users._id !== req.user._id) {
      return res.status(401).json({
        message: "You are not authorized to delete this post",
      });
    }
    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Post deleted Successfully",
    });
  } catch (error) {
    console.log("Error in deletePost is", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) {
      return res.status(401).json({
        message: "Text feild is required",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "No post found",
      });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    return res.status(200).json({
      message: "commet done successfully",
      comment: comment,
    });
  } catch (error) {
    console.log("Error in commentOnPost is", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const LikeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById({ postId });
    if (!post) {
      return res.status(404).json({
        message: "No post found",
      });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      return res.status(200).json({
        updatedLikes,
      });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const newNotification = new Notification({
        type: "like",
        to: post.users,
        from: userId,
      });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost is", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ crestedAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (post.length === 0) {
      return (
        res.status(200),
        json({
          posts: [],
        })
      );
    }
    return res.status(200).json({
      message: "posts fetched",
      data: post,
    });
  } catch (error) {
    console.log("error in getAllPost is", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const likedPost = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json({
      data: likedPost,
    });
  } catch (error) {
    console.log("error in getLikedPost is", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json({
      data: feedPosts,
    });
  } catch (error) {
    console.log("error in getFollowingPost is", error);
    return res.status(500).json({
      message: "internal Server Error",
    });
  }
};
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const posts = await Post.find({ user: username })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json({
      data: posts,
    });
  } catch (error) {
    console.log("error in getUserPosts", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPost,
  deletePost,
  commentOnPost,
  LikeUnlikePost,
  getAllPost,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
