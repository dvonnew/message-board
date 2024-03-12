import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'


const Login = (props) => {

    const initialState = {
        username: null,
        password: null,
        errors: {}
    }

    const [ loginInfo, setLoginInfo ] = useState(initialState)
    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'flex' })
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const [ userContext, setUserContext] = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        setErrorStyle({
            display: 'block',
            color: 'red'
        })
    }, [validationErrors])
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginInfo((prevState) => ({...prevState, [name]:value}))
    }

    const validateFormResults = () => {
        let errors = {}
        let formIsValid = true

        if (!loginInfo.username || loginInfo.username === null) {
            formIsValid = false
            errors['username'] = '*Please enter a valid username'
        }
        if (!loginInfo.password || loginInfo.password === null) {
            formIsValid = false
            errors['password'] = '*Please enter a valid password'
        }

        setLoginInfo((prevState) => ({...prevState.errors, [prevState.errors] : errors}))
        return formIsValid
    }

    const onLogin = (e) => {
        e.preventDefault()
        if(!validateFormResults) {
            return
        }

        fetch('/api/user/signin', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        })
        .then((response) => {
            if(!response.ok) {
                if (response.status === 400) {
                    console.log("Please enter a username and password")
                    return
                } else if (response.status === 401) {
                    console.log("Username and Password combination is invalid")
                    return
                }
                return
            } else{
                const data = response.json()

                setSuccessStyle({ display: 'block' })
                setFormstyle({ 
                    display: 'none',
                })
                setUserContext( oldValues => {
                    return {...oldValues, details: data.user, token: data.token}
                })
                setTimeout(() => {
                    navigate('/topics/all', { replace: true })
                    window.location.reload()
                }, 2000)
            }
        })
    }

    return(
        <>
            <div className='login-page' >
                <div className='login-box' style={formStyle}>
                    <h4>SIGN IN</h4>
                        <form className='login-form' onSubmit={onLogin}>
                            <ul style={errorStyle}>
                                {!validationErrors ? "" : validationErrors.map((error, i) => (
                                    <li className='errorMsg' key={i}>{error.msg}</li>
                                ))}
                            </ul>
                            <input type='text' name='username' className='login-input' placeholder='Username' value={!loginInfo ? "" : loginInfo.username} onChange={handleChange} required={true} />
                            <p className='errorMsg'>{!loginInfo.errors.username ? '': loginInfo.errors.username}</p>
                            <input type='password' name='password' className='login-input' placeholder='Password' value={!loginInfo? "" : loginInfo.password} onChange={handleChange} required={true} />
                            <div className='login-btn-box'>
                                <button type='submit' className='login-form-button'>Login</button>
                            </div>
                            <Link to='/user/sign-up'className='login-signup-link'>
                                <p >Not a member? Sign-up!</p>
                            </Link>
                        </form>
                </div>
                <div className='success-pop-up' style={successStyle}>
                    <h1>Login Successful! Redirecting you to the homepage...</h1>
                </div>
            </div>
        </>
    )
}

export default Login