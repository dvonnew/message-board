import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const EditPost = (props) => {

    const initialState = {
        title: "",
        body: ""
    }


    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'block' })
    const [ formData, setFormData ] = useState(initialState)
    const [ post, setPost ] = useState()
    const [ validationErrors, setValidationErrors ] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const routeParams = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/posts/${routeParams.id}`, {
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => res.json())
        .then((data) => {setFormData({
            title: data.title,
            body: data.body
        })
        setPost(data)})
        .catch(err => console.error(err))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({...prevState, [name]:value}))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/posts/${post._id}/edit`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json())
        .then((result) => {
            if(result.errors){
                setValidationErrors(result.errors)
                return
            }
            setSuccessStyle({display: 'block'})
            setFormstyle({
                display: 'none'
            })
            setTimeout(() => {
                navigate(`/posts/${result._id}`, { replace: true })
            }, 2000)
        })
    }

    const onCancel = (e) => {
        setFormstyle({display:'none'})
    }

    const onConfirmCancel = (e) => {

    }

    return !userContext.token ? (
        <>
            <div className='create-post-page'>
                <h1>Edit Post</h1>
                <h4>Looks like you're not logged in. If you want to edit this post please login into your account</h4>
                <Link to='/user/login'>
                    <p>Login</p>
                </Link>
            </div>
        </>
    ) : (
        <>
            <div className='create-post-page' style={formStyle}>
                <div className='create-post-box'>
                    <h1>Edit Post</h1>
                    <form className='create-post-form' onSubmit={onSubmit}>
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <input type='text' name='title' className='create-post-input' required={true} value={undefined===formData ? '' : formData.title} onChange={handleChange} />
                        <textarea type='textarea' className='create-post-textarea' placeholder='Type your post out here!' name='body' value={undefined===formData ? '' : formData.body} required={true} onChange={handleChange}/>
                        <button type='submit' className='create-post-btn'>Post!</button>
                    </form>
                </div>
            </div>
            <div className='success-pop-up' style={successStyle}>
                <h1>Post Successful! Redirecting you there...</h1>
            </div>
        </>
    )
}

export default EditPost