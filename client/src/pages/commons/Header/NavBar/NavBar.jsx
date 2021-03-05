import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import './styles.sass';
const navList = [
    {
        name: "Khám phá",
        path: "/",
        icon: (<AppsRoundedIcon style={{ position: 'relative', top: '5px' }} />),
    },
    {
        name: "Món mới",
        path: "/post/create",
        icon: (<AddCircleOutlineRoundedIcon style={{ position: 'relative', top: '5px' }} />),
    },
]
const optionsUser = [
    {
        name: "Đăng ký",
        path: "/user/signup",
        icon: (<PersonAddRoundedIcon style={{ position: 'relative', top: '5px' }} />),
    },
    {
        name: "Đăng nhập",
        path: "/user/signin",
        icon: (<PersonRoundedIcon style={{ position: 'relative', top: '5px' }} />),
    },
]
// const user = {
//     name: "Nguyen Anh Tu",
//     imageUrl: "https://i.pinimg.com/564x/52/23/8f/52238f55414391a5f01a124920304a6f.jpg",
//     uuid: "uuid",
// }
function NavBar({ user, handleLogout }) {
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
            path: `/user/${user?.result.uuid}/information`,
        },
    ] :
        [
            {
                name: "Trang cá nhân",
                path: `/user/${user?.result.uuid}`,
            },
        ]

    const [isDrop, setIsDrop] = useState(false);
    // click outside dropdown menu to set isDrop = false
    useEffect(() => {
        const hideDropdown = () => {

            setIsDrop(false)
        };

        window.addEventListener('click', hideDropdown);

        return () => window.removeEventListener('click', hideDropdown);
    }, [])

    return (
        <nav className="nav-bar">

            {navList.map(option => (
                <Link onClick={() => setIsDrop(false)} key={option.path} className="nav-bar--item" to={option.path}>{option.name} {option.icon}</Link>
            ))}

            {!user ?
                optionsUser.map(option => (
                    <Link key={option.path} className="nav-bar--item" to={option.path}>{option.name} {option.icon}</Link>
                )) :
                (<>
                    <span
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsDrop(!isDrop)
                        }}
                        className="nav-bar--item block-profile">
                        <b>{user.result.name}</b>
                        <div className="nav-bar--item__avatar"><img referrerPolicy="no-referrer" width="50" height="50" src={user.result.imageUrl} alt="" /></div>
                    </span>
                    {/* dropdown menu */}
                    <div className={`${isDrop ? "dropdown-content" : "hide-dropdown"} shadow`}>
                        {optionsDropdown.map((option, index) => (
                            <Link className="dropdown-content--item" key={option.path} to={option.path}>
                                <ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />
                                {option.name}
                            </Link>
                        ))}
                        <span style={{ cursor: 'pointer' }} onClick={handleLogout} className="dropdown-content--item" >
                            <ArrowRightAltIcon className="dropdown-content--item__icon" style={{ position: 'relative', top: '5px', color: '#ff8822' }} />
                            Đăng xuất
                        </span>
                    </div>
                </>)
            }
        </nav>
    );
}

export default NavBar;