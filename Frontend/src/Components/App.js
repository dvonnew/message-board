import '../App.css';
import React, {useEffect, useContext, useCallback, useState } from 'react'
import { UserContext } from "../Context/userContext"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './UserComponents/Login'
import Topic from './TopicComponents/Topic'
import Nav from './NavComponents/Nav'
import Signup from './UserComponents/Signup';
import CreatePost from './PostComponents/CreatePost'
import PostPage from './PostComponents/PostPage'
import EditPost from './PostComponents/EditPost';
import CreateTopic from './TopicComponents/CreateTopic';
import UserProfile from './UserComponents/UserProfile';
import UpdateUser from './UserComponents/UpdateUser'
import ChangePassword from './UserComponents/ChangePassword';
import DeleteUser from './UserComponents/DeleteUser'
import Error from './ErrorComponents/Error';
import SearchResultsPage from './SearchComponents/SearchResultsPage'


const App = () => {

  const [userContext, setUserContext] = useContext(UserContext)

  const verifyUser = useCallback(() => {
    fetch('/api/user/refresh', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"}
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return {...oldValues, token: data.token}
        })
      } else {
        setUserContext(oldValues => {
          return {...oldValues, token: null}
        })
      }
      
      setTimeout(verifyUser, 5*60*1000)
    })
    .catch(error => console.log(error))
  }, [setUserContext])

  useEffect(() => {
    verifyUser()

  }, [verifyUser])

  const fetchUserDetails = useCallback(() => {
    fetch('/api/user/detail', {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      }
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, details: data}
        })
      } else {
          if (response.status === 404 ) {
            window.location.reload()
          } else {
            setUserContext(oldValues => {
              return {...oldValues, details: null}
            })
          }
        }

    })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    if (!userContext.details) {
    fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

  return (
    <>
      <Router>
        <div className='page'>
          <Nav />
          <div className='page-body'>
            <Routes>
              <Route path="/" exact element={<Topic verifyUser={verifyUser} />} />
              <Route path="/topics/:topicname" exact element={<Topic />} />
              <Route path="/topics/create" exact element={<CreateTopic />} />
              <Route path='/user/login' exact element={<Login />} />
              <Route path='/user/sign-up' exact element={<Signup />} />
              <Route path='/user/profile' exact element={<UserProfile />} />
              <Route path='user/profile/update' exact element={<UpdateUser />} />
              <Route path='user/profile/changepassword' exact element={<ChangePassword />} />
              <Route path='user/profile/delete' exact element={<DeleteUser />} />
              <Route path='/posts/createpost' exact element={<CreatePost />} />
              <Route path='/posts/:id' exact element={<PostPage />}/>
              <Route path='/posts/:id/edit' exact element={<EditPost />}/>
              <Route path='/search' exact element={<SearchResultsPage />} />
              <Route path='/*' exact element={<Error />}/>
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
