import React, {useEffect, useState} from 'react'
import { UserContext } from '../../Context/userContext'

const DeleteComment = (props) => {

    const { id, showDelete } = props
    const [confirmation, setConfimration] = useState(false)
    const [confirmationStyle, setConfimrationStyle] = useState({display: 'block'})
    const [successStyle, setSuccessStyle] = useState({display: 'none'})
    
    // useEffect(() => {
    //     if(confirmation) {
    //         deletePost()
    //     }
    // }, [confirmation])

    // const deletePost = () => {
    //     fetch(`/api/comments/${id}/delete`, {
    //         method: 'DELETE',
    //     })
    //     .then((res) => {
    //         if(!res.ok) {
    //             console.log("deletion failed")
    //             return
    //         }
    //         setConfimrationStyle({display: 'none'})
    //         setSuccessStyle({display:'block'})
    //         setTimeout(() => {
    //             props.deleteSuccess()
    //             window.location.reload(false)
    //         }, 2000)
    //     })
    // }

    const onDelete = (e) => {
        e.preventDefault()
        setConfimration(true)
    }

    const onCancel = (e) => {
        e.preventDefault()
        props.onCancel()
    }

    return (
        <>
            <div className='delete-box' style={showDelete}>
                <div className="delete-confirmation" style={confirmationStyle}>
                    <h6>
                        Are you sure you want to delete this comment?
                    </h6>
                    <div className="delete-confirmation-btns">
                        <button onClick={onDelete}>Delete</button>
                        <button onClick={onCancel}>Cancel</button>
                    </div>
                </div>
                <div className='delete-success' style={successStyle}>
                    <h6>Your post has been deleted!</h6>
                </div>
            </div>
        </>
    )
}

export default DeleteComment