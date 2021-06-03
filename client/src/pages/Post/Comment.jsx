import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { IconButton } from '@material-ui/core';

import * as api from '../../api/index';
import { handleReport } from '../commons/custom/handleReport';

function Comment({ comment, slug, setPost, author }) {
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;

    useEffect(() => {
        const hideDropdown = () => {
            setIsOptionOpen(false);
        };

        window.addEventListener('click', hideDropdown);

        return () => window.removeEventListener('click', hideDropdown);
    });
    const handleDeleteComment = async (createdAt) => {
        const { data } = await api.deleteCommentPostsApi({ slug, createdAt: createdAt });
        data.createdAt = new Date(data.createdAt);
        setPost(data);
    };
    const handleClickOption = (e) => {
        if (!isOptionOpen) e.stopPropagation();
        setIsOptionOpen(!isOptionOpen);
    };
    return (
        <li style={{ listStyle: 'none', position: 'relative' }}>
            <Link className="post-page--paper--comment__comments__item" to={`/user/${comment.author}`}>
                <div className="post-page--paper--comment__comments__item__avatar">
                    <img width="35" height="35" src={comment.imageUrl} alt="" />
                </div>
                <div className="post-page--paper--comment__comments__item__text">
                    <h5>{comment.name}</h5>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                </div>
            </Link>
            {currentUser && (
                <>
                    <div onClick={handleClickOption} className="post-page--paper--comment__comments__icon">
                        <IconButton size="small" variant="outline">
                            <MoreHorizIcon fontSize="small" />
                        </IconButton>
                    </div>
                    {isOptionOpen && (
                        <>
                            <div className="post-page--paper--comment__comments__option">
                                {(currentUser.uuid === author || currentUser.level === 'admin') && (
                                    <div onClick={() => handleDeleteComment(comment.createdAt)} className="bd-bottom">
                                        Xóa bình luận
                                    </div>
                                )}

                                <div
                                    onClick={async () => {
                                        const response = await handleReport('comment', slug, currentUser.uuid);
                                        alert(response.message);
                                    }}
                                >
                                    Báo cáo
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <span className="post-page--paper--comment__comments__text">{comment.text}</span>
        </li>
    );
}

export default Comment;
