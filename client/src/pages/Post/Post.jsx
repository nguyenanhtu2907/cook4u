import React, { useEffect, useState } from 'react';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';

import './styles.sass'
import Step from './Step';
import Comment from './Comment';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';

function Post(props) {

    const [post, setPost] = useState(initPost)

    const [isOptionOpen, setIsOptionOpen] = useState(false);

    const [openDialog, setOpenDialog] = useState(false)

    const [height, width ] = useWindowHeightAndWidth();

    useEffect(() => {
        const hideDropdown = () => {
            setIsOptionOpen(false)
        };

        window.addEventListener('click', hideDropdown);

        return () => window.removeEventListener('click', hideDropdown);
    }, [])


    //get slug from url
    const { slug } = useParams();
    useEffect(() => {
        //call api to get post
    }, [])

    const [comment, setComment] = useState('');
    const handleChangeComment = (e) => {
        setComment(e.target.value)
    }
    const handleSubmitComment = (e) => {
        e.preventDefault();
        //submit to db and get post after submit: newPost
        //setPost(newPost)
        if (!localStorage.getItem('profile')) alert("Hãy đăng nhập để bình luận bạn nhé.")
        console.log(comment.trim());
        setComment('')
    }

    //handle button deletePost
    const handleClickOpenDelete = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setOpenDialog(true);
    };
    const handleCloseDelete = (e) => {
        e.stopPropagation()
        setOpenDialog(false);
    };
    const handleCickAgreeDelete = (e) => {
        e.stopPropagation()
        setOpenDialog(false);
        //thao tác xóa bài viết ở đây
    };

    const handleReport = (e) => {
        e.preventDefault()
        // e.stopPropagation()
        //thao tác xóa bài viết ở đây
    };

    return (
        <div className="post-page">
            <div className="post-page--paper shadow">
                <div className="post-page--paper__thumbnail">
                    <img width="680" height="480" src={post.thumbnail} alt="" />
                </div>
                <div className="post-page--paper__option-icon" onClick={(e) => { e.stopPropagation(); setIsOptionOpen(!isOptionOpen) }}>
                    <IconButton ><MoreVertIcon /></IconButton>
                </div>
                {isOptionOpen && <div className="post-page--paper__option-list">
                    <ul>
                        <li>
                            <Link to={`/post/${post.slug}/edit`} >Chỉnh sửa</Link>
                        </li>
                        <li >
                            <Link onClick={handleClickOpenDelete} to='/'>Xóa bài</Link>
                        </li>
                        <li >
                            <Link onClick={handleReport} to='/'>Báo cáo</Link>
                        </li>
                    </ul>
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Bạn muốn xóa bài viết?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Thao tác của bạn sẽ xóa vĩnh viễn bài viết và không thể khôi phục. Bạn chắc chắn chứ?
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
                }
                <div className="post-page--paper--intro pd-left-3 end-block">
                    <div className="post-page--paper--intro--post-title">
                        <h1 className="post-page--paper--intro--post-title__title">
                            {post.title}
                        </h1>
                        {/* tablelet = h2 mobile = h3 */}
                        <div className="post-page--paper--intro--post-title__like-icon pointer">
                            <FavoriteBorderRoundedIcon fontSize="large" />
                            {/* <FavoriteRoundedIcon color="error" fontSize="large" /> */}
                        </div>
                    </div>
                    <div className="post-page--paper--intro--time">
                        {`Đăng ngày ${post.createdAt.getDay()} tháng ${post.createdAt.getMonth() + 1} năm ${post.createdAt.getFullYear()}`}
                    </div>
                    <div className="post-page--paper--intro--post-author">
                        <Link to={`/user/${post.author.uuid}`} className="post-page--paper--intro--post-author__info">
                            <div className="post-page--paper--intro--post-author__info--avatar">
                                <img src={post.author.imageUrl} alt="" />
                            </div>
                            <div className="post-page--paper--intro--post-author__info--name">
                                {post.author.name}
                            </div>
                        </Link>
                        <div className="post-page--paper--intro--post-author__button">
                            <Button ><PersonAddIcon fontSize='small' /> <span>Theo dõi</span></Button>
                        </div>
                    </div>
                    <span className="post-page--paper--intro--post-about">
                        {post.description}
                    </span>
                </div>

                <div className="post-page--paper--ingredients pd-left-3 end-block">
                    <h2 className="title-page">
                        Nguyên liệu
                        </h2>
                    <ul className="post-page--paper--ingredients__list">
                        {post.ingredients.map((ingredient, index) => (
                            <li key={index} className={index !== 0 ? 'post-page--paper--ingredients__list__end-item' : null}>{ingredient.text}</li>
                        ))}
                    </ul>
                </div>
                <div className="post-page--paper--steps pd-left-3 end-block">
                    <h2 className="title-page">
                        Các bước
                    </h2>
                    <ul className="post-page--paper--steps__list">
                        {post.steps.map((step, index) => (
                            <Step key={index} step={step} index={index + 1} />
                        ))}
                    </ul>
                </div>


                <div className="post-page--paper--comment pd-left-3 end-block">
                    <h2 className="title-page">
                        <ChatBubbleIcon fontSize='large' style={{ position: 'relative', top: '10px' }} /> Bình luận
                    </h2>

                    <ul className="post-page--paper--comment__comments">
                        {post.comments.map((comment, index) => (
                            <Comment comment={comment} key={index} />
                        ))}
                    </ul>

                    <div className="post-page--paper--comment--content">
                        <div className="post-page--paper--comment--content__avatar">
                            <img src={JSON.parse(localStorage.getItem('profile'))?.result.imageUrl} alt="" />
                        </div>
                        <form onSubmit={handleSubmitComment} className="post-page--paper--comment--content__form">
                            <div className="post-page--paper--comment--content__form__input">
                                <input placeholder="Suy nghĩ của bạn là gì?" value={comment} onChange={handleChangeComment} type="text" autoComplete='off' />
                            </div>
                            <div className={`post-page--paper--comment--content__form__icon ${width<550?"right-2":''}`}>
                                <IconButton type='submit'><SendRoundedIcon color="disabled" /> </IconButton>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="post-page--paper--more pd-left-3 end-block">
                    <h3 className="title-page">
                        {`Một số bài viết khác của ${post.author.name}`}
                    </h3>
                    <div className="more--posts">

                        {morePost.map((post, index) => {
                            //SmallPost
                        })}
                    </div>
                </div>





            </div>
        </div>
    );
}

export default Post;

const initPost = {
    title: 'Chè Bột Lọc Hoa Đậu Biếc',
    author: {
        name: 'Nguyen Anh Tu',
        imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
        uuid: '12345677'
    },
    thumbnail: 'https://img-global.cpcdn.com/recipes/789b4d37cadb3160/640x640sq70/photo.webp',
    ration: 3,
    time: 60,
    description: 'Bài đã được đăng 2Sao.vn',
    ingredients: [
        { id: '1287078har3', text: '150 g bột năng' },
        { id: '12gadfadfg3', text: '80 ml nước sôi' },
        { id: '12sdS3', text: '20 hoa đậu biếc' },
        { id: '123ASDj', text: 'Đường phèn' },
        { id: '12qwr3', text: '1 muỗng cafe gừng' },
    ],
    steps: [
        {
            text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
            images: [
                {
                    id: '123',
                    imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '1234',
                    imageUrl: 'https://img-global.cpcdn.com/steps/a86ed9f63e540cdf/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '1235',
                    imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },


            ]
        }, {
            text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
            images: [
                {
                    id: '132',
                    imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '57356',
                    imageUrl: 'https://img-global.cpcdn.com/steps/a86ed9f63e540cdf/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '1341234',
                    imageUrl: 'https://i.pinimg.com/564x/19/a8/50/19a850f56d42d24a7ebd81895b3a9487.jpg',
                },
                {
                    id: '234234223',
                    imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '1635723',
                    imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
                {
                    id: '1223452343',
                    imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
            ]
        }, {
            text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
            images: [
                {
                    id: '123',
                    imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
            ]
        }, {
            text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
            images: [
                {
                    id: '123',
                    imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
                },
            ]
        }
    ],
    likes: [1, 2, 3, 4],
    comments: [{
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
        text: "ha ha day la 1 cai comment",
    }, {
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        text: "ha ha day la 1 cai comment",
        createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
    }, {
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        text: "ha ha day la 1 cai comment",
        createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
    }],
    slug: 'che-bot-loc-hoa-dau-biec',
    createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
}
const morePost = [
    {
        title: 'Lẩu Cầy',
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        thumbnail: 'https://img-global.cpcdn.com/recipes/fe1a9cb129fc8e42/680x482cq70/l%E1%BA%A9u-c%E1%BA%A7y-recipe-main-photo.webp',
        slug: '123',
    },
    {
        title: 'Kem chuối socola',
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        thumbnail: 'https://img-global.cpcdn.com/recipes/4ddc099dd225afa3/680x482cq70/kem-chu%E1%BB%91i-socola-recipe-main-photo.webp',
        slug: '123',
    },
    {
        title: 'Kẹo chip chip cam',
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        thumbnail: 'https://img-global.cpcdn.com/recipes/48c902c0598d6bc4/680x482cq70/k%E1%BA%B9o-chip-chip-cam-recipe-main-photo.webp',
        slug: '123',
    },
    {
        title: 'Quà lưu niệm của cookpad',
        author: {
            name: 'Nguyen Anh Tu',
            imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
            uuid: '12345677'
        },
        thumbnail: 'https://img-global.cpcdn.com/recipes/6c834ede69ef7ae1/680x482cq70/qua-l%C6%B0u-ni%E1%BB%87m-c%E1%BB%A7a-cookpad-recipe-main-photo.webp',
        slug: '123',
    },
]