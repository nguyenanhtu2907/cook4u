import React, { useEffect, useState } from 'react';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './styles.sass';
import Step from './Step';
import Comment from './Comment';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
import * as api from '../../api/index';
import LoadIcon from '../commons/components/LoadIcon/LoadIcon';
import { handleReport } from '../commons/custom/handleReport';
import PostCard from '../commons/components/PostCard/PostCard';

function Post() {
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;
    const [morePosts, setMorePosts] = useState([]);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');

    const liked = post?.likes.findIndex((userId) => userId === currentUser?.uuid);
    const following = currentUser?.following.findIndex((userId) => userId === post?.author.uuid);
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [height, width] = useWindowHeightAndWidth();

    //option in thumbnail
    useEffect(() => {
        const hideDropdown = () => {
            setIsOptionOpen(false);
        };

        window.addEventListener('click', hideDropdown);
        return () => window.removeEventListener('click', hideDropdown);
    }, []);

    //get slug from url
    const { slug } = useParams();

    const handleGetPosts = async () => {
        setMorePosts([]);
        const { data } = await api.getPostApi(slug);
        data.data.createdAt = new Date(data.data.createdAt);
        setPost(data.data);
        window.scrollTo(0, 0);
        const res = await api.getMorePostsApi({ slug, uuid: data.data.author.uuid });
        setMorePosts(res.data.data);
    };

    useEffect(() => {
        handleGetPosts();
    }, [slug]);

    //follow
    const handleClickFollow = async () => {
        if (currentUser) {
            const { data } = await api.followingApi({ target: post.author.uuid });
            if (!data.message) {
                dispatch({
                    type: 'SIGNIN',
                    payload: {
                        result: data.data.currentUser,
                        token: JSON.parse(localStorage.getItem('profile'))?.token,
                    },
                });
            } else {
                alert(data.message);
            }
        } else {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        }
    };

    const handleClickLike = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentUser) {
            const { data } = await api.likePostsApi({ slug: post.slug });
            dispatch({ type: 'UPDATE_POSTS', payload: data.data });
            data.data.createdAt = new Date(data.data.createdAt);
            setPost({ ...data.data });
        } else {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        }
    };

    const handleChangeComment = (e) => {
        setComment(e.target.value);
    };
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('profile')) {
            alert('Hãy đăng nhập để bình luận bạn nhé.');
            return;
        }
        //submit to db and get post after submit: newPost
        const { data } = await api.commentPostsApi({
            slug: post?.slug,
            text: comment.trim(),
        });
        data.data.createdAt = new Date(data.data.createdAt);
        setPost(data.data);
        setComment('');
    };

    //handle button deletePost
    const handleClickOpenDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenDialog(true);
    };

    const handleCloseDelete = (e) => {
        e.stopPropagation();
        setOpenDialog(false);
    };
    
    const handleCickAgreeDelete = async (e) => {
        e.stopPropagation();
        setOpenDialog(false);
        const { data } = await api.deletePostApi(post.slug);
        dispatch({ type: 'REMOVE_POST', payload: data.data });
        history.push(`/user/${post.author.uuid}`);
    };

    const handleReportPost = async (e) => {
        e.preventDefault();
        const response = await handleReport('post', post.slug, currentUser.uuid);
        alert(response.message);
    };

    if (!post) return <LoadIcon />;

    return (
        <div className="post-page">
            <div className="post-page--paper shadow">
                <div className="post-page--paper__thumbnail">
                    <img width="680" height="480" src={post.thumbnail} alt="" />
                </div>
                {/* option user */}
                {currentUser && (
                    <>
                        <div
                            className="post-page--paper__option-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOptionOpen(!isOptionOpen);
                            }}
                        >
                            <IconButton>
                                <MoreVertIcon color="secondary" />
                            </IconButton>
                        </div>
                        {isOptionOpen && (
                            <div className="post-page--paper__option-list">
                                <ul>
                                    {(currentUser?.uuid === post.author.uuid || currentUser.level === 'admin') && (
                                        <>
                                            <li>
                                                <Link to={`/post/${post.slug}/edit`}>Chỉnh sửa</Link>
                                            </li>
                                            <li>
                                                <Link onClick={handleClickOpenDelete} to="/">
                                                    Xóa bài
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <Link onClick={handleReportPost} to="/">
                                            Báo cáo
                                        </Link>
                                    </li>
                                </ul>
                                <Dialog
                                    open={openDialog}
                                    onClose={handleCloseDelete}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{'Bạn muốn xóa bài viết?'}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Thao tác của bạn sẽ xóa vĩnh viễn bài viết và không thể khôi phục. Bạn chắc
                                            chắn chứ?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCickAgreeDelete} color="primary" autoFocus>
                                            Xóa ngay
                                        </Button>
                                        <Button onClick={handleCloseDelete} color="primary">
                                            Suy nghĩ lại
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        )}
                    </>
                )}
                <div className="post-page--paper--intro pd-left-3 end-block">
                    <div className="post-page--paper--intro--post-title">
                        <h1 className="post-page--paper--intro--post-title__title">{post.title}</h1>

                        {/* button like */}
                        <div
                            onClick={handleClickLike}
                            className="post-page--paper--intro--post-title__like-icon pointer"
                        >
                            {liked === -1 ? (
                                <FavoriteBorderRoundedIcon fontSize="large" />
                            ) : (
                                <FavoriteRoundedIcon color="error" fontSize="large" />
                            )}
                        </div>
                    </div>
                    <div className="post-page--paper--intro--time">
                        {`Cập nhật ngày ${post.createdAt.getDay()} tháng ${
                            post.createdAt.getMonth() + 1
                        } năm ${post.createdAt.getFullYear()}`}
                    </div>
                    <div className="post-page--paper--intro--post-author">
                        <Link to={`/user/${post.author.uuid}`} className="post-page--paper--intro--post-author__info">
                            <div className="post-page--paper--intro--post-author__info--avatar">
                                <img referrerPolicy="no-referrer" src={post.author.imageUrl} alt="" />
                            </div>
                            <div className="post-page--paper--intro--post-author__info--name">{post.author.name}</div>
                        </Link>
                        <div onClick={handleClickFollow} className="post-page--paper--intro--post-author__button">
                            {following === undefined || following === -1 ? (
                                <Button>
                                    <PersonAddIcon fontSize="small" /> <span>Theo dõi</span>
                                </Button>
                            ) : (
                                <Button>
                                    <DoneRoundedIcon fontSize="small" /> <span>Đã theo dõi</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <span className="post-page--paper--intro--post-about">{post.description}</span>
                </div>
                {(post.time || post.ration) && (
                    <div className="post-page--paper--more-info pd-left-3 pd-right-3 end-block">
                        {post.time && (
                            <div className="post-page--paper--more-info__item">
                                <AccessTimeRoundedIcon /> {post.time} phút
                            </div>
                        )}
                        {post.ration && (
                            <div className="post-page--paper--more-info__item">
                                <GroupRoundedIcon /> {post.ration} người
                            </div>
                        )}
                    </div>
                )}
                <div className="post-page--paper--ingredients pd-left-3 end-block">
                    <h2 className="title-page">Nguyên liệu</h2>
                    <ul className="post-page--paper--ingredients__list">
                        {post.ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className={index !== 0 ? 'post-page--paper--ingredients__list__end-item' : null}
                            >
                                {ingredient.text}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="post-page--paper--steps pd-left-3 end-block">
                    <h2 className="title-page">Các bước</h2>
                    <ul className="post-page--paper--steps__list">
                        {post.steps.map((step, index) => (
                            <Step key={index} step={step} index={index + 1} />
                        ))}
                    </ul>
                </div>

                <div className="post-page--paper--comment pd-left-3 end-block">
                    <h2 className="title-page">
                        <ChatBubbleIcon fontSize="large" style={{ position: 'relative', top: '10px' }} /> Bình luận
                    </h2>

                    <ul className="post-page--paper--comment__comments">
                        {post.comments.map((comment, index) => (
                            <Comment
                                author={post.author.uuid}
                                comment={comment}
                                key={index}
                                slug={post.slug}
                                setPost={setPost}
                            />
                        ))}
                    </ul>

                    <div className="post-page--paper--comment--content">
                        <div className="post-page--paper--comment--content__avatar">
                            <img src={JSON.parse(localStorage.getItem('profile'))?.result.imageUrl} alt="" />
                        </div>
                        <form onSubmit={handleSubmitComment} className="post-page--paper--comment--content__form">
                            <div className="post-page--paper--comment--content__form__input">
                                <input
                                    placeholder="Suy nghĩ của bạn là gì?"
                                    value={comment}
                                    onChange={handleChangeComment}
                                    type="text"
                                    autoComplete="off"
                                />
                            </div>
                            <div
                                className={`post-page--paper--comment--content__form__icon ${
                                    width < 550 ? 'right-2' : ''
                                }`}
                            >
                                <IconButton type="submit">
                                    <SendRoundedIcon color="disabled" />{' '}
                                </IconButton>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="post-page--paper--more pd-left-3 pd-right-3 end-block">
                    <h3 className="title-page">{`Một số bài viết khác của ${post.author.name}`}</h3>
                    <div className="more--posts">
                        {morePosts.map((post, index) => (
                            <PostCard data={post} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
