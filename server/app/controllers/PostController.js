import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { multipleMongooseToObj, mongooseToObj } from '../util/mongooseToObj.js'

export const getPosts = (req, res) => {
    const { skip, limit, target } = req.query
    let query = {}
    // author => author.uuid here
    if (target) query = { "author.uuid": target }
    Post.find(query).limit(limit * 1).skip(skip * 1 || 0).sort({ 'createdAt': -1 })
        .then((posts) => multipleMongooseToObj(posts))
        .then(posts => getPostsInfo(posts))
        .then(posts => res.json(posts))
        .catch((e) => { console.log(e) })
}
export const getLikedPosts = async (req, res) => {
    const { skip, limit, target } = req.query
    try {
        const user = await User.findOne({ uuid: target })
        const posts = [];
        const total = user.liked_posts.length;
        if (skip <= total) {
            for (let i = skip * 1; i < (skip * 1 + limit * 1 >= total ? total : (skip * 1 + limit * 1)); i++) {
                let post = await Post.findOne({ slug: user.liked_posts[i] })
                if (post.title) {
                    post = await getPostInfo(post)
                    posts.push(post)
                }
            }
            res.json(posts);
        } else {
            res.json({ message: "Không có bài viết nào." });
        }
    } catch (error) {
        console.log(error);
        res.json(404)
    }
}
export const getMorePosts = async (req, res) => {
    const { user } = req.query;
    const { slug } = req.params;
    try {
        const posts = await Post.find({ "author.uuid": user }).limit(5).sort({ 'createdAt': -1 })
        const response = [...posts.filter(post => post.slug !== slug)]
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(404)
    }
}

export const getPost = (req, res) => {
    const slug = req.params.slug
    Post.findOne({ slug: slug })
        .then(post => getPostInfo(post))
        .then(post => getCommentsInfo(post))
        .then(post => res.json(post))
        .catch((e) => { console.log(e) })
}

export const createPost = async (req, res) => {
    try {
        const newPost = req.body;
        const post = new Post(newPost);
        let ingreString = ''
        post.ingredients.forEach(ingredient => ingreString += `${ingredient.text} `)
        post.key = `${removeVietnameseTones(post.title)} ${removeVietnameseTones(ingreString)}`
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}

export const modifyPost = async (req, res) => {
    const { slug } = req.params;
    console.log(req.body);
    const { thumbnail, title, ration, time, ingredients, steps, description } = req.body
    try {
        const post = await Post.findOne({ slug: slug })
        post.title = title
        post.thumbnail = thumbnail
        post.ration = ration
        post.time = time
        post.ingredients = ingredients
        post.steps = steps
        post.description = description
        let ingreString = ''
        ingredients.forEach(ingredient => ingreString += `${ingredient.text} `)
        post.key = `${removeVietnameseTones(title)} ${removeVietnameseTones(ingreString)}`
        await post.save()
        res.json({ slug: post.slug })
    } catch (error) {
        console.log(error);
    }
}
export const deletePost = async (req, res) => {
    try {
        const { slug } = req.params;
        await Post.deleteOne({ slug: slug })
        res.json({ slug: slug })
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    const { slug } = req.params;
    const uuid = req.query.user;
    try {
        const post = await Post.findOne({ slug: slug });
        const postIndex = post.likes.findIndex(userId => userId === uuid)
        if (postIndex < 0) {
            post.likes.push(uuid)
        } else {
            post.likes = [...post.likes.filter(userId => userId !== uuid)]
        }

        const userLike = await User.findOne({ uuid: uuid })
        const userIndex = userLike.liked_posts.findIndex(slug => slug === post.slug)
        if (userIndex < 0) {
            userLike.liked_posts.push(post.slug)
        } else {
            userLike.liked_posts = [...userLike.liked_posts.filter(slug => slug !== post.slug)]
        }
        await userLike.save()
        post.save()
            .then(post => getPostInfo(post))
            .then(post => res.json(post))




    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Something went wrong!!!" })
    }
}

export const commentPost = async (req, res) => {
    const comment = req.body.text;
    const { slug } = req.params;
    const uuid = req.query.user;
    try {
        const currentPost = await Post.findOne({ slug: slug });
        currentPost.comments.push({
            text: comment,
            author: uuid,
            createdAt: new Date().getTime(),
        })
        currentPost.save()
            .then(post => getPostInfo(post))
            .then(post => getCommentsInfo(post))
            .then(post => res.json(post))
            .catch((e) => { console.log(e) })
    } catch (error) {
        console.log(error);
    }
}
export const deleteCommentPost = async (req, res) => {
    const { createdAt } = req.body;
    const { slug } = req.params;
    try {
        const currentPost = await Post.findOne({ slug: slug });
        currentPost.comments = [...currentPost.comments.filter(comment => comment.createdAt !== createdAt)]
        currentPost.save()
            .then(post => getPostInfo(post))
            .then(post => getCommentsInfo(post))
            .then(post => res.json(post))
            .catch((e) => { console.log(e) })
    } catch (error) {
        console.log(error);
    }
}

export const searchPosts = async (req, res) => {
    const { q, skip } = req.query;

    try {
        const query = {
            $text: {
                $search: q,
            }
        }
        Post.find(query).limit(10).skip(skip*1)
            .then(posts => getPostsInfo(posts))
            .then(posts => res.json(posts))
    } catch (error) {
        console.log(eror);
        res.status(404)
    }
}


async function getPostInfo(post) {
    const user = await User.findOne({ uuid: post.author.uuid });
    post.author = {
        uuid: post.author.uuid,
        name: user.name,
        imageUrl: user.imageUrl,
    }
    return post;
}
async function getPostsInfo(posts) {
    for (var post of posts) {
        const user = await User.findOne({ uuid: post.author.uuid });
        post.author = {
            uuid: post.author.uuid,
            name: user.name,
            imageUrl: user.imageUrl,
        }
    }
    return posts
}
async function getCommentsInfo(post) {
    const newArray = []
    for (var comment of post.comments) {
        const user = await User.findOne({ uuid: comment.author });
        comment = {
            text: comment.text,
            author: comment.author,
            createdAt: comment.createdAt,
            name: user.name,
            imageUrl: user.imageUrl,
        }
        newArray.push(comment);
    }
    post.comments = [...newArray]
    return post;
}
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}