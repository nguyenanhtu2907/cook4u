import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { IconButton } from '@material-ui/core'

function Comment({ comment }) {
    const [isOptionOpen, setIsOptionOpen] = useState(false);

    useEffect(() => {
        const hideDropdown = () => {
            setIsOptionOpen(false)
        };

        window.addEventListener('click', hideDropdown);

        return () => window.removeEventListener('click', hideDropdown);
    })
    const handleDeleteComment = () => {
        console.log('Delete a comment');
    }
    const handleClickOption = (e) => {
        if (!isOptionOpen) e.stopPropagation()
        setIsOptionOpen(!isOptionOpen);
    }
    return (
        <li style={{ listStyle: 'none', position: 'relative' }}>
            <Link className='post-page--paper--comment__comments__item' to={`/user/${comment.author.uuid}`}>
                <div className="post-page--paper--comment__comments__item__avatar">
                    <img width="35" height="35" src={comment.author.imageUrl} alt="" />
                </div>
                <div className="post-page--paper--comment__comments__item__text">
                    <h5>
                        {comment.author.name}
                    </h5>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                </div>
            </Link>
            <div onClick={handleClickOption} className="post-page--paper--comment__comments__icon">
                <IconButton size="small" variant='outline' ><MoreHorizIcon fontSize='small' /></IconButton>
            </div>
            {isOptionOpen &&
                <div onClick={handleDeleteComment} className="post-page--paper--comment__comments__option">
                    Xóa bình luận
            </div>}

            <span className='post-page--paper--comment__comments__text'>{comment.text}</span>
        </li>
    );
}

export default Comment;