import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {

    const initialState = {
        topic: '',
        title: '',
        body: ''
    }

    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ topics, setTopics ] = useState()
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'block' })
    const [formData, setFormData] = useState(initialState)
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/posts/getalltopics', {
            headers: {'Content-Type': 'application/json'},
        })
        .then((res) => res.json())
        .then((data) => setTopics(data.topics))
        .catch(error => console.error(error))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({...prevState, [name]:value}))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        fetch('/api/posts/createpost', {
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

    return !userContext.token ? (
        <>
            <div className='create-post-page'>
                <h1>Create Post</h1>
                <h4>Looks like you're not logged in. If you want post please login into your account</h4>
                <Link to='/user/login'>
                    <p>Login</p>
                </Link>
            </div>
        </>
    ) : (
        <>
            <div className='create-post-page' style={formStyle}>
                <div className='create-post-box'>
                    <h1>Create Post</h1>
                    <form className='create-post-form' onSubmit={onSubmit}>
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <label>Select a topic to post in:</label>
                        <select type='select' className='create-post-input' placeholder='Select a Topic!' name='topic' required={true} onChange={handleChange}>
                            {!topics ? "" : topics.map(topic => (
                                <option value={topic._id} key={topic._id}>{topic.name}</option>
                            ))}
                        </select>
                        <input type='text' name='title' className='create-post-input' placeholder='Post Title' required={true} value={undefined===formData ? '' : formData.title} onChange={handleChange} />
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

export default CreatePost