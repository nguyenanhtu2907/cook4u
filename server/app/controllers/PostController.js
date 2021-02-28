import mongoose from 'mongoose';
import Post from '../models/Post.js';

export const getPosts = (req, res) => {
    console.log("set up route success");
}

export const createPost = async (req, res) => {
    try {
        const newPost = req.body;
        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}