import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';

import './styles.sass';
import { useWindowHeightAndWidth } from '../../custom/useWindowHeightAndWidth';
import {usePosXAndPosY} from '../../custom/usePosXAndPosY';
function LogoAndSearch({ logoComponent, position }) {
    const [searchText, setSearchText] = useState('');
    const [height, width] = useWindowHeightAndWidth();
    const [posX, posY] = usePosXAndPosY();
    const location = useLocation();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(searchText)

        setSearchText('');
    }

    const handleInputSearch = (e) => {
        setSearchText(e.target.value);
    }
    // logo and search bar
    return (
        <div className={`${posY<300 && location.pathname==='/' && position==="header" && 'hidden'} ${position==="header"?"flex-row mr-auto":"flex-column-logo"}`}>
            {/* logo */}
            <Link to="/">
                <img className={`logo-${position}`} src={logoComponent} alt="cook4u" />
            </Link>
            {/* form search */}
            <form onSubmit={handleSubmit} className='search-form'>
                <div className="search-form--icon">
                    <SearchIcon />
                </div>
                <input type="text" value={searchText} onChange={handleInputSearch} autoComplete='off' className={width>767?"search-form--input":"mobile-input"} placeholder="Tên món, nguyên liệu, loại món, chủ đề..." />
                {width>767 && <button type='submit' className="search-form--button">Tìm kiếm</button>}
            </form>
        </div>
    );
}

export default LogoAndSearch;