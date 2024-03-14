import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'

const Comment = (props) => {

    const [ userContext, setUserContext ] = useContext(UserContext)
    

    useEffect(() => {
        console.log(props.commentData)
    },[])

    const onDelete = (e) => {
        e.preventDefault()
        props.onDelete(props.commentData._id)
    }
    
    return !userContext.details ? (
        <>
            <div className='comment-box'>
                <p>{props.commentData.body}</p>
                <div className='comment-sub-box'>
                    <p>{props.commentData.author} - {props.commentData.modified_date}</p>
                </div>
            </div>
        </>
    ) : (
        <>
            <div className='comment-box'>
                <p>{props.commentData.body}</p>
                <div className='comment-sub-box'>
                    <p>{props.commentData.author} - {props.commentData.modified_date}</p>
                    <button className='delete-btn' onClick={onDelete}>Delete Comment</button>
                </div>
            </div>
        </>
    )
}

export default Comment