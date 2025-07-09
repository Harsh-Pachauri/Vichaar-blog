import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Loader from '../GeneralScreens/Loader';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../Context/AuthContext';
import { AiFillLock } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import ReadListBlogItem from '../BlogScreens/ReadListBlogItem';
import '../../Css/ReadListPage.css';

const ReadListPage = () => {
  const navigate = useNavigate();
  const [readList, setReadList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { config, activeUser } = useContext(AuthContext);

  useEffect(() => {
    const getUserReadingList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/user/readList`, config);
        setReadList(res.data.readList || []);
      } catch (error) {
        console.error("Failed to fetch reading list:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    getUserReadingList();
  }, [config, navigate]);

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (loading) return <Loader />;

  return (
    <div className="Inclusive-readList-page">
      <Link to="/">
        <FiArrowLeft />
      </Link>
      <h2>Reading List</h2>

      <div className="readList-top-block">
        <img
          src={activeUser?.photo || '/default-avatar.png'}
          alt={activeUser?.username || 'User'}
        />
        <div className="activeUser-info-wrapper">
          <b>{activeUser?.username || 'User'}</b>
          <div>
            <span>{editDate(Date.now())}</span>
            <span>-</span>
            <span>{activeUser?.readListLength || 0} blogs</span>
            <i><AiFillLock /></i>
          </div>
        </div>
        <i className="BsThreeDots-icon"><BsThreeDots /></i>
      </div>

      <div className="readList-blog-wrapper">
        {readList.length > 0 ? (
          readList
            .filter(blog => blog?.author && blog?.author.username)
            .map(blog => (
              <ReadListBlogItem key={blog._id} blog={blog} editDate={editDate} />
            ))
        ) : (
          <div className="empty-readList">Reading List is empty</div>
        )}
      </div>
    </div>
  );
};

export default ReadListPage;
