import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'

const UserProfile = () => {

    const [ userContext, setUserContext ] = useContext(UserContext)

    return !userContext.details ? (
        <>
        </>
    ) :(
        <>
            <div className='user-profile-page'>
                <h1>{userContext.details.username}</h1>
                <hr></hr>
                <div className='user-info-box'>
                    <h4>Name: {userContext.details.first_name} {userContext.details.last_name}</h4>
                    <h4>Contact Information:</h4>
                    <ul>
                        <li>Email: {userContext.details.email}</li>
                    </ul>
                    <h5>Account Maintenance:</h5>
                    <ul>
                        <li>
                            <Link to='/user/profile/update' >
                                Update Profile
                            </Link>
                        </li>
                        <li>
                            <Link to='/user/profile/changepassword'>
                                Change Password
                            </Link>
                        </li>
                        <li>
                            <Link to ='/user/profile/delete'>
                                Delete User
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </>
    )
}

export default UserProfile