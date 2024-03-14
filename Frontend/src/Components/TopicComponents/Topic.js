import React, { useState, useEffect, useContext,  } from 'react'
import { UserContext } from '../../Context/userContext'
import Post from '../PostComponents/Post'
import Delete from '../PostComponents/DeletePost'
import JoinTopic from '../UserComponents/Join'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'




const Topic = () => {

    const [userContext, setUserContext] = useContext(UserContext)
    const [showDelete, setShowDelete] = useState({display: 'none'})
    const [postID, setPostID] = useState() 
    const routeParams = useParams()
    const [topic, setTopic] = useState(routeParams.topicname)
    const navigate = useNavigate()
   
    const [pageData, setPageData] = useState({
        topic: null,
        posts: []
    })

    useEffect(() => {
        if(!topic) {
            fetch(`/api/topics/all`, {
                headers: {'Content-Type': 'application/json'},
            })
            .then((res) => res.json())
            .then((data) => {setPageData({
                topic: data.topic,
                posts: data.posts
            })})
            .catch(error => console.log(topic))
        } 
        else {
            fetch(`/api/topics/${topic}`, {
                headers: {'Content-Type': 'application/json'},
            })

            .then((response) => {
                if (!response.ok) {
                    navigate('/error', {replace: true})
                } 
                return response.json()
            })
            .then((data) => {
                setPageData({
                    topic: data.topic,
                    posts: data.posts
            })})
            .catch(error => console.log(error))
        }
    }, [topic])

    //useEffect for showJoin and showLeave tied to both of them, checks against the userContext to see if item should be shown or not

    const onDelete = (id) => {
        setPostID(id)
        setShowDelete({display: 'block'})
    }

    const onCancel = (e) => {
        setShowDelete({display: 'none'})
    }

    const deleteSuccess = () => {
        setShowDelete({display:'none'})
    }

    return !userContext.details || !pageData.topic ? (
        <>
            <div className='topic-page'>
                <div className='topic-header'>
                    <h1 className='topic-title'>{!pageData.topic ? "Loading..." : pageData.topic.name}</h1>
                </div>               
                <div className='topic-body'>
                    {!pageData.posts || pageData.posts.length() < 1 ? "No post yet!" : pageData.posts.map(post => (
                        <Post post={post} key={post._id} />
                    ))}
                </div>

            </div>
        </>
    ) : (
        <>
            <div className='topic-page'>
                <div className='topic-header'>
                    <h1 className='topic-title'>{!pageData.topic ? "Loading..." : pageData.topic.name}</h1>
                    <JoinTopic topic={!pageData ? '' : pageData.topic} />
                </div>
                <div className='topic-body'>
                    <Delete showDelete={showDelete} onCancel={onCancel} id={postID} deleteSuccess={deleteSuccess}/>
                    {!pageData.posts || pageData.posts.length() < 1 ? "No posts yet!" : pageData.posts.map(post => (
                        <Post post={post} key={post._id} onDelete={onDelete}/>
                    ))}
                </div>
            </div>
        </>
    ) 
}

export default Topic