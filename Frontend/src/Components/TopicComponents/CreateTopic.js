import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CreateTopic = () => {

    
    const initialState = {
        name: '',
        admin: ''
    }

    

    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ formData, setFormData ] = useState(initialState)
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'block' })
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({...prevState, [name]:value}))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setFormData((prevState) => ({...prevState, admin: userContext.details._id}))
        fetch('/api/topics/createtopic', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
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
                navigate(`/topics/${result.name}`, { replace: true })
            }, 2000)
        })
    }

    return !userContext.token ? (
        <>
            <div className='create-topic-page'>
                <h1>Create Topic</h1>
                <h4>Looks like you're not logged in. If you want to create a new topic please login into your account</h4>
                <Link to='/user/login'>
                    <p>Login</p>
                </Link>
            </div>
        </>
    ) : (
        <>
            <div className='create-topic-page'>
                <div className='create-topic-box'>
                    <h1>Create Topic</h1>
                    <form className='create-topic-form' onSubmit={onSubmit}>
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <input type='text' className='create-topic-input' placeholder='Topic Name Here!' name='name' value={undefined===formData ? '' : formData.name} onChange={handleChange}/>
                        <div className='create-topic-btn-box'>
                            <button type='submit' className='create-topic-btn'>Create your Topic!</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateTopic