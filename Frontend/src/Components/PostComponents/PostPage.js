import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import Delete from '../PostComponents/DeletePost'
import LikePost from './LikePost'
import Comment from '../Comments/Comment'
import AddComment from '../Comments/AddComment'
import DeleteComment from '../Comments/DeleteComment'

const PostPage = (props) => {

    const initialState = {
        title: '',
        body:'',
        score: ''
    }
    const [post, setPost] = useState({
        post: initialState,
        comments: []
    })
    const [userContext, setUserContext] = useContext(UserContext)
    const [showDelete, setShowDelete] = useState({display: 'none'})
    const [ showDeleteComment, setShowDeleteComment] = useState({display: 'none'})
    const routeParams = useParams()
    const [ postID, setPostID ] = useState(routeParams.id)
    const [showCommentBox, setShowCommentBox] = useState({display: 'none'})
    const [ commentID, setCommentID ] = useState()
    const navStyle = {
        color: 'black'
    }

    const editUrl = `/posts/${postID}/edit`

    useEffect(() => {
        fetch(`/api/posts/${routeParams.id}`, {
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => res.json())
        .then((data) => {setPost({
            post: data.post,
            comments: data.comments
            })
        })
        .then( console.log(post))
        .catch(err => console.error(err)) 
    }, [])

    const onDelete = (id) => {
        setShowDelete({display: 'block'})
    }

    const onCancelPostDelete = (e) => {
        setShowDelete({display: 'none'})
    }

    const deleteSuccess = () => {
        setShowDelete({display:'none'})
    }

    const reloadPost = (updatedPost) => {
        setPost(prevState => {
            return {...prevState, post: updatedPost}
        })
    }

    const onShowCommentBox = () => {
        setShowCommentBox({display: 'block'})
    }

    const onCancelComment = () => {
        setShowCommentBox({display: 'none'})
        setShowDeleteComment({display: 'none'})
    }

    const onDeleteComment = (id) => {
        setShowDeleteComment({display: 'block'})
        setCommentID(id)
    }

    return !userContext.details ? (
        <>
            <div className='post-page'>
                <div className='post-header'>
                    <h4>
                    {!post ? "Loading Post...": post.post.title}
                    </h4>
                </div>
                <div className='post-page-body'>
                    <div className='post-body'>
                        <p>{!post ? "loading Post...": post.post.body}</p>
                    </div>
                    <div className='comment-section'>
                        <h5>Comments</h5>
                        {!post || post.comments.length===0 ? "Grabbing any comments that might go to this post!" : post.comments.map(comment => (
                            <Comment commentData={comment} key={comment._id} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
            <div className='post-page'>
                <Delete showDelete={showDelete} onCancel={onCancelPostDelete} id={!post.post ? '' : post.post._id} deleteSuccess={deleteSuccess}/>
                <div className='post-header'>
                    <h4>
                        {!post ? "Loading Post...": post.post.title}
                    </h4>
                </div>
                <div className='post-page-body'>
                    <div className='post-body'>
                        <p>{!post ? "loading Post...": post.post.body}</p>
                    </div>
                    <p>Likes: {!post ? '': post.post.score}</p>
                    <div className='user-post'>
                        <LikePost post={postID} reloadPost={reloadPost}/>
                        <button className='comment-btn' onClick={onShowCommentBox}>Comment</button>
                        <AddComment showCommentBox={showCommentBox} cancelComment={onCancelComment} postID={postID}/>
                        {!post ? "": post.post.user === userContext.details._id &&
                            <>
                                <Link to={editUrl} className='edit-btn'>
                                    <button className="edit-btn">Edit Post</button>
                                </Link>
                                <button className="delete-btn" onClick={onDelete}>Delete Post</button>
                            </>
                        }
                    </div>
                    <div className='comment-section'>
                        <h5>Comments</h5>
                        <DeleteComment showDelete={showDeleteComment} onCancel={onCancelComment} id={commentID} deleteSuccess={deleteSuccess}/>
                        {!post || post.comments.length===0 ? "Grabbing any comments that might go to this post!" : post.comments.map(comment => (
                            <Comment onDelete={onDeleteComment} commentData={comment} key={comment._id} />
                        ))}
        
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostPage