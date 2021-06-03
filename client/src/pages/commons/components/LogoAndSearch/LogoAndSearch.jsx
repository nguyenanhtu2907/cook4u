import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';

import './styles.sass';
import { useWindowHeightAndWidth } from '../../custom/useWindowHeightAndWidth';
import { usePosXAndPosY } from '../../custom/usePosXAndPosY';
import * as api from '../../../../api/index';
import QueryString from 'query-string';
function LogoAndSearch({ logoComponent, position }) {
    const [searchText, setSearchText] = useState('');
    const [height, width] = useWindowHeightAndWidth();
    const [posX, posY] = usePosXAndPosY();
    const location = useLocation();
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        const q = QueryString.stringify({
            q: searchText.trim(),
        });
        history.push(`/post/search?${q}`);
        setSearchText('');
    };

    const handleInputSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div
            className={`${posY < 300 && location.pathname === '/' && position === 'header' && 'hidden'} ${
                position === 'header' ? 'flex-row mr-auto' : 'flex-column-logo'
            }`}
        >
            {/* logo */}
            <Link
                to="/"
                onClick={() => {
                    location.pathname === '/' && window.scrollTo(0, 0);
                }}
            >
                <img className={`logo-${position}`} src={logoComponent} alt="cook4u" />
            </Link>
            {/* form search */}
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-form--icon">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={searchText}
                    onChange={handleInputSearch}
                    autoComplete="off"
                    className={width > 767 ? 'search-form--input' : 'mobile-input'}
                    placeholder="Tên món, nguyên liệu, loại món, chủ đề..."
                />
                {width > 767 && (
                    <button type="submit" className="search-form--button">
                        Tìm kiếm
                    </button>
                )}
            </form>
        </div>
    );
}

export default LogoAndSearch;
