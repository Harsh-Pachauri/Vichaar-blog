import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SkeletonBlog from "../Skeletons/SkeletonBlog";
import CardBlog from "../BlogScreens/CardBlog";
import NoBlogs from "../BlogScreens/NoBlogs";
import Pagination from "./Pagination";

import "../../Css/Home.css";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get("search");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/blog/getAllBlogs?search=${searchKey || ""}&page=${page}`
        );

        setBlogs(data.data);
        setPages(data.pages);
        setLoading(false);

        // Update URL
        navigate({
          pathname: "/",
          search: `${searchKey ? `?search=${searchKey}` : ""}${page > 1 ? `&page=${page}` : ""}`,
        });
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    getBlogs();
  }, [searchKey, page, navigate]);

  return (
    <div className="Inclusive-home-page">
      {loading ? (
        <div className="skeleton_emp">
          {[...Array(6)].map(() => (
            <SkeletonBlog key={uuidv4()} />
          ))}
        </div>
      ) : (
        <div>
          <div className="blog-card-wrapper">
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog) => (
                <CardBlog key={uuidv4()} blog={blog} />
              ))
            ) : (
              <NoBlogs />
            )}

            {/* Background SVGs */}
            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />
          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
