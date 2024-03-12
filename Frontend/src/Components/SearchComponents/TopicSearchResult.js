import React, {useSearchParams, useEffect} from 'react'
import { Link } from 'react-router-dom'

const TopicSearchResult = (props) => {

    const { topic } = props
    const url = `/topics/${topic.name}`
    const navStyle = {
        color: 'black'
    }

    console.log(topic.name)

    return (
        <>
             <div className='search-result-box'>
                <h1>
                    <Link style={navStyle} to={url} className='search-topic-title'>Topic: {topic.name}</Link>
                </h1>
            </div>
        </>
    )
}

export default TopicSearchResult