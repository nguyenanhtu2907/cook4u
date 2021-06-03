import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ReactPaginate from 'react-paginate';
import QueryString from 'query-string';

import './styles.sass';
import * as api from '../../api/index';
import BigPostCard from '../commons/components/BigPostCard/BigPostCard';
import LoadIcon from '../commons/components/LoadIcon/LoadIcon';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
import queryString from 'query-string';

function SearchResult() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const search = queryString.parse(location.search);
    const [height, width] = useWindowHeightAndWidth();

    useEffect(() => {
        handleFetchPost(0);
    }, [search]);

    const handleFetchPost = async ({ selected }) => {
        const { data } = await api.searchApi({ q: search.q, skip: selected * 10 });
        setPosts(data);
    };
    if (!posts.length) {
        return <LoadIcon />;
    }
    return (
        <div className="search-page">
            <div className="search-page--paper shadow">
                <div className="search-page--paper--title end-block pd-left-3 pd-right-3">
                    <p>
                        Kết quả tìm kiếm cho: <span>{search.q}</span>
                    </p>
                </div>
                <div className="search-page--paper--posts pd-left-3 pd-right-3">
                    {posts.map((post) => (
                        <BigPostCard post={post} key={post.uuid} />
                    ))}
                </div>
                <div className={`profile-page--paper--content--pagi end-block ${posts.length <= 10 && 'dp-none'}`}>
                    <ReactPaginate
                        pageCount={Math.ceil(posts.length / 10)}
                        pageRangeDisplayed={width < 768 ? 0 : 3}
                        marginPagesDisplayed={width < 768 ? 0 : 1}
                        previousLabel={'Trang trước'}
                        nextLabel={'Tiếp theo'}
                        onPageChange={(selected) => handleFetchPost(selected)}
                        initialPage={0}
                        activeLinkClassName="click-page"
                        disableInitialCallback={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchResult;
