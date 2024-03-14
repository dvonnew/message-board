import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import LikePost from './LikePost'
import AddComment from '../Comments/AddComment'

const Post = (props) => {

    const [userContext, setUserContext] = useContext(UserContext)
    const [showCommentBox, setShowCommentBox] = useState({display: 'none'})
    const [post, setPost] = useState(props.post)
    const navStyle = {
        color: 'black'
    }

    const url = `/posts/${post._id}`
    const editUrl = `/posts/${post._id}/edit`

    const onDelete = (e) => {
        e.preventDefault()
        props.onDelete(post._id)
    }

    const onShowCommentBox = () => {
        setShowCommentBox({display: 'block'})
    }

    const onCancelComment = () => {
        setShowCommentBox({display: 'none'})
    }

    const reloadPost = (updatedPost) => {
        setPost(updatedPost)
    }
    
    return !userContext.details ? (
        <>
            <div className='post-box'>
                <h4>
                    <Link style={navStyle} to={url} className='post-title'>{post.title}</Link>
                </h4>
                <p>{post.body}</p>
                <p>Likes: {post.score}</p>
            </div>
            
        </>
    ) : (
        <>
            <div className='post-box'>
                <h4>
                    <Link style={navStyle} to={url} className='post-title'>{post.title}</Link>
                </h4>
                <div className='post-body'>
                    <p>{post.body}</p>
                </div>
                <p>Likes: {post.score}</p>
                <div className='user-post'>
                    <LikePost post={post._id} reloadPost={reloadPost}/>
                    <button className='comment-btn' onClick={onShowCommentBox}>Comment</button>
                    {post.user === userContext.details._id &&
                        <>
                            <Link to={editUrl}className="edit-btn">
                                <button className="edit-btn">Edit Post</button>
                            </Link>
                            <button className="delete-btn" onClick={onDelete}>Delete Post</button>
                        </>
                    }
                </div>
                <AddComment showCommentBox={showCommentBox} cancelComment={onCancelComment} postID={post._id}/>
            </div>
        </>
    )
    
}

export default Post