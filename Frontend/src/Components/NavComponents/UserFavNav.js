import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context/userContext";
import { Link } from "react-router-dom";

const UserNavFav = () => {

    const [ userContext, setUserContext ] = useContext(UserContext)
    const [ userFavorites, setUserFavorites ] = useState([])
    const [ showMore, setShowMore ] = useState(false)

    useEffect(() => {
        fetch(`/api/topics/favorites`, 
        {
            Method: 'GET',
            headers: {'Content-Type' : 'application/json',
            Authorization: `Bearer ${userContext.token}`
            }
        }).then((res) => {
            if (!res.ok) {
                return
            }
            return res.json()
        }).then((data) => {
            setUserFavorites(data)
        }).then(() => {
            console.log(userFavorites)
        })
    }, [])

    return userFavorites ? (
        <>    
            <div className="user-fav-nav">
                <ul className="user-fav-nav-list">
                    {!showMore ? userFavorites.map(navItem => (
                        <>
                            <li className="user-favorite-item">
                                <Link to={`/topics/${navItem.name}`} reloadDocument className='nav-link' key={navItem._id}>
                                    <p>{navItem.name}</p>
                                </Link>
                            </li>
                        </> )) : 
                    userFavorites.slice(0,5).map(navItem => (
                        <>
                             <li className="user-favorite-item">
                                <Link to={`/topics/${navItem.name}`} reloadDocument key={navItem._id} className='nav-link'>
                                    <p>{navItem.name}</p>
                                </Link>
                            </li>
                        </>
                    ))}
                </ul>
            </div>
        </>
    ) : (
        <>
        </>
    )
}

export default UserNavFav