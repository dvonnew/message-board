import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../../Context/userContext";

const LikePost = (props) => {

    const [showLike, setShowLike] = useState({display: 'block'})
    const [showUnlike, setShowUnlike] = useState({display: 'none'})
    const [ userContext, setUserContext ] = useContext(UserContext)
    const [post, setPost] = useState({post: props.post})

    useEffect(() => {
        if(userContext.details && userContext.details.upvoted_posts.includes(props.post)) {
            setShowLike({display:'none'})
            setShowUnlike({display: 'block'})
        }
    }, [])

    const onLike = (e) => {
        e.preventDefault()
        fetch('/api/posts/likepost', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(post)
        }).then(async res => {
            if(res.ok) {
                setShowUnlike({display: 'block'})
                setShowLike({display: 'none'})
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, details: data.user}
                })
                props.reloadPost(data.post)
            }
        })
        
    }

    const onUnlike = (e) => {
        e.preventDefault()
        fetch('/api/posts/unlikepost', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(post)
        }).then(async res => {
            if(res.ok) {
                setShowUnlike({display: 'none'})
                setShowLike({display: 'block'})
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, details: data.user}
                })
                props.reloadPost(data.post)
            }
        })
    }

    return (
        <>
            <button className='like-post-btn' style={showLike} onClick={onLike}> Like </button>
            <button className='unlike-post-btn'  style={showUnlike} onClick={onUnlike}> Unlike </button>
        </>
    )

}

export default LikePost