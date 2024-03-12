import React, {useSearchParams, useEffect} from 'react'
import { Link } from 'react-router-dom'

const PostSearchResult = (props) => {

    const { post } = props
    const url = `/posts/${post._id}`
    const navStyle = {
        color: 'black'
    }

    return (
        <>
            <div className='post-result-box'>
                <h3>
                    <Link style={navStyle} to={url} className='search-post-title'>Post: {post.title}</Link>
                </h3>
                <p>Likes: {post.score}</p>
            </div>
        </>
    )
}

export default PostSearchResult