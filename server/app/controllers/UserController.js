import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { multipleMongooseToObj, mongooseToObj } from '../util/mongooseToObj.js'

export const signup = async (req, res) => {
    const newUser = req.body;
    try {
        const existingUser = await User.findOne({ username: newUser.username })
        if (existingUser) {
            res.json({
                succes: false,
                message: `Tên đăng nhập: ${newUser.username} đã tồn tại.`
            })
        }

        newUser.uuid = new Date().getTime();
        newUser.password_hash = bcrypt.hashSync(req.body.password, 12);

        const createdUser = new User(newUser);
        await createdUser.save();

        res.json({
            success: true,
            message: `Đăng ký tài khoản thành công với username: ${createdUser.username}`,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong!!!'
        })
    }

}

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username: username });
        if (!existingUser) {
            res.json({
                succes: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng!!!'
            })
        }

        const isCorrectPassword = bcrypt.compareSync(password, existingUser.password_hash);
        if (!isCorrectPassword) {
            res.json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng!!!'
            })
        }

        const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, 'test', { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token: token });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!!!' })
    }
}

export const signinGoogle = async (req, res) => {
    const newUser = {
        username: req.body.email,
        name: `${req.body.familyName} ${req.body.givenName}`,
        uuid: req.body.googleId,
        imageUrl: req.body.imageUrl,
    };

    try {
        let existingUser = await User.findOne({ uuid: newUser.uuid })
        if (existingUser) {
            existingUser.name = `${req.body.familyName} ${req.body.givenName}`;
            existingUser.imageUrl = req.body.imageUrl;
            await existingUser.save();
            res.status(200).json(existingUser)
            return;
        }

        const createdUser = new User(newUser);
        await createdUser.save();

        res.status(200).json(createdUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong!!!'
        })
    }

}

export const following = async (req, res) => {
    const { target } = req.query;
    const { uuid } = req.params;
    if (target === uuid) {
        res.json({ message: "Bạn không thể theo dõi chính mình." })
        return
    }
    if (!target) return;

    try {
        const currentUser = await User.findOne({ uuid: uuid });
        const followingIndex = currentUser.following.findIndex(id => id === target);
        const targetUser = await User.findOne({ uuid: target });
        if (followingIndex === -1) {
            currentUser.following.push(target)
            targetUser.followed.push(uuid);
        } else {
            currentUser.following = [...currentUser.following.filter(id => id !== target)];
            targetUser.followed = [...targetUser.followed.filter(id => id !== uuid)];
        }

        await targetUser.save()

        await currentUser.save();
        const number = await Post.countDocuments({ author: target })
        targetUser.posts = number;
        res.json({ currentUser: currentUser, targetUser: targetUser });

    } catch (error) {
        console.log(error);
    }
}

export const getUserInfo = async (req, res) => {
    const { uuid } = req.params
    try {
        const user = await User.findOne({ uuid: uuid })
        //author => "author.uuid" here
        const number = await Post.countDocuments({ "author.uuid": uuid })
        user.posts = number;

        let likedPosts = [];
        const slugs = user.liked_posts.slice(0, 10);
        for (var slug of slugs) {
            const post = await Post.findOne({ slug: slug })

            likedPosts.push(post);
        }
        user.likedPosts = likedPosts;

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(404)
    }
}

export const updateUser = async (req, res) => {
    const {uuid} = req.params;
    const user = await User.findOne({uuid: uuid})
    if(!user) res.status(404);
    try {
        const { setting } = req.query;
        if (setting === 'information') {
            user.name = req.body.name;
            user.gender = req.body.gender;
            user.phone = req.body.phone;
            user.imageUrl = req.body.imageUrl;
            user.description = req.body.description;
            await user.save()
            res.json({
                newUser: user,
                message: {
                    success: true,
                    message: `Cập nhật thông tin thành công`
                }
            })
        } else if (setting === 'password') {
            const {old_password, password} = req.body;
            const isCorrectPassword = bcrypt.compareSync(old_password, user.password_hash);
            if(isCorrectPassword){
                user.password_hash = bcrypt.hashSync(password, 12);
                await user.save();
                res.json({
                    message: {
                        success: true,
                        message: "Đổi mật khẩu thành công",
                    }
                })
            }else{
                res.json({
                    message: {
                        success: false,
                        message: "Mật khẩu cũ không đúng",
                    }
                })
            }
        
        
        }else{
            res.status(404)
        }
    } catch (error) {
        console.log(error);
        res.status(404);
    }
}

