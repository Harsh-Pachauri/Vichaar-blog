import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsThreeDots, BsBookmarkFill } from 'react-icons/bs';

const ReadListBlogItem = ({ blog, editDate }) => {
  const truncateContent = (content) => {
    return content?.substring(0, 130) || '';
  };

  return (
    <div className="readList-blog-item">
      <section>
        <div className="blog-top-block">
          <div className="readList-blog-author">
            {blog.author?.username || 'Unknown'}
          </div>
          <span>-</span>
          <div className="readList-blog-createdAt">
            {editDate(blog.createdAt)}
          </div>
          <i><AiFillStar /></i>
        </div>

        <div className="blog-med-block">
          <div className="readList-blog-title">
            <a href={`/blog/${blog.slug}`}>
              {blog.title}
            </a>
          </div>
          <div className="readList-blog-content">
            <span
              dangerouslySetInnerHTML={{ __html: truncateContent(blog.content) + "..." }}
            />
          </div>
        </div>

        <div className="blog-bottom-block">
          <a href={`/blog/${blog.slug}`}>
            <span>Read More</span>
            <span>-</span>
            <span>{blog.readtime || 1} min read</span>
          </a>

          <div>
            <i><BsBookmarkFill /></i>
            <i><BsThreeDots /></i>
          </div>
        </div>
      </section>

      <section>
        <div className="blog-Image-Wrap">
          <img
            src={blog.image || '/default-blog.png'}
            alt={blog.title}
            width="180"
          />
        </div>
      </section>
    </div>
  );
};

export default ReadListBlogItem;
