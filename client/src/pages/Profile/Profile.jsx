import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import ReactPaginate from 'react-paginate';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ReportRoundedIcon from '@material-ui/icons/ReportRounded';

import './styles.sass';
import * as api from '../../api/index';
import LoadIcon from '../commons/components/LoadIcon/LoadIcon';
import BigPostCard from '../commons/components/BigPostCard/BigPostCard';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
function Profile(props) {
    const { uuid } = useParams();
    const [height, width] = useWindowHeightAndWidth();
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;
    const following = currentUser?.following.findIndex((userId) => userId === uuid);
    const [isOwn, setIsOwn] = useState(true);
    const [targetUser, setTargetUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [openSetting, setOpenSetting] = useState(false);
    const dispatch = useDispatch();
    const [likedPosts, setLikedPosts] = useState([]);
    const [openList, setOpenList] = useState('');
    const [followList, setFollowList] = useState([]);

    const [notFoundOwn, setNotFoundOwn] = useState(false);
    const [notFoundLiked, setNotFoundLiked] = useState(false);

    const getUser = async () => {
        const { data } = await api.getInfoUserApi(uuid);
        data.createdAt = new Date(data.createdAt);
        setTargetUser(data);
        // const response = await api.getLikedPostsApi(0, 10, uuid);
        if (data.likedPosts.length) {
            setLikedPosts(data.likedPosts);
        } else {
            setNotFoundLiked(true);
        }
    };
    //load data from server
    useEffect(() => {
        getUser();
    }, [uuid]);

    useEffect(() => {
        const handleCloseSetting = () => {
            setOpenSetting(false);
        };
        window.addEventListener('click', handleCloseSetting);

        return () => window.removeEventListener('click', handleCloseSetting);
    }, []);

    //follow
    const handleClickFollow = async () => {
        if (currentUser) {
            const { data } = await api.followingApi(currentUser?.uuid, uuid);
            if (!data.message) {
                dispatch({
                    type: 'SIGNIN',
                    payload: {
                        result: data.currentUser,
                        token: JSON.parse(localStorage.getItem('profile'))?.token,
                    },
                });
                data.targetUser.createdAt = new Date(data.targetUser.createdAt);
                setTargetUser(data.targetUser);
            } else {
                alert(data.message);
            }
        } else {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        }
    };

    //pagination
    const handlePageChange = async ({ selected }) => {
        setNotFoundOwn(false);
        if (targetUser.posts <= selected * 10) {
            setPosts([]);
            setNotFoundOwn(true);
        } else {
            const { data } = await api.getPostsApi({
                skip: selected * 10,
                limit: 10,
                target: uuid,
            });
            setPosts([...data.posts]);
            setNotFoundOwn(false);
        }
    };

    const handlePageChangeLikedPosts = async ({ selected }) => {
        setNotFoundLiked(false);
        const { data } = await api.getLikedPostsApi({
            skip: selected * 10,
            limit: 10,
            target: targetUser.uuid,
        });
        if (data.message) {
            setNotFoundLiked(true);
            setLikedPosts([]);
        } else {
            setLikedPosts(data);
            setNotFoundLiked(false);
        }
    };
    //handle show follow
    const fetchFollowUsers = async (type, { selected }) => {
        const { data } = await api.getFollowUsersApi(targetUser.uuid, type, selected || 0);
        setFollowList(data);
    };

    if (!targetUser.uuid) {
        return <LoadIcon />;
    }

    return (
        <div className="profile-page">
            <div className="profile-page--bg-avatar">
                <img referrerPolicy="no-referrer" src={targetUser.imageUrl} alt="" />
            </div>
            <div className="profile-page--paper ">
                <div className="profile-page--paper--info shadow">
                    <div className="profile-page--paper--info--avatar">
                        <img referrerPolicy="no-referrer" src={targetUser.imageUrl} alt="" />
                    </div>
                    {JSON.parse(localStorage.getItem('profile'))?.token.length < 500 &&
                        currentUser.uuid === targetUser.uuid && (
                            <>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenSetting(!openSetting);
                                    }}
                                    className="profile-page--paper--info__setting pointer"
                                >
                                    <SettingsIcon fontSize={`large`} />
                                </div>
                                {currentUser.level === 'admin' && (
                                    <div className="profile-page--paper--info__setting pointer report-icon">
                                        <Link to="admin">
                                            <ReportRoundedIcon fontSize="large" />
                                        </Link>
                                    </div>
                                )}
                                <ul
                                    className={`profile-page--paper--info__options ${
                                        !openSetting && 'profile-page--paper--info__options__hide'
                                    }`}
                                >
                                    {/* {openSetting && ( */}
                                    <>
                                        <Link to={`/user/${currentUser.uuid}/information`}>
                                            <li style={{ borderBottom: '1px solid #d8d8d8' }}>Cập nhật thông tin</li>
                                        </Link>
                                        <Link to={`/user/${currentUser.uuid}/password`}>
                                            <li>Đổi mật khẩu</li>
                                        </Link>
                                    </>
                                    {/* )} */}
                                </ul>
                            </>
                        )}

                    <div className="profile-page--paper--info--name pd-left-3 pd-right-3">
                        <h4>{targetUser.name}</h4>
                        <span>{`Tham gia ngày ${targetUser.createdAt?.getDay()} tháng ${
                            targetUser.createdAt?.getMonth() + 1
                        } năm ${targetUser.createdAt?.getFullYear()}`}</span>
                    </div>
                    <div className="profile-page--paper--info--more">
                        <div
                            className="profile-page--paper--info--more__item pointer"
                            onClick={() => {
                                setOpenList('followed');
                                fetchFollowUsers('followed', 0);
                            }}
                        >
                            <p>
                                <b>{targetUser.followed?.length}</b>
                            </p>{' '}
                            Followed
                        </div>
                        <div
                            className="profile-page--paper--info--more__item pointer"
                            onClick={() => {
                                setOpenList('following');
                                fetchFollowUsers('following', 0);
                            }}
                            style={{ borderLeft: '1px solid #d8d8d8' }}
                        >
                            <p>
                                <b>{targetUser.following?.length}</b>
                            </p>{' '}
                            Following
                        </div>
                    </div>
                    <div className="profile-page--paper--info--text">
                        <span className="profile-page--paper--info--text__description">{targetUser.description}</span>
                        <div onClick={handleClickFollow} className="profile-page--paper--info--text__follow-btn">
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
                </div>

                <div className="profile-page--paper--content pd-left-3 pd-right-3 shadow">
                    {openList ? (
                        <>
                            {/* list following and followed */}
                            <div className="profile-page--paper--content--posts__head" style={{ paddingTop: '1rem' }}>
                                <Button
                                    onClick={() => {
                                        setOpenList('');
                                        setFollowList([]);
                                    }}
                                >
                                    <ArrowBackIosIcon fontSize="small" /> Trở lại
                                </Button>
                            </div>
                            <div className="profile-page--paper--content--posts__head end-block">
                                <h5>{`${
                                    openList === 'followed'
                                        ? `${targetUser.followed.length} người đã theo dõi ${targetUser.name}`
                                        : `${targetUser.name} đang theo dõi ${targetUser.following.length} người`
                                }`}</h5>
                            </div>
                            {followList.map((user) => (
                                <Link
                                    to={`/user/${user.uuid}`}
                                    className="big-card--content__author pd-left-3 pd-right-3 end-block list-user-item"
                                >
                                    <div className="big-card--content__author__image">
                                        <img
                                            referrerPolicy="no-referrer"
                                            width="50"
                                            height="50"
                                            src={user.imageUrl}
                                            alt=""
                                        />
                                    </div>
                                    <div className="big-card--content__author__name">{user.name}</div>
                                </Link>
                            ))}

                            {openList === 'followed' ? (
                                <div
                                    className={`profile-page--paper--content--pagi end-block ${
                                        targetUser.followed.length <= 20 && 'dp-none'
                                    }`}
                                >
                                    <ReactPaginate
                                        pageCount={Math.ceil(targetUser.followed.length / 20)}
                                        pageRangeDisplayed={width < 768 ? 0 : 3}
                                        marginPagesDisplayed={width < 768 ? 0 : 1}
                                        previousLabel={'Trang trước'}
                                        nextLabel={'Tiếp theo'}
                                        onPageChange={(selected) => fetchFollowUsers(openList, selected)}
                                        initialPage={0}
                                        activeLinkClassName="click-page"
                                        disableInitialCallback={true}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`profile-page--paper--content--pagi end-block ${
                                        targetUser.following.length <= 20 && 'dp-none'
                                    }`}
                                >
                                    <ReactPaginate
                                        pageCount={Math.ceil(targetUser.following.length / 20)}
                                        pageRangeDisplayed={width < 768 ? 0 : 3}
                                        marginPagesDisplayed={width < 768 ? 0 : 1}
                                        previousLabel={'Trang trước'}
                                        nextLabel={'Tiếp theo'}
                                        onPageChange={(selected) => fetchFollowUsers(openList, selected)}
                                        initialPage={0}
                                        activeLinkClassName="click-page"
                                        disableInitialCallback={true}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* list posts posted and liked */}
                            <div>
                                <div
                                    onClick={() => setIsOwn(true)}
                                    className={`home-page--paper--switch pointer ${isOwn && 'home-page--paper--focus'}`}
                                >
                                    Đã đăng
                                </div>
                                {currentUser?.uuid === targetUser.uuid && (
                                    <div
                                        onClick={() => setIsOwn(false)}
                                        className={`home-page--paper--switch pointer ${
                                            !isOwn && 'home-page--paper--focus'
                                        }`}
                                    >
                                        Đã yêu thích
                                    </div>
                                )}
                            </div>
                            {isOwn ? (
                                <>
                                    {notFoundOwn ? (
                                        <h3 className="pd-left-3 pd-right-3">Không có bài viết nào</h3>
                                    ) : (
                                        <div className="profile-page--paper--content--posts">
                                            <div className="profile-page--paper--content--posts__head end-block">
                                                <h5>{`Tổng số: ${targetUser.posts} bài viết`}</h5>
                                            </div>
                                            {posts.length ? (
                                                <div className="profile-page--paper--content--posts__items end-block">
                                                    {posts &&
                                                        posts.map((post, index) => (
                                                            <BigPostCard post={post} key={index} />
                                                        ))}
                                                </div>
                                            ) : (
                                                <LoadIcon />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        className={`profile-page--paper--content--pagi end-block ${
                                            targetUser.posts <= 10 && 'dp-none'
                                        }`}
                                    >
                                        <ReactPaginate
                                            pageCount={Math.ceil(targetUser.posts / 10)}
                                            pageRangeDisplayed={width < 768 ? 0 : 3}
                                            marginPagesDisplayed={width < 768 ? 0 : 1}
                                            previousLabel={'Trang trước'}
                                            nextLabel={'Tiếp theo'}
                                            onPageChange={(selected) => handlePageChange(selected)}
                                            initialPage={0}
                                            activeLinkClassName="click-page"
                                            disableInitialCallback={false}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {notFoundLiked ? (
                                        <h3 className="pd-left-3 pd-right-3">Không có bài viết nào</h3>
                                    ) : (
                                        <div className="profile-page--paper--content--posts">
                                            <div className="profile-page--paper--content--posts__head end-block">
                                                <h5>{`Tổng số: ${targetUser.liked_posts.length} bài viết`}</h5>
                                            </div>
                                            {likedPosts.length ? (
                                                <div className="profile-page--paper--content--posts__items end-block">
                                                    {likedPosts &&
                                                        likedPosts.map((post, index) => (
                                                            <BigPostCard post={post} key={index} />
                                                        ))}
                                                </div>
                                            ) : (
                                                <LoadIcon />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        className={`profile-page--paper--content--pagi end-block ${
                                            targetUser.liked_posts.length <= 10 && 'dp-none'
                                        }`}
                                    >
                                        <ReactPaginate
                                            pageCount={Math.ceil(targetUser.liked_posts.length / 10)}
                                            pageRangeDisplayed={width < 768 ? 0 : 3}
                                            marginPagesDisplayed={width < 768 ? 0 : 1}
                                            previousLabel={'Trang trước'}
                                            nextLabel={'Tiếp theo'}
                                            onPageChange={(selected) => handlePageChangeLikedPosts(selected)}
                                            initialPage={0}
                                            activeLinkClassName="click-page"
                                            disableInitialCallback={true}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
