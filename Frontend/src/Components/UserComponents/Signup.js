import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'

const Signup = (props) => {

    const initialState = {
        first_name: null,
        last_name: null,
        username: null,
        email: null,
        password: null,
        confirm_password: null,
        membershipStatus: "free",
        errors: {}
    }

    const [ userData, setUserData ] = useState(initialState)
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'flex' })
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const [ redirect, setRedirect ] = useState(false)
    const [ userContext, setUserContext ] = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        setErrorStyle({
            display: 'block',
            color: 'red'
        })
    }, [validationErrors])

    useEffect(() => {
        if(redirect) {
            setTimeout(() => {
                navigate('/topics/all', { replace: true })
            }, 3000)
        }
    }, [redirect])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prevState) => ({...prevState, [name]:value}))
    }

    const validateFormResults = () => {
        let errors = {}
        let formIsValid = true

        if (!userData.username) {
            formIsValid = false
            errors['username'] = '*Please enter a valid username'
        }
        if (!userData.email) {
            formIsValid = false
            errors['email'] = '*Please enter your email'
        }
        if (!userData.first_name) {
            formIsValid = false
            errors['first_name'] = '*Please enter your First Name'
        }
        if (!userData.last_name) {
            formIsValid = false
            errors['last_name'] = '*Please enter your Last Name'
        }
        if(!userData.password) {
            formIsValid = false
            errors['password'] = '*Please enter in a password'
        }
        if(!userData.password) {
            formIsValid = false
            errors['confirm_password'] = '*Please confirm your password'
        }
        if(userData.password !== userData.confirm_password) {
            formIsValid = false
            errors['confirm_password'] = '*Confirmation Password does not match Password'
        }

        setUserData((prevState) => ({...prevState.errors, [prevState.errors]: errors}))
        return formIsValid
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(!validateFormResults){
            return
        }
        
        fetch('/api/user/signup', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.errors){
                setValidationErrors(result.errors)
                return
            }
            setSuccessStyle({ display: 'block' })
            setFormstyle({ 
                display: 'none',
            })
            setUserContext(oldValues => {
                return {...oldValues, token: result.token}
            })
            setRedirect(true)   
        })
    }

    return (
        <>
            <div className='user-signup-page' >
                <div className='user-signup-box' style={formStyle}>
                    <h1>User Sign-up</h1>
                    <form className='user-signup-form' onSubmit={onSubmit}>
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <input type='text' name='username' className="user-signup-prompt" placeholder='Username' required={true} value={undefined===userData ? '' : userData.username} onChange={handleChange} />
                        <p className='errorMsg'>{!userData.errors.username ? '' : userData.errors.username}</p>
                        <input type='text' name='first_name' className="user-signup-prompt" placeholder='First Name' required={true} value={undefined===userData ? '' : userData.first_name} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.first_name ? '' : userData.errors.first_name}</p>
                        <input type='text' name='last_name' className="user-signup-prompt" placeholder='Last Name' required={true} value={undefined===userData ? '' : userData.last_name} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.last_name ? '' : userData.errors.last_name}</p>
                        <input type='email' name='email' className="user-signup-prompt" placeholder='Email' required={true} value={undefined===userData ? '' : userData.email} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.email ? '' : userData.errors.email}</p>
                        <input type='password' name='password' className="user-signup-prompt" placeholder='Password' required={true} value={undefined===userData ? '' : userData.password} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.password ? '' : userData.errors.password}</p>
                        <input type='password' name='confirm_password' className="user-signup-prompt" placeholder='Confirm Password' required={true} value={undefined===userData ? '' : userData.confirm_password} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.confirm_password ? '' : userData.errors.confirm_password}</p>
                        <div className='signup-btn-box'>
                            <button type='submit' className='user-signup-btn'>Create User</button>
                        </div>
                    </form>
            </div>
            <div className='success-pop-up' style={successStyle}>
                <h1>Sign-up Successful! Redirecting you to the homepage...</h1>
            </div>
            </div>
        </>
    )
}

export default Signup