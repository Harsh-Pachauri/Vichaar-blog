import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailBlog.css"
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';

const DetailBlog = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [blog, setBlog] = useState({})
  const [blogLikeUser, setBlogLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [blogReadListStatus, setBlogReadListStatus] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    const getDetailBlog = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`/blog/${slug}`, { activeUser })
        setBlog(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setBlogLikeUser(data.data.likes)
        setLoading(false)

        const blog_id = data.data._id;

        if (activeUser.readList) {

          if (!activeUser.readList.includes(blog_id)) {
            setBlogReadListStatus(false)
          }
          else {
            setBlogReadListStatus(true)

          }

        }

      }
      catch (error) {
        setBlog({})
        navigate("/not-found")
      }

    }
    getDetailBlog();

  }, [slug, setLoading])



  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus)
    }, 1500)

    try {
      const { data } = await axios.post(`/blog/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setLikeCount(data.data.likeCount)
      setBlogLikeUser(data.data.likes)

    }
    catch (error) {
      setBlog({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await axios.delete(`/blog/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addBlogToReadList = async () => {

    try {

      const { data } = await axios.post(`/user/${slug}/addBlogToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setBlogReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <>

            <div className='Inclusive-detailBlog-page'>

              <div className="top_detail_wrapper">
                <Link to={'/'} >
                  <FiArrowLeft />
                </Link>
                <h5>{blog.title}</h5>

                <div className='blog-general-info'>

                  <ul>
                    {blog.author &&
                      <li className='blog-author-info'>
                        <img src={`/userPhotos/${blog.author.photo}`} alt={blog.author.username} />
                        <span className='blog-author-username'>{blog.author.username}  </span>
                      </li>
                    }
                    <li className='blog-createdAt'>
                      {
                        editDate(blog.createdAt)
                      }
                    </li>
                    <b>-</b>

                    <li className='blog-readtime'>
                      {blog.readtime} min read

                    </li>

                  </ul>

                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>

                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>


                      <b className='commentCount'>{blog.commentCount}</b>

                    </div>
                  }

                  {activeUser && blog.author &&
                    blog.author._id === activeUser._id ?
                    <div className="top_blog_transactions">
                      <Link className='editBlogLink' to={`/blog/${blog.slug}/edit`}>
                        <FiEdit />
                      </Link>
                      <span className='deleteBlogLink' onClick={handleDelete}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>

              </div>

              <div className="CommentFieldEmp">

                <CommentSidebar slug={slug} sidebarShowStatus={sidebarShowStatus} setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser}
                />

              </div>

              <div className='blog-content' >

                <div className="blog-banner-img">
                  <img src={`/blogImages/${blog.image}`} alt={blog.title} />

                </div>

                <div className='content' dangerouslySetInnerHTML={{ __html: (blog.content) }}>
                </div>

              </div>

              {activeUser.username &&
                <div className='fixed-blog-options'>

                  <ul>
                    <li>

                      <i onClick={handleLike} >

                        {likeStatus ? <FaHeart color="#7f4e45" /> :
                          <FaRegHeart />
                        }
                      </i>

                      <b className='likecount'
                        style={likeStatus ? { color: "#7f4e45" } : { color: "rgb(99, 99, 99)" }}
                      >  {likeCount}
                      </b>

                    </li>


                    <li>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>

                      <b className='commentCount'>{blog.commentCount}</b>

                    </li>

                  </ul>

                  <ul>
                    <li>
                      <i onClick={addBlogToReadList}>

                        {blogReadListStatus ? <BsBookmarkFill color='#cd670e' /> :
                          <BsBookmarkPlus />
                        }
                      </i>
                    </li>

                    <li className='BsThreeDots_opt'>
                      <i  >
                        <BsThreeDots />
                      </i>

                      {activeUser &&
                        blog.author._id === activeUser._id ?
                        <div className="delete_or_edit_blog  ">
                          <Link className='editBlogLink' to={`/blog/${blog.slug}/edit`}>
                            <p>Edit Blog</p>
                          </Link>
                          <div className='deleteBlogLink' onClick={handleDelete}>
                            <p>Delete Blog</p>
                          </div>
                        </div> : null
                      }

                    </li>

                  </ul>

                </div>
              }

            </div>
          </>
      }
    </>
  )
}

export default DetailBlog;
