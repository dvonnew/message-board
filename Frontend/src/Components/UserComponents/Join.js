import React, {useContext, useState, useEffect } from 'react'
import { UserContext } from '../../Context/userContext'

const JoinTopic = (props) => {

    const [topic, setTopic] = useState({
        topic: props.topic._id
    })
    const [userContext, setUserContext] = useContext(UserContext)
    const [showJoin,setJoin] = useState({display: 'block'})
    const [showLeave, setLeave] = useState({display: 'none'})

    useEffect(() => {
        if(props.topic) {
            setTopic({topic: props.topic._id})
        }
    },[])

    useEffect(() => {
        if(userContext.details) {
            if(userContext.details.favorites.includes(topic.topic)) {
                setJoin({display: 'none'})
                setLeave({display: 'block'})
            }
        }
    }, [userContext])

    const onJoin = (e) => {
        e.preventDefault()
        fetch('/api/user/favoritetopic', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(topic)
        })
        .then(async res => {
            if(res.ok) {
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, details: data}
                })
            } else {
                return
            }
        })
    }

    const onLeave = (e) => {
        e.preventDefault()
        
        fetch('/api/user/unfavoritetopic', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`
            },
            body: JSON.stringify(topic)
        })
        .then(async res => {
            if(res.ok) {
                const data = await res.json()
                setUserContext(oldValues => {
                    return {...oldValues, details: data}
                })
                setJoin({display: 'block'})
                setLeave({display: 'none'})
            } else{
                return
            }
        })
    }

    return !userContext.details ? (
    <>
    </>
    ) :(
        <>
            <div className='join-box' style={showJoin}>
                <button className='join-topic-btn'  onClick={onJoin}>+ Join</button>     
            </div>
            <div className='leave-box' style={showLeave}>
                <button className='leave-topic-btn' onClick={onLeave}>- Leave</button>
            </div>
        </>
    ) 
}

export default JoinTopic