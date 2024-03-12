import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'

const Signup = (props) => {

    const initialState = {
        first_name: "",
        last_name: "",
        email:"",
        birth_date: "",
        errors: {}
    }

    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'flex' })
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ userData, setUserData ] = useState(initialState)
    const navigate = useNavigate()

    useEffect (() => {
        setUserData({
            first_name: userContext.details.first_name,
            last_name: userContext.details.last_name,
            email: userContext.details.email,
            birth_date: "",
            errors: {}
        })
    },[userContext])

    useEffect(() => {
        setErrorStyle({
            display: 'block',
            color: 'red'
        })
    }, [validationErrors])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prevState) => ({...prevState, [name]:value}))
    }

    const validateFormResults = () => {
        let errors = {}
        let formIsValid = true

        if (!userData.email) {
            formIsValid = false
            errors['email'] = '* Please enter your email'
        }
        if (!userData.first_name) {
            formIsValid = false
            errors['first_name'] = '* Please enter your First Name'
        }
        if (!userData.last_name) {
            formIsValid = false
            errors['last_name'] = '* Please enter your Last Name'
        }

        setUserData((prevState) => ({...prevState.errors, [prevState.errors]: errors}))
        return formIsValid
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(!validateFormResults){
            return
        }
        fetch('/api/user/update', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(userData)
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.errors){
                setValidationErrors(result.errors)
                setErrorStyle({display:'block'})
                return
            }
            setSuccessStyle({ display: 'block' })
            setFormstyle({ display: 'none'})
            setUserContext(oldValues => {
                return {...oldValues, details: result}
            })
            setTimeout(() => {
                navigate(`/user/profile`, { replace: true })
            }, 3000)  
        })
    }

    return (
        <>
            <div className='user-update-page' >
                <div className='user-update-box' style={formStyle}>
                    <h1>Update User</h1>
                    <form className='user-update-form' onSubmit={onSubmit}>
                        
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <input type='text' name='first_name' className="user-update-prompt" placeholder='First Name' required={true} value={undefined===userData ? '' : userData.first_name} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.first_name ? '' : userData.errors.first_name}</p>
                        <input type='text' name='last_name' className="user-update-prompt" placeholder='Last Name' required={true} value={undefined===userData ? '' : userData.last_name} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.last_name ? '' : userData.errors.last_name}</p>
                        <input type='email' name='email' className="user-update-prompt" placeholder='Email' required={true} value={undefined===userData ? '' : userData.email} onChange={handleChange}/>
                        <p className='errorMsg'>{!userData.errors.email ? '' : userData.errors.email}</p>
                        <label>Birthday:</label>
                        <input type='date' name='birth_date' className="user-update-prompt" placeholder='Birth Date' value={undefined===userData ? '' : userData.birth_date} onChange={handleChange}/>
                        <div className='update-btn-box'>
                            <button type='submit' className='user-update-btn'>Update User</button>
                        </div>
                    </form>
            </div>
                <div className='success-pop-up' style={successStyle}>
                    <h1>Update Successful! Redirecting back to your page...</h1>
                </div>
            </div>
        </>
    )
}

export default Signup