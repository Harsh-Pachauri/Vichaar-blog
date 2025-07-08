import React, { useState, useEffect, useRef } from 'react';
import BlogComments from './BlogComments';
import axios from 'axios';
import AddComment from './AddComment';

const CommentSidebar = ({ slug, sidebarShowStatus, setSidebarShowStatus, activeUser }) => {

  const [count, setCount] = useState(0)
  const [commentlist, setCommentList] = useState([])

  const sidebarRef = useRef(null);

  useEffect(() => {
    getBlogComments()
  }, [setCommentList])


  const getBlogComments = async () => {
    try {
      const { data } = await axios.get(`https://vichaar-blog.onrender.com/comment/${slug}/getAllComment`)
      setCommentList(data.data)
      setCount(data.count)
    }
    catch (error) {
      console.log(error.response.data.error);
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = e => {

      if (sidebarShowStatus && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarShowStatus(false)
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [sidebarShowStatus])



  return (

    <div ref={sidebarRef} className={sidebarShowStatus ? "Inclusive-comment-sidebar visible" : "Inclusive-comment-sidebar hidden "}  >

      <div className='sidebar-wrapper'>

        <AddComment setSidebarShowStatus={setSidebarShowStatus} slug={slug} getBlogComments={getBlogComments} activeUser={activeUser} count={count} />

        <BlogComments commentlist={commentlist} activeUser={activeUser} count={count} />
      </div>

    </div>

  )
}

export default CommentSidebar;
