import mongoose from "mongoose";

import { removeVietnameseTones } from "../common/removeVietnameseTones.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { multipleMongooseToObj } from "../common/mongooseToObj.js";
import {
  getCommentsInfo,
  getPostInfo,
  getPostsInfo,
} from "../common/getPostDetail.js";

export const getPosts = (req, res) => {
  const { skip, limit, target } = JSON.parse(req.query.input);
  let query = {};
  if (target) query = { "author.uuid": target };
  Post.find(query)
    .limit(limit * 1)
    .skip(skip * 1 || 0)
    .sort({ createdAt: -1 })
    .then((posts) => multipleMongooseToObj(posts))
    .then((posts) => getPostsInfo(posts))
    .then((posts) => {
      Post.countDocuments(query).then((total) => {
        res.json({
          success: true,
          status: 200,
          data: { posts, total },
          message: "Success",
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

export const getLikedPosts = async (req, res) => {
  const { skip, limit, target } = req.query;
  try {
    const user = await User.findOne({ uuid: target });
    const posts = [];
    const total = user.liked_posts.length;
    if (skip <= total) {
      for (
        let i = skip * 1;
        i < (skip * 1 + limit * 1 >= total ? total : skip * 1 + limit * 1);
        i++
      ) {
        let post = await Post.findOne({ slug: user.liked_posts[i] });
        if (post.title) {
          post = await getPostInfo(post);
          posts.push(post);
        }
      }
      res.json({ success: true, status: 200, data: posts, message: "Sucess" });
    } else {
      res.json({
        success: false,
        status: 400,
        data: null,
        message: "Không có bài viết nào.",
      });
    }
  } catch (error) {
    res.json(404);
  }
};

export const getMorePosts = async (req, res) => {
  const { uuid, slug } = req.query;
  try {
    const posts = await Post.find({ "author.uuid": uuid })
      .limit(5)
      .sort({ createdAt: -1 });
    const response = [...posts.filter((post) => post.slug !== slug)];
    res.json({
      success: true,
      status: 200,
      data: response,
      message: "Success",
    });
  } catch (error) {
    res.status(404);
  }
};

export const getPost = (req, res) => {
  const slug = req.params.slug;
  Post.findOne({ slug: slug })
    .then((post) => getPostInfo(post))
    .then((post) => getCommentsInfo(post))
    .then((post) =>
      res.json({ success: true, status: 200, data: post, message: "Success" })
    )
    .catch((e) => {
      console.log(e);
    });
};

export const createPost = async (req, res) => {
  try {
    const newPost = req.body;
    const post = new Post(newPost);
    let ingreString = "";
    post.ingredients.forEach(
      (ingredient) => (ingreString += `${ingredient.text} `)
    );
    post.key = `${removeVietnameseTones(post.title)} ${removeVietnameseTones(
      ingreString
    )}`;
    await post.save();
    res.json({ success: true, status: 200, data: post, message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

export const modifyPost = async (req, res) => {
  const { slug, newPost } = req.body;
  const { thumbnail, title, ration, time, ingredients, steps, description } =
    newPost;
  try {
    const post = await Post.findOne({ slug: slug });
    post.title = title;
    post.thumbnail = thumbnail;
    post.ration = ration;
    post.time = time;
    post.ingredients = ingredients;
    post.steps = steps;
    post.description = description;
    let ingreString = "";
    ingredients.forEach((ingredient) => (ingreString += `${ingredient.text} `));
    post.key = `${removeVietnameseTones(title)} ${removeVietnameseTones(
      ingreString
    )}`;
    await post.save();
    res.json({
      success: true,
      status: 200,
      data: { slug: post.slug },
      message: "Success",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { slug } = req.query;
    await Post.deleteOne({ slug: slug });
    res.json({
      success: true,
      status: 200,
      data: { slug },
      message: "Success",
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  const { slug } = req.body;
  const { uuid } = req;
  try {
    const post = await Post.findOne({ slug: slug });
    const postIndex = post.likes.findIndex((userId) => userId === uuid);
    if (postIndex < 0) {
      post.likes.push(uuid);
    } else {
      post.likes = [...post.likes.filter((userId) => userId !== uuid)];
    }

    const userLike = await User.findOne({ uuid: uuid });
    const userIndex = userLike.liked_posts.findIndex(
      (postId) => postId === post._id
    );
    if (userIndex < 0) {
      userLike.liked_posts.push(post._id);
    } else {
      userLike.liked_posts = [
        ...userLike.liked_posts.filter((postId) => postId !== post._id),
      ];
    }
    await userLike.save();
    post
      .save()
      .then((post) => getPostInfo(post))
      .then((post) =>
        res.json({ success: true, status: 200, data: post, message: "Success" })
      );
  } catch (error) {
    res.status(404).json({
      success: false,
      data: null,
      status: 400,
      message: "Something went wrong!!!",
    });
  }
};

export const commentPost = async (req, res) => {
  const { slug, text } = req.body;
  const { uuid } = req;
  try {
    const currentPost = await Post.findOne({ slug: slug });
    currentPost.comments.push({
      text,
      author: uuid,
      createdAt: new Date().getTime(),
    });
    currentPost
      .save()
      .then((post) => getPostInfo(post))
      .then((post) => getCommentsInfo(post))
      .then((post) =>
        res.json({
          success: true,
          status: 200,
          data: post,
          message: "Success",
        })
      )
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    res.status(500);
  }
};

export const deleteCommentPost = async (req, res) => {
  const { slug, createdAt } = req.body;
  try {
    const currentPost = await Post.findOne({ slug: slug });
    currentPost.comments = [
      ...currentPost.comments.filter(
        (comment) => comment.createdAt !== createdAt
      ),
    ];
    currentPost
      .save()
      .then((post) => getPostInfo(post))
      .then((post) => getCommentsInfo(post))
      .then((post) =>
        res.json({ success: true, status: 200, data: post, message: "Success" })
      )
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    res.status(500);
  }
};

export const searchPosts = async (req, res) => {
  const { q, skip } = req.query;
  try {
    const query = {
      $text: {
        $search: q,
      },
    };
    Post.find(query)
      .limit(10)
      .skip(skip * 1)
      .then((posts) => getPostsInfo(posts))
      .then((posts) =>
        res.json({
          success: true,
          status: 200,
          data: posts,
          message: "Success",
        })
      );
  } catch (error) {
    console.log(eror);
    res.status(404);
  }
};
