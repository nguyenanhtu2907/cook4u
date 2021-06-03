import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Post from "../models/Post.js";
import Report from "../models/Report.js";
import { getPostInfo } from "../common/getPostDetail.js";

export const signup = async (req, res) => {
  const newUser = req.body;
  try {
    const existingUser = await User.findOne({ username: newUser.username });
    if (existingUser) {
      res.json({
        succes: false,
        message: `Username: ${newUser.username} has been already existed!`,
      });
    }

    newUser.uuid = new Date().getTime();
    newUser.password_hash = bcrypt.hashSync(req.body.password, 12);

    const createdUser = new User(newUser);
    await createdUser.save();

    res.json({
      success: true,
      message: `Sign Up Successfully: ${createdUser.username}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!!!",
    });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      res.json({
        success: false,
        message: "Username or password is incorrect !!!",
      });
    }

    const isCorrectPassword = bcrypt.compareSync(
      password,
      existingUser.password_hash
    );
    if (!isCorrectPassword) {
      res.json({
        success: false,
        message: "Username or password is incorrect !!!",
      });
    }

    const token = jwt.sign(
      { username: existingUser.username, uuid: existingUser.uuid },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token: token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!" });
  }
};

export const signinGoogle = async (req, res) => {
  const newUser = {
    username: req.body.email,
    name: `${req.body.familyName} ${req.body.givenName}`,
    uuid: req.body.googleId,
    imageUrl: req.body.imageUrl,
  };

  try {
    let existingUser = await User.findOne({ uuid: newUser.uuid });
    if (existingUser) {
      existingUser.name = `${req.body.familyName} ${req.body.givenName}`;
      existingUser.imageUrl = req.body.imageUrl;
      await existingUser.save();
      res.status(200).json(existingUser);
      return;
    }

    const createdUser = new User(newUser);
    await createdUser.save();

    res.status(200).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!!!",
    });
  }
};

export const following = async (req, res) => {
  const { target } = req.body;
  const { uuid } = req;
  if (target === uuid) {
    res.json({ message: "You can't follow yourself ." });
    return;
  }
  if (!target) return;

  try {
    const currentUser = await User.findOne({ uuid: uuid });
    const followingIndex = currentUser.following.findIndex(
      (id) => id === target
    );
    const targetUser = await User.findOne({ uuid: target });
    if (followingIndex === -1) {
      currentUser.following.push(target);
      targetUser.followed.push(uuid);
    } else {
      currentUser.following = [
        ...currentUser.following.filter((id) => id !== target),
      ];
      targetUser.followed = [
        ...targetUser.followed.filter((id) => id !== uuid),
      ];
    }

    await targetUser.save();

    await currentUser.save();
    const number = await Post.countDocuments({ author: target });
    targetUser.posts = number;
    res.json({ currentUser: currentUser, targetUser: targetUser });
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ uuid: uuid });
    const number = await Post.countDocuments({ "author.uuid": uuid });
    user.posts = number;

    let likedPosts = [];
    const postIds = user.liked_posts.slice(0, 10);
    for (var postId of postIds) {
      const post = await Post.findOne({ _id: postId });
      const detailPost = await getPostInfo(post);
      likedPosts.push(detailPost);
    }
    user.likedPosts = likedPosts;

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};

export const updateUser = async (req, res) => {
  const { uuid } = req;
  const user = await User.findOne({ uuid: uuid });
  if (!user) res.status(404);
  try {
    const { setting, formValues } = req.body;
    if (setting === "information") {
      user.name = formValues.name;
      user.gender = formValues.gender;
      user.phone = formValues.phone;
      user.imageUrl = formValues.imageUrl;
      user.description = formValues.description;
      await user.save();
      res.json({
        newUser: user,
        message: {
          success: true,
          message: `Cập nhật thông tin thành công`,
        },
      });
    } else if (setting === "password") {
      const isCorrectPassword = bcrypt.compareSync(
        formValues.old_password,
        user.password_hash
      );
      if (isCorrectPassword) {
        user.password_hash = bcrypt.hashSync(formValues.password, 12);
        await user.save();
        res.json({
          message: {
            success: true,
            message: "Đổi mật khẩu thành công",
          },
        });
      } else {
        res.json({
          message: {
            success: false,
            message: "Mật khẩu cũ không đúng",
          },
        });
      }
    } else {
      res.status(404);
    }
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};
export const getFollowUsers = async (req, res) => {
  try {
    const { type, skip, uuid } = req.query;
    const user = await User.findOne({ uuid: uuid });
    const users = [];
    if (type === "followed") {
      const total = user.followed.length;
      for (
        let i = skip * 1;
        i < (skip * 1 + 20 >= total ? total : skip * 1 + 20);
        i++
      ) {
        const info = await getInfoUserByUuid(user.followed[i]);
        users.push(info);
      }
      res.json(users);
    } else {
      const total = user.following.length;
      for (
        let i = skip * 1;
        i < (skip * 1 + 20 >= total ? total : skip * 1 + 20);
        i++
      ) {
        const info = await getInfoUserByUuid(user.following[i]);
        users.push(info);
      }
      res.json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};

export const report = async (req, res) => {
  try {
    const newReport = req.body;
    newReport.userReport = req.uuid;
    const existReport = await Report.findOne({ target: newReport.target });
    if (!existReport || existReport.type !== newReport.type) {
      const report = new Report(newReport);
      await report.save();
    }
    res.json({
      message:
        "Báo cáo thành công. Nếu đối tượng có vấn đề, Admin sẽ thực thi công lý!!!",
    });
  } catch (error) {
    console.log(error);
    res.json(404);
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    const response = [];
    for (let i = 0; i < reports.length; i++) {
      const user = await User.findOne({ uuid: reports[i].userReport });
      response.push({
        uuid: reports[i].uuid,
        type: reports[i].type,
        target: reports[i].target,
        userReport: {
          uuid: user.uuid,
          name: user.name,
          imageUrl: user.imageUrl,
        },
        createdAt: reports[i].createdAt,
      });
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};

export const removeReport = async (req, res) => {
  try {
    const { uuid } = req.query;
    await Report.deleteOne({ uuid: uuid });
    res.json({ uuid: uuid });
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};

const getInfoUserByUuid = async (uuid) => {
  const user = await User.findOne({ uuid: uuid });
  return {
    uuid: user.uuid,
    name: user.name,
    imageUrl: user.imageUrl,
  };
};
