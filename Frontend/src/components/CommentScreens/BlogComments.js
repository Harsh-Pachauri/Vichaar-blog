import React from 'react';
import CommentItem from './CommentItem';
import '../../Css/BlogComments.css'

const BlogComments = ({ commentlist, count, activeUser }) => {

    return (
        <>
            {count !== 0 ?
                <div className='blogComments'>
                    <h5>MOST RELEVANT</h5>
                    <div className="comment-Wrapper">
                        {
                            commentlist.map((comment) => {
                                return (
                                    <CommentItem key={comment._id} comment={comment} activeUser={activeUser} />
                                )
                            })
                        }
                    </div>

                </div> :
                <div className='no-response'>There are currently no responses for this blog.
                    Be the first to respond. </div>
            }
        </>
    )
}

export default BlogComments;
