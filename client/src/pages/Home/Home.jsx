import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";

// import {} from '../../api/index';
import { getPosts } from "../../actions/post";
import LogoAndSearch from "../commons/components/LogoAndSearch/LogoAndSearch";
// import { usePosXAndPosY } from '../commons/custom/usePosXAndPosY';
import logo from "../../public/image/logo-home/cover.png";
import "./styles.sass";
import { useWindowHeightAndWidth } from "../commons/custom/useWindowHeightAndWidth";
import PostCard from "../commons/components/PostCard/PostCard";
import LoadIcon from "../commons/components/LoadIcon/LoadIcon";

function Home(props) {
  // const user = useSelector(state => state.user.authData);
  const posts = useSelector((state) => state.post.posts);
  const totalPosts = useSelector((state) => state.post.total);

  const [isSuggest, setIsSuggest] = useState(true);
  const [height, width] = useWindowHeightAndWidth();

  const dispatch = useDispatch();
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getPosts(0, 5));
    }
  }, []);

  const loadMoreSuggest = (skip) => {
    if (skip < totalPosts) {
      dispatch(getPosts(skip, 5));
    }
  };

  return (
    <div className="home-page">
      <div className="home-page--paper">
        {width > 768 && (
          <div className="home-page--paper--intro">
            <LogoAndSearch logoComponent={logo} position="content" />
            <Link
              to="/post/create"
              className="home-page--paper--intro--new-post"
            >
              <Button color="inherit">
                <AddRoundedIcon /> Thêm món mới
              </Button>
            </Link>
          </div>
        )}
        <div>
          <div
            onClick={() => setIsSuggest(true)}
            className={`home-page--paper--switch pointer ${
              isSuggest && "home-page--paper--focus"
            }`}
          >
            Khám phá
          </div>
          <div
            onClick={() => setIsSuggest(false)}
            className={`home-page--paper--switch pointer ${
              !isSuggest && "home-page--paper--focus"
            }`}
          >
            Đang theo dõi
          </div>
        </div>

        <div className="home-page--paper--content">
          <InfiniteScroll
            pageStart={0}
            loadMore={() => posts.length && loadMoreSuggest(posts.length)}
            hasMore={posts.length < totalPosts}
            loader={<LoadIcon />}
          >
            <Masonry
              items={posts}
              columnGutter={10}
              columnWidth={200}
              overscanBy={4}
              render={PostCard}
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

export default Home;
