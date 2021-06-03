import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import { useDispatch } from 'react-redux';

import * as api from '../../../../api/index';
import './styles.sass';
import { useWindowHeightAndWidth } from '../../custom/useWindowHeightAndWidth';
function BigPostCard(props) {
    const postProps = props.post;
    const [post, setPost] = useState(postProps);
    const userId = JSON.parse(localStorage.getItem('profile'))?.result.uuid;
    let liked;
    const [height, width] = useWindowHeightAndWidth();
    const dispatch = useDispatch();
    if (userId) {
        liked = post.likes.find((id) => id === userId);
    }
    const handleClickLike = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (userId) {
            const { data } = await api.likePostsApi({ slug: post.slug });
            dispatch({ type: 'UPDATE_POSTS', payload: data });
            setPost({ ...data });
        } else {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        }
    };
    return (
        <div>
            <div className="big-card">
                <div className="big-card--content">
                    {width > 767 && (
                        <div className="big-card--content__author">
                            <Link to={`/user/${post.author.uuid}`} className="big-card--content__author">
                                <div className="big-card--content__author__image">
                                    <img width="50" height="50" src={post.author.imageUrl} alt="" />
                                </div>
                                <div className="big-card--content__author__name">{post.author.name}</div>
                            </Link>
                            <div
                                onClick={(e) => handleClickLike(e, post._id)}
                                className="big-card--content__author__like-icon"
                            >
                                {liked ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}{' '}
                                {post.likes.length}
                            </div>
                        </div>
                    )}
                    <div className="big-card--content__title">
                        <Link to={`/post/${post.slug}`} className="big-card--content__title__text">
                            {width > 767 ? <h2>{post.title} </h2> : <h3>{post.title} </h3>}
                        </Link>
                    </div>

                    <div className="big-card--content__more-info">
                        {post.description
                            ? post.description
                            : post.ingredients
                                  .reduce((text, ingredient) => {
                                      return text + `${ingredient.text}, `;
                                  }, '')
                                  .slice(0, 55) + '...'}
                    </div>
                </div>
                <Link to={`/post/${post.slug}`}>
                    <div className="big-card--image">
                        <img src={post.thumbnail} alt="" />
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default BigPostCard;
