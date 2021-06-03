import User from "../models/User.js";

export const getPostInfo = async (post) => {
  const user = await User.findOne({ uuid: post.author.uuid });
  post.author = {
    uuid: post.author.uuid,
    name: user.name,
    imageUrl: user.imageUrl,
  };
  return post;
};
export const getPostsInfo = async (posts) => {
  for (var post of posts) {
    const user = await User.findOne({ uuid: post.author.uuid });
    post.author = {
      uuid: post.author.uuid,
      name: user.name,
      imageUrl: user.imageUrl,
    };
  }
  return posts;
};

export const getCommentsInfo = async (post) => {
  const newArray = [];
  for (var comment of post.comments) {
    const user = await User.findOne({ uuid: comment.author });
    comment = {
      text: comment.text,
      author: comment.author,
      createdAt: comment.createdAt,
      name: user.name,
      imageUrl: user.imageUrl,
    };
    newArray.push(comment);
  }
  post.comments = [...newArray];
  return post;
};
