import React, { useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext'

const ChangePassword = () => {
    const initialState = {
        current_password: "",
        new_password: "",
        confirm_password: "",
        errors: []
    }

    const [ successStyle, setSuccessStyle ] = useState({display: 'none'})
    const [ formStyle, setFormstyle ] = useState({ display: 'flex' })
    const [ validationErrors, setValidationErrors] = useState([])
    const [ errorStyle, setErrorStyle ] = useState({ display: 'none'})
    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ userPasswordData, setUserPasswordData ] = useState(initialState)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserPasswordData((prevState) => ({...prevState, [name]:value}))
    }

    const validateFormResults = () => {
        let errors = {}
        let formIsValid = true

        if (!userPasswordData.current_password) {
            formIsValid = false
            errors['current_password'] = '* Please enter your old password'
        }
        if (!userPasswordData.new_password) {
            formIsValid = false
            errors['new_password'] = '* Please enter your new password'
        }
        if (userPasswordData.new_password == userPasswordData.confirm_password) {
            formIsValid = false
            errors['new_password'] = '* New password cannont match your old password'
        }
        if (!userPasswordData.confirm_password) {
            formIsValid = false
            errors['confirm_password'] = '* Please confirm your password'
        }
        if (userPasswordData.confirm_password !== userPasswordData.new_password) {
            formIsValid = false
            errors['confirm_password'] = '* Confirmation does not match'
        }

        setUserPasswordData((prevState) => ({...prevState.errors, [prevState.errors]: errors}))
        return formIsValid
    }

    const onSubmit = (e) => {
        e.preventDefault(e)
        if(!validateFormResults) {
            return
        }
        fetch('/api/user/changepassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(userPasswordData)
        })
        .then((response) => 
            response.json()
        )
        .then((result) => {
            if(result.errors){
                for (let error in result.errors) {
                    setUserPasswordData(oldValues => {
                        return {...oldValues, errors : [{
                            [error.param] : error.msg
                         }]}
                    })
                }
                setErrorStyle({display: 'block'})
                console.log(result.errors)
                return
            }
            setSuccessStyle({ display: 'block'})
            setFormstyle({display: 'none'})
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
            <div className='change-password-page' >
                <div className='change-password-box' style={formStyle}>
                    <h1>Change Password</h1>
                    <form className='change-password-form' onSubmit={onSubmit}>
                        <ul style={errorStyle}>
                            {validationErrors.map((error, i) => (
                                <li className='errorMsg' key={i}>{error.msg}</li>
                            ))}
                        </ul>
                        <input type='password' name='current_password' className="change-password-prompt" placeholder='Password' required={true} value={undefined===userPasswordData ? '' : userPasswordData.current_password} onChange={handleChange}/>
                        <p className='errorMsg'>{!userPasswordData.errors.current_password ? '' : userPasswordData.errors.current_password}</p>
                        <input type='password' name='new_password' className="change-password-prompt" placeholder='Password' required={true} value={undefined===userPasswordData ? '' : userPasswordData.new_password} onChange={handleChange}/>
                        <p className='errorMsg'>{!userPasswordData.errors.new_password ? '' : userPasswordData.errors.new_password}</p>
                        <input type='password' name='confirm_password' className="change-password-prompt" placeholder='Confirm Password' required={true} value={undefined===userPasswordData ? '' : userPasswordData.confirm_password} onChange={handleChange}/>
                        <p className='errorMsg'>{!userPasswordData.errors.confirm_password ? '' : userPasswordData.errors.confirm_password}</p>
                        <div className='change-password-btn-box'>
                            <button type='submit' className='change-password-btn'>Change Password</button>
                        </div>
                    </form>
            </div>
            <div className='success-pop-up' style={successStyle}>
                <h1>Password Successful! Redirecting you back to your page...</h1>
            </div>
            </div>
        </>
    )

}

export default ChangePassword