import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { useNavigate } from 'react-router-dom'

const AddComment = (props) => {

    const [ userContext, setUserContext] = useContext(UserContext)
    const initialState = {
        post: props.postID,
        body: "",
        author: userContext.details._id
    }
    const { showCommentBox, postID } = props
    const [ comment, setComment ] = useState(initialState)
    const [ validationErrors, setValidationErrors ] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const navigate = useNavigate()

    const onCancelComment = () => {
        props.cancelComment()
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setComment((prevState) => ({...prevState, [name]: value}))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        fetch('/api/comments/createcomment', {
            method: 'POST',
            headers: { 
                'Content-type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(comment)
        }).then((response) => response.json())
        .then((res) => {
            if(!res.ok) {
                setValidationErrors(res.errors)
                return
            } else {
                setSuccessStyle({display: 'block'})
                props.cancelComment()
                setTimeout(() => {
                    navigate(`/posts/${props.postID}`, { replace: true })
                }, 2000)
            }
            
        })
    }


    return (
        <>
            <div className="add-comment-box" style={showCommentBox}>
                <form onSubmit={onSubmit} className='add-comment-form'>
                    {!validationErrors || <ul style={errorStyle}>
                        {validationErrors.map((error, i) => (
                            <li className='errorMsg' key={i}>{error.msg}</li>
                        ))}
                    </ul>}
                    <input type='textarea' className='add-comment-input' placeholder="Type comment out here!" name='body' onChange={handleChange} required={true} value={undefined===comment ? '' : comment.body}/>
                    <button type='submit' className='add-comment-btn'>Comment!</button>
                    <button className='cancel-comment-btn' onClick={onCancelComment}>Cancel Comment</button>
                </form>
            </div>
        </>
    )
}

export default AddComment