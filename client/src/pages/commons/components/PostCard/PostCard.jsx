import React, { useState } from 'react';
import AlarmRoundedIcon from '@material-ui/icons/AlarmRounded';
import { Link } from 'react-router-dom';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import * as api from '../../../../api/index';

import './styles.sass';
import { useDispatch } from 'react-redux';
function PostCard({ data }) {
    const slug = window.location.pathname.slice(6);

    const [post, setPost] = useState({ ...data });
    const dispatch = useDispatch();
    const userId = JSON.parse(localStorage.getItem('profile'))?.result.uuid;
    let liked;
    if (userId) {
        liked = post.likes.find(id => id === userId);
    } 

    const handleClickLike = async (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        if (userId) {
            const { data } = await api.likePostsApi(post.slug, userId);
            dispatch({ type: 'UPDATE_POSTS', payload: data })
            setPost({ ...data })
        } else {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.')
        }
    }
    return (

        <div className="post-card ">
            {!slug.length &&
                <Link className="post-card--author" to={`/user/${post.author.uuid}`} >
                    <div className="post-card--author__avatar">
                        <img referrerPolicy="no-referrer" src={post.author.imageUrl} alt="" />
                    </div>
                    <span className="post-card--author__name">
                        {post.author.name}
                    </span>
                </Link>}

            <Link to={`/post/${post.slug}`} className="post-card--content shadow">
                <div className="post-card--content--thumbnail">
                    <img width='320' height='240' src={post.thumbnail} alt="" />
                </div>
                <div className="post-card--content--info pd-left-3 pd-right-3">
                    <div className="post-card--content--info--title">
                        <h2>{post.title}</h2>
                    </div>
                    <div className="post-card--content--info--title--icon">
                        <div className="post-card--content--info--title--icon__like" onClick={(e) => handleClickLike(e, post._id)}>
                            {liked ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />} {post.likes.length}
                        </div>
                        {post.time && (
                            <span><AlarmRoundedIcon fontSize='inherit' /> {post.time} phút</span>
                        )}
                    </div>
                    {!slug.length && <p>{post.description}</p>}
                </div>
            </Link>
        </div>
    );
}

export default PostCard;