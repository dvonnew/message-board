import React, {useContext, userContext, useState, useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'

const DeleteUser = () => {

    const initialState = {
        username: null,
        password: null,
        errors: {}
    }

    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ userData, setUserData ] = useState(initialState)
    const [ errorStyle, setErrorStyle ] = useState()
    const [ validationErrors, setValidationErrors ] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        setErrorStyle({
            display: 'block',
            color: 'red'
        })
    }, [validationErrors])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prevState) => ({...prevState, [name] : value}))
    }

    const validateFormResults = () => {
        let errors = {}
        let formIsValid = true

        if (!userData.username || userData.username === null) {
            formIsValid = false
            errors['username'] = '*Please enter a valid username'
        }
        if (!userData.password || userData.password === null) {
            formIsValid = false
            errors['password'] = '*Please enter a valid password'
        }

        setUserData((prevState) => ({...prevState.errors, [prevState.errors] : errors}))
        return formIsValid
    }

    const onDelete = (e) => {
        e.preventDefault()
        if(!validateFormResults) {
            return
        }
        fetch('/api/user/delete', {
            method: "DELETE",
            headers: {
                'Content-type' : 'application/json',
                Authorization: `Bearer ${userContext.token}`
            }
        })
        .then((response) => {
            if(!response.ok) {
                let errors = {}
                errors['username'] = '*Deletion unsuccessful could not find user'
                setUserData((prevState) => ({...prevState, [prevState.errors] : errors}))
                return
            }
            else {
                setUserContext(oldValues => {
                    return { ...oldValues, details: undefined, token: null}
                })
                window.localStorage.setItem("logout", Date.now())
                setTimeout(() => {
                    navigate('/topics/all', { replace: true })
                }, 2000)
            }
        })
    }

    return (
        <>
            <div className='delete-profile-page' >
                <div className='delete-profile-box' >
                    <h6>
                        If you're sure you would like to delete your account please type in your username and password
                    </h6>
                    <form className='delete-profile-form' onSubmit={onDelete}>
                        <input type='text' name='username' className='delete-profile-input' placeholder='Username' value={userData.username} onChange={handleChange} required={true} />
                        <p className='errorMsg'>{!userData.errors.username ? '': userData.errors.username}</p>
                        <input type='password' name='password' className='delete-profile-input' placeholder='Password' value={userData.password} onChange={handleChange} required={true} />
                        <div className='delete-profile-btn-box'>
                            <button type='submit' className='delete-profile-btn'>Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default DeleteUser