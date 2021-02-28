import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { Button } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import './styles.sass';

const navList = [
    {
        name: "Khám phá",
        path: "/suggest",
    },
    {
        name: "Món mới",
        path: "/create-post",
    },
]
const optionsUser = [
    {
        name: "Đăng ký",
        path: "/user/signup",
    },
    {
        name: "Đăng nhập",
        path: "/user/signin",
    },
]
// const user = {
//     name: "Tên người dùng",
//     imageUrl: "https://i.pinimg.com/564x/52/23/8f/52238f55414391a5f01a124920304a6f.jpg",
//     uuid: "uuid",
// }


function SmallNavBar({ user, handleLogout }) {
    const optionsDropdown = user?.token.length < 500 ? [
        {
            name: "Trang cá nhân",
            path: `/user/${user?.result.uuid}`,
        },
        {
            name: "Đổi mật khẩu",
            path: `/user/${user?.result.uuid}/password`,
        },
        {
            name: "Thông tin cá nhân",
            path: `/user/${user?.result.uuid}/infomation`,
        },
    ] :
        [
            {
                name: "Trang cá nhân",
                path: `/user/${user?.result.uuid}`,
            },
        ]


    const [isDrop, setIsDrop] = useState(false);

    useEffect(() => {
        const hideDropdown = () => {

            setIsDrop(false)
        };

        window.addEventListener('click', hideDropdown);

        return () => window.removeEventListener('click', hideDropdown);
    })

    return (
        <div className="small-nav">
            {/* icon menu */}
            <div className="small-nav--icon">
                <Button onClick={(e) => {
                    e.stopPropagation()
                    setIsDrop(!isDrop)
                }}>
                    <MenuRoundedIcon fontSize="large" />
                </Button>
            </div>

            {/* dropdown menu */}
            <nav className={`${isDrop ? "dropdown-content" : "hide-dropdown"} shadow small-nav--items`}>

                {!user ?
                    optionsUser.map(option => (
                        <Link key={option.path} className=" dropdown-content--item" to={option.path}>
                            <ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />
                            {option.name}
                        </Link>
                    )) :
                    (<span className="nav-bar--item block-profile">
                        <b>{user.result.name}</b>
                        <div className="nav-bar--item__avatar"><img width="50" height="50" src={user.result.imageUrl} alt="" /></div>
                    </span>)}
                {navList.map(option => (
                    <Link key={option.path} className="dropdown-content--item " to={option.path}><ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />{option.name}</Link>
                ))}
                {user && (
                    optionsDropdown.map(option => (
                        <Link key={option.path} className="dropdown-content--item " to={option.path}><ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />{option.name}</Link>
                    ))
                )}
                <span style={{ cursor: 'pointer' }} onClick={handleLogout} className="dropdown-content--item" >
                    <ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />
                            Đăng xuất
                </span>

            </nav>
        </div>
    );
}

export default SmallNavBar;