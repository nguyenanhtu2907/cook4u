import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    };

    try {
        const existingUser = await User.findOne({ uuid: newUser.uuid })
        if (existingUser) {
            res.status(200).json({
                success: true,
                message: `Login success`,
            })
            return;
        }

        const createdUser = new User(newUser);
        await createdUser.save();

        res.status(200).json({
            success: true,
            message: `Login success`,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong!!!'
        })
    }

}