import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../Context/userContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchComponents/SearchBar'
import UserNavFav from './UserFavNav'

const Nav = () => {

    const [userContext, setUserContext] = useContext(UserContext)
    const navigate = useNavigate()
    

    const onLogout = (e) => {
        e.preventDefault()
        fetch('/api/user/logout', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            }
        }).then(async response => {
            setUserContext(oldValues => {
                return { ...oldValues, details: undefined, token: null}
            })
            window.localStorage.setItem("logout", Date.now())
            setTimeout(() => {
                navigate('/topics/all', { replace: true })
            }, 2000)
        })
    }

    return !userContext.token ? (
        <>
            <nav className='nav-bar'>
                <div className='nav-box'>
                <SearchBar />
                    <div className='topic-nav'>
                        <ul className='topic-nav-list' >
                            <li className='topic-nav-item'>
                                <Link to='/' reloadDocument className='nav-link'>
                                    <p>Home</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item'>
                                <Link to='/' reloadDocument className='nav-link'>
                                    <p>All</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item'>
                                <Link to='/topics/popular' reloadDocument className='nav-link'>
                                    <p>Popular</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item' >
                                <Link to='/topics/latest' reloadDocument className='nav-link'>
                                    <p>Latest</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='post-nav'>
                        <ul className='post-nav-list'>
                            <li className='post-nav-item'>
                                <Link to='posts/createpost' className='nav-link'>
                                    <p>+ Create Post</p>
                                </Link>
                            </li>
                            <li className='post-nav-item'>
                                <Link to='/topics/create' className='nav-link'>
                                    <p>+ Create Topic</p>
                                </Link>
                            </li>
                        </ul>
                    </div>    
                    <div className='user-nav'>
                        <ul className='user-nav-list'>
                            <li className='user-nav-item'>
                                <Link to='user/login' className='nav-link'>
                                    <p>Login</p>
                                </Link>
                            </li>
                            <li className='user-nav-item'>
                                <Link to='/user/sign-up' className='nav-link'>
                                    <p>Sign-up</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    ) : (
        <>
            <nav className='nav-bar'>
                <div className='nav-box'>
                    <SearchBar />
                    <div className='topic-nav'>
                        <ul className='topic-nav-list' >
                            <li className='topic-nav-item'>
                                <Link to='/' reloadDocument className='nav-link'>
                                    <p>Home</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item'>
                                <Link to='/' reloadDocument className='nav-link'>
                                        <p>All</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item'>
                                <Link to='/topics/popular' reloadDocument className='nav-link'>
                                    <p>Popular</p>
                                </Link>
                            </li>
                            <li className='topic-nav-item' >
                                <Link to='/topics/latest' reloadDocument className='nav-link'>
                                    <p>Latest</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <UserNavFav />
                    <div className='post-nav'>
                        <ul className='post-nav-list'>
                            <li className='post-nav-item'>
                                <Link to='posts/createpost' className='nav-link'>
                                    <p>+ Create Post</p>
                                </Link>
                            </li>
                            <li className='post-nav-item'>
                                <Link to='/topics/create' className='nav-link'>
                                    <p>+ Create Topic</p>
                                </Link>
                            </li>
                        </ul>
                    </div>    
                    <div className='user-nav'>
                        <ul className='user-nav-list'>
                            <li className='user-nav-item'>
                                <Link to='/user/profile' className='nav-link'>
                                    <p>Profile</p>
                                </Link>
                            </li>
                            <li className='user-nav-item'>
                                <button onClick={onLogout} className='logout-btn' >Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav