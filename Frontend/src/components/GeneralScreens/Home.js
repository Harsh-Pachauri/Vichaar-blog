import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkeletonBlog from "../Skeletons/SkeletonBlog";
import CardBlog from "../BlogScreens/CardBlog";
import NoBlogs from "../BlogScreens/NoBlogs";
import Pagination from "./Pagination";
import "../../Css/Home.css";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get('search');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://vichaar-blog.onrender.com/blog/getAllBlogs?search=${searchKey || ""}&page=${page}`);

        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        } else {
          navigate({
            pathname: '/',
            search: `${page > 1 ? `?page=${page}` : ""}`,
          });
        }

        setBlogs(data.data || []);
        setPages(Number.isInteger(data.pages) && data.pages > 0 ? data.pages : 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
        setPages(1);
        setLoading(false);
      }
    };
    getBlogs();
  }, [search, page]);

  useEffect(() => {
    setPage(1);
  }, [searchKey]);

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
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <CardBlog key={uuidv4()} blog={blog} />
              ))
            ) : (
              <NoBlogs />
            )}
            <img className="bg-vichaarsvg-svg" src="pen.svg" alt="vichaarsvg" />
            <img className="bg-vichaarsvg2-svg" src="bulb2.svg" alt="vichaarsvg" />
            <img className="bg-vichaarsvg3-svg" src="bulb2.svg" alt="vichaarsvg" />
          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
