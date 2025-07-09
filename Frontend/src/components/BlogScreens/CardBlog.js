import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {

    const editDate = (createdAt) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(createdAt);
        var datestring = d.getDate() + " " +monthNames[d.getMonth()] + " ," + d.getFullYear() 
        return datestring
    }

    const truncateContent = (content) => {
        const trimmedString = content.substr(0, 73);
        return trimmedString
    }
    const truncateTitle= (title) => {
        const trimmedString = title.substr(0, 69);
        return trimmedString
    }
    
    return (

        <div className="blog-card">
            <Link to={`/blog/${blog.slug}`} className="blog-link">

                <img className=" blog-image" src={blog.image} alt={blog.title} />
                <div className="blog-content-wrapper">

                    <h5 className="blog-title">
                        
                    {blog.title.length > 76 ? truncateTitle(blog.title)+"..." : blog.title
                    
                    }
                    </h5>


                    <p className="blog-text"dangerouslySetInnerHTML={{__html : truncateContent( blog.content) +"..."}}>
                        </p>
                    <p className="blog-createdAt">{editDate(blog.createdAt)} 
                    </p>
                </div>
            </Link>
        </div>

    )
}

export default Blog;
